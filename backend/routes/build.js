// build.js
// Main API endpoint that orchestrates everything

const express = require('express');
const router = express.Router();
const { PARTS_CATALOG, getDefaultPart } = require('../services/partsCatalog');
const { generateBuild } = require('../services/claude');
const { enrichBuild } = require('../services/amazon');
const { buildPrompt } = require('../services/promptBuilder');

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
    const validatedBuild = {};
    for (const [category, part] of Object.entries(claudeResponse.build)) {
      const catalogParts = PARTS_CATALOG[category] || [];
      const isValid = catalogParts.some(p => p.name.toLowerCase() === part.name.toLowerCase());
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

    // Step 4: Calculate total and enforce budget
    let totalPrice = Object.values(enrichedBuild)
      .reduce((sum, part) => sum + (part.priceNumeric || 0), 0);

    console.log("Budget debug:", { totalPrice, budget: config.budget, parts: Object.keys(enrichedBuild) });
    console.log("Part prices:", Object.values(enrichedBuild).map(p => ({ name: p.name, price: p.priceNumeric })));
    console.log(`Budget check: $${totalPrice} > $${config.budget} = ${totalPrice > config.budget}`);

    if (totalPrice > config.budget) {
      console.warn(`Build over budget: $${totalPrice}, enforcing $${config.budget}`);

      // Sort categories by price descending — swap most expensive first
      const sorted = Object.entries(enrichedBuild)
        .sort(([, a], [, b]) => b.priceNumeric - a.priceNumeric);

      for (const [category] of sorted) {
        if (totalPrice <= config.budget) break;

        const catalogParts = PARTS_CATALOG[category]
          .filter(p => p.name !== enrichedBuild[category].name)
          .sort((a, b) => a.priceNumeric - b.priceNumeric);

        for (const cheaper of catalogParts) {
          const saving = enrichedBuild[category].priceNumeric - cheaper.priceNumeric;
          if (saving > 0) {
            console.log(`Swapping ${category}: ${enrichedBuild[category].name} → ${cheaper.name} (saves $${saving})`);
            enrichedBuild[category] = cheaper;
            totalPrice -= saving;
            break;
          }
        }
      }

      console.log(`Final total after enforcement: $${totalPrice}`);

      // If still over after all swaps, return a warning
      if (totalPrice > config.budget) {
        return res.json({
          success: true,
          build: enrichedBuild,
          totalPrice,
          budgetWarning: `This build comes in at $${totalPrice}, which is $${totalPrice - config.budget} over your $${config.budget} budget.`,
        });
      }
    }

    // Return everything to frontend
    res.json({
      success: true,
      build: enrichedBuild,
      totalPrice,
      tokensUsed: claudeResponse.tokensUsed,
      config,
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