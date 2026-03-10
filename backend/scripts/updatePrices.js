require('dotenv').config();
const { supabase } = require('../config/supabase');
const { PriceService } = require('../services/priceService');

async function updateAllPrices() {
  // Create price service instance
  const priceService = new PriceService();

  // Get all parts
  const { data: parts, error } = await supabase
    .from('parts')
    .select('id, name, asin, category')
    .not('asin', 'is', null);

  if (error) {
    console.error('Error fetching parts:', error);
    return;
  }

  if (!parts || parts.length === 0) {
    console.log('No parts found');
    return;
  }

  console.log(`Updating ${parts.length} parts...`);

  let succeeded = 0;
  let failed = 0;

  for (const part of parts) {
    try {
      console.log(`Fetching price for: ${part.name}`);

      const priceData = await priceService.fetchAmazonPrice(part.asin);

      // Check if we got valid data
      if (!priceData || !priceData.price) {
        console.log(`⚠️ No price data for ${part.name}`);
        failed++;
        continue;
      }

      // Parse price (remove $ if present)
      const newPrice = typeof priceData.price === 'string'
        ? parseFloat(priceData.price.replace('$', ''))
        : priceData.price;

      // Update current price
      const { error: updateError } = await supabase
        .from('current_prices')
        .upsert({
          part_id: part.id,
          price: newPrice,
          retailer: 'Amazon',
          product_url: `https://www.amazon.com/dp/${part.asin}`,
          availability: priceData.availability || 'Unknown',
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'part_id,retailer'
        });

      if (updateError) {
        console.error(`Failed to update ${part.name}:`, updateError);
        failed++;
        continue;
      }

      // Add to price history
      await supabase
        .from('price_history')
        .insert({
          part_id: part.id,
          price: newPrice,
          retailer: 'Amazon',
          recorded_at: new Date().toISOString()
        });

      console.log(`✓ Updated ${part.name} — $${newPrice}`);
      succeeded++;

    } catch (error) {
      console.error(`Failed for ${part.name}:`, error.message);
      failed++;
    }

    // Rate limiting - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);
}

updateAllPrices()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
