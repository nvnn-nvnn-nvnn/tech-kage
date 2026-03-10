require('dotenv').config(); // Will load backend/.env when run from backend/
const { PriceService } = require('./services/priceService');

const priceService = new PriceService();

// AMD Ryzen 7 7800X3D 8-Core, 16-Thread Desktop Processor

priceService.fetchAmazonPrice('B0BTZB7F88')
    .then(result => {
        console.log('Price data:', result);
    })
    .catch(err => {
        console.error('Error:', err);
    });