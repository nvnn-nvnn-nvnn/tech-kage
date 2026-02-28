const { getPartNamesForCategory } = require('./partsCatalog');

function buildPrompt(config) {
  const constraints = [];
  
  // Budget constraint (always required)
  if (config.budget) {
    constraints.push(`Budget: $${config.budget} maximum, do not exceed this under any circumstances`);
  }

  // Use cases
  if (config.usage && config.usage.length > 0) {
    const useCases = config.usage.map(u => {
      const map = {
        gaming: "gaming",
        video_editing: "video editing",
        motion_graphics: "motion graphics/After Effects",
        "3d_rendering": "3D rendering (Blender/Maya)",
        streaming: "live streaming",
        programming: "software development",
        music: "music production/DAW",
        general: "general everyday use"
      };
      return map[u] || u;
    }).join(", ");
    constraints.push(`Primary use cases: ${useCases}`);
  }

  // Performance target
  if (config.performance) {
    const perfMap = {
      casual: "casual (1080p 60fps gaming, light workloads, budget-friendly)",
      enthusiast: "enthusiast (1440p 144fps gaming, regular video editing, best value tier)",
      pro: "professional (4K 144fps+ gaming, heavy 3D/video work, top-end parts, no compromises)"
    };
    constraints.push(`Performance target: ${perfMap[config.performance]}`);
  }

  // Cooling preference
  if (config.cooling) {
    const coolMap = {
      water: "liquid cooling (AIO or custom loop preferred)",
      air: "air cooling (tower cooler, reliable and quiet)"
    };
    constraints.push(`Cooling: ${coolMap[config.cooling]}`);
  }

  // Graphics priority
  if (config.graphics) {
    if (config.graphics === "yes") {
      constraints.push("GPU priority: maximize GPU budget allocation for graphics-heavy workloads");
    } else {
      constraints.push("Balanced build: even allocation across all components");
    }
  }

  // Form factor
  if (config.formFactor) {
    const formMap = {
      full: "full tower case",
      mid: "mid tower case",
      itx: "mini-ITX small form factor",
      any: "any form factor"
    };
    constraints.push(`Form factor: ${formMap[config.formFactor]}`);
  }

  // Noise sensitivity
  if (config.noise) {
    const noiseMap = {
      silent: "prioritize silent operation above all else",
      balanced: "balanced noise levels",
      performance: "performance first, noise is acceptable"
    };
    constraints.push(`Noise: ${noiseMap[config.noise]}`);
  }

  // RGB preference
  if (config.rgb) {
    const rgbMap = {
      yes: "include RGB lighting wherever possible",
      subtle: "subtle RGB accents only",
      no: "no RGB, prefer stealth aesthetic"
    };
    constraints.push(`Aesthetics: ${rgbMap[config.rgb]}`);
  }

  // Future proofing
  if (config.futureProof) {
    if (config.futureProof === "yes") {
      constraints.push("Future proofing: prefer newer platforms with upgrade paths (DDR5, PCIe 5.0, AM5 socket)");
    } else {
      constraints.push("Mature platforms acceptable, no upgrade path required");
    }
  }

  // Retailer preference
  if (config.retailer && config.retailer !== "any") {
    constraints.push(`Preferred retailer: ${config.retailer}`);
  }

  // User's extra notes
  if (config.extras && config.extras.trim()) {
    constraints.push(`Additional requirements: ${config.extras.trim()}`);
  }

  // For UPGRADE mode, include existing parts
  if (config.mode === "upgrade" && config.existingParts && config.existingParts.length > 0) {
    constraints.push(`User already owns: ${config.existingParts.join(", ")}. Do NOT recommend replacing these unless absolutely necessary for compatibility.`);
  }

  // Build the final prompt
  const prompt = `

  HARD BUDGET LIMIT: $${config.budget}. 
  The sum of ALL parts combined MUST be under $${config.budget}.
  If you cannot fit a category within budget, choose the cheapest option available.
  Do NOT exceed this number under any circumstances.

Build a PC with the following requirements:

${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For each category, you MUST choose from these specific parts only:
CPU: ${getPartNamesForCategory('CPU').join(', ')}
GPU: ${getPartNamesForCategory('GPU').join(', ')}
MOTHERBOARD: ${getPartNamesForCategory('MOTHERBOARD').join(', ')}
RAM: ${getPartNamesForCategory('RAM').join(', ')}
STORAGE: ${getPartNamesForCategory('STORAGE').join(', ')}
PSU: ${getPartNamesForCategory('PSU').join(', ')}
CASE: ${getPartNamesForCategory('CASE').join(', ')}
COOLING: ${getPartNamesForCategory('COOLING').join(', ')}

Return ONLY valid JSON in exactly this format with no additional text:
{
  "CPU": { "name": "exact product name", "reason": "one sentence why" },
  "GPU": { "name": "exact product name", "reason": "one sentence why" },
  "MOTHERBOARD": { "name": "exact product name", "reason": "one sentence why" },
  "RAM": { "name": "exact product name", "reason": "one sentence why" },
  "STORAGE": { "name": "exact product name", "reason": "one sentence why" },
  "PSU": { "name": "exact product name", "reason": "one sentence why" },
  "CASE": { "name": "exact product name", "reason": "one sentence why" },
  "COOLING": { "name": "exact product name", "reason": "one sentence why" }
}



Critical rules:
- All parts MUST be compatible (socket, chipset, DDR generation, power requirements)
- Do NOT exceed the budget
- Use current 2024/2025 parts that are actually available for purchase
- Prefer well-reviewed, reliable brands

REMINDER: Total of all parts must be $${config.budget} or less.
`.trim();

  return prompt;
}

module.exports = { buildPrompt };