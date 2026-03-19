// build.js
// Main API endpoint that orchestrates everything

const express = require('express');
const router = express.Router();
const { getCatalog, getDefaultPart } = require('../services/partsLoader');
const { generateBuild } = require('../services/claude');
const { enrichBuild } = require('../services/amazon');
const { buildPrompt } = require('../services/promptBuilder');
const { CompatibilityChecker } = require('../services/compatibilityChecker');

router.post('/generate-build', async (req, res) => {
  try {
    const config = req.body;

    // Validate config has required fields
    if (!config.mode) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: mode"
      });
    }

    // Step 1: Build the prompt from user config
    console.log("Building prompt from config...");
    const prompt = buildPrompt(config);
    console.log("Prompt:", prompt);

    // Step 2: Send to Claude
    console.log("Calling Claude API...");
    const claudeResponse = await generateBuild(prompt, config.budget);

    if (!claudeResponse.success) {
      return res.status(500).json({
        success: false,
        error: "Claude API failed",
        details: claudeResponse.error
      });
    }

    console.log("Claude returned:", claudeResponse.build);
    console.log("Tokens used:", claudeResponse.tokensUsed);

    // Validate that Claude picked valid parts from catalog
    const CATALOG = getCatalog();
    const validatedBuild = {};
    for (const [category, part] of Object.entries(claudeResponse.build)) {
      const catalogParts = CATALOG[category] || [];
      const isValid = catalogParts.some(p => {
        const catalogName = p.name.toLowerCase();
        const claudeName = part.name.toLowerCase();
        return catalogName.includes(claudeName) || claudeName.includes(catalogName);
      });
      if (isValid) {
        validatedBuild[category] = part;
      } else {
        console.log(`Invalid part for ${category}: ${part.name}, using default`);
        const defaultPart = getDefaultPart(category);
        validatedBuild[category] = { name: defaultPart.name, reason: "Default choice - Claude picked invalid part" };
      }
    }

    // Step 3: Enrich with Amazon data
    console.log("Enriching with Amazon data...");
    const enrichedBuild = await enrichBuild(validatedBuild);

    // Adding Compatibility Check
    console.log("Validating build compatibility...");
    const checker = new CompatibilityChecker();
    let compatibilityResult = checker.validateBuild(enrichedBuild);
    console.log("Compatibility check:", compatibilityResult);



    if (!compatibilityResult.isValid) {
      console.warn("Build has compatibility issues:", compatibilityResult.errors);
      for (const error of compatibilityResult.errors) {



        // if (error.type === "case") {
        //   // Case Swap 

        //   const caseFormFactor = enrichedBuild.CASE.type;
        //   const moboFormFactor = enrichedBuild.MOTHERBOARD.form_factor;

        //   // Verify what it has.. 



        //   const compatibleMoboCase = CATALOG.MOTHERBOARD.find(moboItem =>
        //     moboItem.form_factor === caseFormFactor
        //   );

        //   if (compatibleMoboCase) {
        //     console.log("Compatible case found:", compatibleMoboCase.name);
        //     enrichedBuild.MOTHERBOARD = compatibleMoboCase;
        //   }



        // }


        if (error.type === "case") {
          const caseFormFactor = enrichedBuild.CASE.type;
          const moboFormFactor = enrichedBuild.MOTHERBOARD.form_factor;

          const caseStr = caseFormFactor.toLowerCase();

          let caseTier;
          if (caseStr.includes("full")) caseTier = "full";
          else if (caseStr.includes("mid")) caseTier = "mid";
          else if (caseStr.includes("microatx") || caseStr.includes("micro atx")) caseTier = "micro";
          else if (caseStr.includes("mini itx")) caseTier = "mini";

          const tierCompatibility = {
            full: ["ATX", "Micro ATX", "Mini ITX"],
            mid: ["ATX", "Micro ATX", "Mini ITX"],
            micro: ["Micro ATX", "Mini ITX"],
            mini: ["Mini ITX"]
          };

          const allowedFormFactors = tierCompatibility[caseTier];

          if (!allowedFormFactors) {
            console.warn("Could not determine case tier for:", caseFormFactor);
            continue;
          }

          const moboIsCompatible = allowedFormFactors.includes(moboFormFactor);

          if (!moboIsCompatible) {
            const compatibleMobo = CATALOG.MOTHERBOARD.find(mobo =>
              allowedFormFactors.includes(mobo.form_factor)
            );

            if (compatibleMobo) {
              console.log("Compatible motherboard found:", compatibleMobo.name);
              enrichedBuild.MOTHERBOARD = compatibleMobo;
            }
          }
        }


        if (error.type === "socket") {
          const motherboard = enrichedBuild.MOTHERBOARD;
          const currentSocket = motherboard?.socket;

          if (!currentSocket) {
            console.warn("Could not determine motherboard socket, skipping socket fix");
            continue;
          }

          const normalize = (s) => s?.toString().toUpperCase().replace(/\s/g, '');

          const intelSockets = ['LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA2066'];
          const amdSockets = ['AM5', 'AM4', 'AM3+', 'TR4', 'TRX40'];

          const moboIsIntel = intelSockets.some(s => normalize(s) === normalize(currentSocket));
          const moboIsAMD = amdSockets.some(s => normalize(s) === normalize(currentSocket));

          const compatibleCPU = CATALOG.CPU.find(cpu => {
            const cpuSocket = cpu.socket;
            if (!cpuSocket) return false;

            if (normalize(cpuSocket) !== normalize(currentSocket)) return false;

            const cpuIsIntel = intelSockets.some(s => normalize(s) === normalize(cpuSocket));
            const cpuIsAMD = amdSockets.some(s => normalize(s) === normalize(cpuSocket));

            if (moboIsIntel && !cpuIsIntel) return false;
            if (moboIsAMD && !cpuIsAMD) return false;

            return true;
          });

          if (compatibleCPU) {
            console.log("Compatible CPU found:", compatibleCPU.name);
            enrichedBuild.CPU = compatibleCPU;
          } else {
            console.warn("No compatible CPU found for socket:", currentSocket);
          }
        }


        // RAM CHECK
        if (error.type === "ram") {
          // RAM SWAPPING
          // FIX: Match RAM to motherboard's memory_type instead of hardcoding DDR5
          // This ensures compatibility when motherboard only supports DDR4
          const moboMemoryType = enrichedBuild.MOTHERBOARD?.memory_type;

          const compatibleRam = CATALOG.RAM.find(ram =>
            ram.memory_type === moboMemoryType
          );

          if (compatibleRam) {
            console.log("Compatible RAM found:", compatibleRam.name);
            enrichedBuild.RAM = compatibleRam;
          } else {
            console.warn("No compatible RAM found for memory type:", moboMemoryType);
          }
        }

        if (error.type === "ram_slots") {
          // FIX: Added brand validation (Intel vs AMD) to socket check
          const cpuSocket = enrichedBuild.CPU?.socket;
          const normalize = (s) => s?.toString().toUpperCase().replace(/\s/g, '');
          const intelSockets = ['LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA2066'];
          const amdSockets = ['AM5', 'AM4', 'AM3+', 'TR4', 'TRX40'];

          const cpuIsIntel = intelSockets.some(s => normalize(s) === normalize(cpuSocket));
          const cpuIsAMD = amdSockets.some(s => normalize(s) === normalize(cpuSocket));

          const compatibleMoboSlots = CATALOG.MOTHERBOARD.find(mobo => {
            if (mobo.memory_slots < enrichedBuild.RAM.modules) return false;
            if (normalize(mobo.socket) !== normalize(cpuSocket)) return false;

            // Verify brand match
            const moboIsIntel = intelSockets.some(s => normalize(s) === normalize(mobo.socket));
            const moboIsAMD = amdSockets.some(s => normalize(s) === normalize(mobo.socket));

            if (cpuIsIntel && !moboIsIntel) return false;
            if (cpuIsAMD && !moboIsAMD) return false;

            return true;
          });

          if (compatibleMoboSlots) {
            console.log("Compatible motherboard with enough RAM slots found:", compatibleMoboSlots.name);
            enrichedBuild.MOTHERBOARD = compatibleMoboSlots;
          }
        }


        if (error.type === "ram_capacity") {
          // Ram Capacity
          // FIX: Added socket and brand compatibility checks to prevent Intel/AMD mismatch
          const cpuSocket = enrichedBuild.CPU?.socket;
          const normalize = (s) => s?.toString().toUpperCase().replace(/\s/g, '');
          const intelSockets = ['LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA2066'];
          const amdSockets = ['AM5', 'AM4', 'AM3+', 'TR4', 'TRX40'];

          const cpuIsIntel = intelSockets.some(s => normalize(s) === normalize(cpuSocket));
          const cpuIsAMD = amdSockets.some(s => normalize(s) === normalize(cpuSocket));

          const compatibleMoboCap = CATALOG.MOTHERBOARD.find(mobo => {
            if (mobo.max_memory < enrichedBuild.RAM.capacity_gb) return false;
            if (normalize(mobo.socket) !== normalize(cpuSocket)) return false;

            // Verify brand match
            const moboIsIntel = intelSockets.some(s => normalize(s) === normalize(mobo.socket));
            const moboIsAMD = amdSockets.some(s => normalize(s) === normalize(mobo.socket));

            if (cpuIsIntel && !moboIsIntel) return false;
            if (cpuIsAMD && !moboIsAMD) return false;

            return true;
          });

          if (compatibleMoboCap) {
            console.log("Compatible motherboard with enough RAM capacity found:", compatibleMoboCap.name);
            enrichedBuild.MOTHERBOARD = compatibleMoboCap;
          }
        }


        if (error.type === "psu") {
          // PSU SWAPPING

          const cpuTdp = enrichedBuild.CPU.tdp;
          const gpuTdp = enrichedBuild.GPU?.tdp || 0;
          const systemOverhed = 100;  // 100W overhead for other components
          const totalTdp = cpuTdp + gpuTdp + systemOverhed;

          const reccomended = Math.ceil((totalTdp) * 1.2);


          const compatiblePSU = CATALOG.PSU.find(psu =>
            psu.wattage >= reccomended
          );


          if (compatiblePSU) {
            console.log("Compatible PSU found:", compatiblePSU.name);
            enrichedBuild.PSU = compatiblePSU;
          }

        }


      }
    }

    // rebuild with proper specifications
    let revalidated = checker.validateBuild(enrichedBuild);

    console.log("After Auto Fix:", revalidated)

    compatibilityResult = revalidated;

    if (compatibilityResult.warnings.length > 0) {
      console.warn("Build has compatibility warnings:", compatibilityResult.warnings);
    }

    // Step 4: Calculate total and enforce budget
    let totalPrice = Object.values(enrichedBuild)
      .reduce((sum, part) => sum + (part.priceNumeric || 0), 0);

    console.log("Budget debug:", { totalPrice, budget: config.budget, parts: Object.keys(enrichedBuild) });
    console.log("Part prices:", Object.values(enrichedBuild).map(p => ({ name: p.name, price: p.priceNumeric })));
    console.log(`Budget check: $${totalPrice} > $${config.budget} = ${totalPrice > config.budget}`);

    if (totalPrice > config.budget) {
      //   console.warn(`Build over budget: $${totalPrice}, enforcing $${config.budget}`);

      //   // Sort categories by price descending — swap most expensive first
      //   const sorted = Object.entries(enrichedBuild)
      //     .sort(([, a], [, b]) => b.priceNumeric - a.priceNumeric);

      //   for (const [category] of sorted) {
      //     if (totalPrice <= config.budget) break;

      //     // Map category to PARTS_CATALOG key (uppercase)
      //     const catalogKey = category.toUpperCase();
      //     const catalogPartsRaw = CATALOG[catalogKey];

      //     // Skip if category not found in catalog
      //     if (!catalogPartsRaw || catalogPartsRaw.length === 0) {
      //       console.log(`Category ${category} (${catalogKey}) not found in catalog, skipping`);
      //       continue;
      //     }

      //     const catalogParts = catalogPartsRaw
      //       .filter(p => p.name !== enrichedBuild[category].name)
      //       .sort((a, b) => a.priceNumeric - b.priceNumeric);

      //     for (const cheaper of catalogParts) {
      //       const saving = enrichedBuild[category].priceNumeric - cheaper.priceNumeric;
      //       if (saving > 0) {
      //         console.log(`Swapping ${category}: ${enrichedBuild[category].name} → ${cheaper.name} (saves $${saving})`);
      //         enrichedBuild[category] = cheaper;
      //         totalPrice -= saving;
      //         if (totalPrice <= config.budget) break;
      //       }
      //     }
      //   }

      //   console.log(`Final total after enforcement: $${totalPrice}`);

      // If still over budget after swaps, return build with warning
      //   if (totalPrice > config.budget) {
      const difference = totalPrice - config.budget;
      return res.json({
        success: true,
        build: enrichedBuild,
        totalPrice,
        budgetWarning: `This build comes in at $${totalPrice.toFixed(2)}, which is $${difference.toFixed(2)} over your $${config.budget} budget.`,
        difference: difference,
        compatibilityResult: compatibilityResult
      });
    }

    // Return everything to frontend
    console.log("Final build links:", Object.entries(enrichedBuild).map(([cat, part]) =>
      `${cat}: ${part.link || 'NO LINK'} (ASIN: ${part.asin || 'NO ASIN'})`
    ).join(', '));

    res.json({
      success: true,
      build: enrichedBuild,
      totalPrice,
      tokensUsed: claudeResponse.tokensUsed,
      config,
      compatibilityResult: compatibilityResult
    });

  } catch (error) {
    console.error("Build generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



module.exports = router;