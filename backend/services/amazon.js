// amazon.js

async function enrichBuild(buildData) {
  const enriched = {};
  const { getPartByName, getDefaultPart } = require('./partsLoader');

  for (const [category, part] of Object.entries(buildData)) {
    try {
      const catalogPart = getPartByName(category, part.name) || getDefaultPart(category);

      // Validate ASIN format (should be 10 alphanumeric characters)
      const isValidAsin = catalogPart?.asin && /^[A-Z0-9]{10}$/.test(catalogPart.asin);

      if (!isValidAsin && catalogPart?.asin) {
        console.warn(`Invalid ASIN for ${category} - ${catalogPart.name}: ${catalogPart.asin}`);
      }

      enriched[category] = {
        ...part,
        ...catalogPart,
        // Generate affiliate link only if ASIN is valid
        link: isValidAsin
          ? `https://www.amazon.com/dp/${catalogPart.asin}?tag=techkage-20`
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