// amazon.js

async function enrichBuild(buildData) {
  const enriched = {};
  const { getPartByName, getDefaultPart } = require('./partsCatalog');

  for (const [category, part] of Object.entries(buildData)) {
    try {
      const catalogPart = getPartByName(category, part.name) || getDefaultPart(category);

      enriched[category] = {
        ...part,
        ...catalogPart,
        // Generate affiliate link from ASIN
        link: catalogPart?.asin
          ? `https://www.amazon.com/dp/${catalogPart.asin}?tag=techkage-20`
          : null,
        reason: part.reason
      };

    } catch (error) {
      console.error(`Failed to lookup ${category}:`, error);
      enriched[category] = part;
    }
  }

  return enriched;
}