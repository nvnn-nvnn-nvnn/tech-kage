// backend/services/priceService.js
const { supabase } = require('../config/supabase');

// Node Fetch




class PriceService {
    // Fetch price from API (Rainforest, Amazon, etc.)
    async fetchAmazonPrice(asin) {
        try {
            const response = await fetch(`https://api.rainforestapi.com/request?api_key=${process.env.RAINFOREST_API_KEY}&amazon_domain=amazon.com&asin=${asin}&type=product&variant_prices=false&currency=usd&language=en_US&associate_id=techkage-20`);

            if (!response.ok) {
                throw new Error(`Rainforest API error: ${response.status}`);
            }

            const data = await response.json();

            // Check if data exists
            if (!data.product || !data.product.buybox_winner) {
                return { price: 0, availability: 'Out of Stock', shipping: 0 };
            }

            return {
                price: data.product.buybox_winner.price.raw,
                availability: data.product.buybox_winner.availability.raw,
                shipping: 0
            };
        } catch (error) {
            console.error(`Error fetching price for ASIN ${asin}:`, error);
            return { price: 0, availability: 'Unknown', shipping: 0 };
        }
    }

    // Update a single part's price
    async updatePartPrice(partId, asin) {
        const priceData = await this.fetchAmazonPrice(asin);

        // Get current price
        const { data: currentPrice } = await supabase
            .from('current_prices')
            .select('price')
            .eq('part_id', partId)
            .eq('retailer', 'Amazon')
            .single();

        // Update current price
        await supabase
            .from('current_prices')
            .upsert({
                part_id: partId,
                retailer: 'Amazon',
                price: priceData.price,
                availability: priceData.availability,
                last_updated: new Date().toISOString()
            });

        // If price changed, add to history
        if (!currentPrice || currentPrice.price !== priceData.price) {
            await supabase.from('price_history').insert({
                part_id: partId,
                retailer: 'Amazon',
                price: priceData.price
            });
        }
    }

    // Update all parts (run on schedule)
    async updateAllPrices() {
        const { data: parts } = await supabase
            .from('parts')
            .select('id, asin')
            .not('asin', 'is', null);

        for (const part of parts) {
            await this.updatePartPrice(part.id, part.asin);
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Get price history for a part
    async getPriceHistory(partId, days = 30) {
        const { data } = await supabase
            .from('price_history')
            .select('*')
            .eq('part_id', partId)
            .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000))
            .order('recorded_at', { ascending: true });

        return data;
    }
}

module.exports = { PriceService };