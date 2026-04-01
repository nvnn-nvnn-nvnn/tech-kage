// routes/parts.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { PriceService } = require('../services/priceService');

// Get parts by category with current prices
router.get('/parts/:category', async (req, res) => {
    const { category } = req.params;

    const { data, error } = await supabase
        .from('parts')
        .select(`
            *,
            current_prices (
                retailer,
                price,
                availability,
                product_url,
                last_updated
            )
        `)
        .eq('category', category)
        .order('name');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get price history
router.get('/parts/:id/price-history', async (req, res) => {
    const { id } = req.params;
    const days = req.query.days || 30;

    const priceService = new PriceService();
    const history = await priceService.getPriceHistory(id, days);

    res.json(history);
});

module.exports = router;