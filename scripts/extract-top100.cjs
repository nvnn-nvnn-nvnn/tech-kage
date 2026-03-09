const fs = require('fs');
const path = require('path');

const categories = [
  'cpu',
  'cpu-cooler',
  'motherboard',
  'memory',
  'internal-hard-drive',
  'video-card',
  'case',
  'power-supply'
];

const srcDir = path.join(__dirname, '../src/json');
const outputDir = path.join(__dirname, '../src/json/top100');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

categories.forEach(cat => {
  try {
    const inputPath = path.join(srcDir, `${cat}.json`);
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Get top 100 parts
    const top100 = data.slice(0, 100);
    
    // Add empty asin field to each part for you to fill in
    const top100WithAsin = top100.map(part => ({
      ...part,
      asin: "" // You'll fill this in manually
    }));
    
    const outputPath = path.join(outputDir, `${cat}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(top100WithAsin, null, 2));
    
    console.log(`✓ Created ${cat}.json with ${top100WithAsin.length} items`);
  } catch (error) {
    console.error(`✗ Failed to process ${cat}:`, error.message);
  }
});

console.log(`\n✓ All top 100 files created in: ${outputDir}`);
