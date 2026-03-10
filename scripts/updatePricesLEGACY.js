import dotenv from 'dotenv';
import { supabase } from '../backend/config/supabase.js';
import { fetchAmazonPrice } from '../backend/services/priceService.js';




dotenv.config();

async function updateAllPrices() {


    const { data, error } = await supabase
        .from('parts')
        .select('id, name, asin, category')
        .not('asin', 'is', null);

    if (error) {
        console.error('Error fetching parts:', error);
        return;
    }

    console.log('Fetched parts:', data);

    for (const part of data) {
        if (!part.asin) {
            console.log(`Skipping ${part.name} — no ASIN`);
            continue;
        }

        try {
            console.log(`Updating price for: ${part.name}`);
            const { newPrice, availabilityStatus } = await fetchAmazonPrice(part.asin);

            const { error } = await supabase
                .from('current_prices')
                .upsert({
                    part_id: part.id,
                    price: newPrice,
                    retailer: 'Amazon',
                    product_url: `https://www.amazon.com/dp/${part.asin}`,
                    availability: availabilityStatus,
                    last_updated: new Date().toISOString()
                });

            if (error) {
                console.error(`Failed to update price for ${part.name}:`, error);
            }

            console.log(`✓ Updated ${part.name} — $${newPrice}`);

        } catch (error) {
            console.error(`Failed to fetch price for ${part.name}:`, error.message);
            continue; // skip to next part, don't crash the whole loop
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between requests
    }
    console.log('Updated all prices');



}

updateAllPrices();
