// amazon.js
// Mock Amazon API lookup (will be replaced with real API later)

async function lookupPart(partName, category) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));


  // Mock pricing logic based on category
  const mockPrices = {
    CPU: [299, 399, 549, 699],
    GPU: [449, 599, 899, 1199],
    MOTHERBOARD: [179, 249, 349, 449],
    RAM: [89, 129, 179, 249],
    STORAGE: [99, 149, 199, 299],
    PSU: [89, 129, 179, 229],
    CASE: [79, 119, 169, 229],
    COOLING: [69, 119, 189, 249]
  };

  const prices = mockPrices[category] || [99, 149, 199];
  const price = prices[Math.floor(Math.random() * prices.length)];

  // Mock Amazon-shaped response
  return {
    name: partName,
    price: `$${price}`,
    priceNumeric: price,
    rating: (4.5 + Math.random() * 0.4).toFixed(1), // 4.5-4.9 stars
    reviewCount: Math.floor(Math.random() * 5000) + 500,
    asin: `B0${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    url: `https://amazon.com/dp/MOCK_${category}`,
    imageUrl: `https://via.placeholder.com/300x300.png?text=${category}`,
    inStock: Math.random() > 0.1, // 90% in stock
    prime: Math.random() > 0.3,   // 70% prime eligible
    category: category
  };
}

async function enrichBuild(buildData) {
  const enriched = {};
  const { getPartByName, getDefaultPart } = require('./partsCatalog');
  for (const [category, part] of Object.entries(buildData)) {
    try {
      // const amazonData = await lookupPart(part.name, category);
      
      // enriched[category] = {
      //   ...part,
      //   ...amazonData,
      //   // Keep Claude's reason
      //   reason: part.reason
      // };

       const catalogPart = getPartByName(category, part.name) || getDefaultPart(category);
       enriched[category] = {
        ...part,
        ...catalogPart,
        // Keep Claude's reason
        reason: part.reason
       };

    } catch (error) {
      console.error(`Failed to lookup ${category}:`, error);
      // Return part without enrichment if lookup fails
      enriched[category] = part;
    }
  }

  return enriched;
}

module.exports = { lookupPart, enrichBuild };