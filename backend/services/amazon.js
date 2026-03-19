// amazon.js

async function enrichBuild(buildData) {
  const enriched = {};
  const { getPartByName, getDefaultPart } = require('./partsLoader');

  for (const [category, part] of Object.entries(buildData)) {
    try {
      console.log(`[enrichBuild] Looking up ${category}: "${part.name}"`);

      const catalogPart = getPartByName(category, part.name);

      if (!catalogPart) {
        console.warn(`[enrichBuild] No match found for ${category}: "${part.name}", using default`);
        const defaultPart = getDefaultPart(category);
        if (!defaultPart) {
          console.error(`[enrichBuild] No default part available for ${category}!`);
        }
      }

      const finalPart = catalogPart || getDefaultPart(category);

      // Validate ASIN format (should be 10 alphanumeric characters)
      const isValidAsin = finalPart?.asin && /^[A-Z0-9]{10}$/.test(finalPart.asin);

      if (!isValidAsin && finalPart?.asin) {
        console.warn(`[enrichBuild] Invalid ASIN for ${category} - ${finalPart.name}: ${finalPart.asin}`);
      }

      if (!finalPart) {
        console.error(`[enrichBuild] CRITICAL: No part data available for ${category}`);
      }

      enriched[category] = {
        ...part,
        ...finalPart,
        // Generate affiliate link only if ASIN is valid
        link: isValidAsin
          ? `https://www.amazon.com/dp/${finalPart.asin}?tag=techkage-20`
          : null,
        reason: part.reason,
        // Add flag if link is missing
        linkStatus: isValidAsin ? 'valid' : 'missing'
      };

    } catch (error) {
      console.error(`Failed to lookup ${category}:`, error);
      enriched[category] = {
        ...part,
        link: null,
        linkStatus: 'error'
      };
    }
  }

  return enriched;
}

module.exports = { enrichBuild };