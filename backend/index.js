// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://tech-kage.vercel.app',
    'https://techkage.app',
    'https://www.techkage.app',
    'https://tech-kage-production.up.railway.app'
  ],
  credentials: true,
}));

// ⚠️ Webhook MUST use raw body — register before express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// JSON parser for everything else
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────
const webhookRoute = require('./routes/webhook');
const buildRoutes = require('./routes/build');
const alternativePart = require('./routes/alternativePart');
const stripeRoute = require('./routes/stripe');
const subscribeRoute = require('./routes/subscribe');
const deleteAccountRoute = require('./routes/deleteAccount');
const partsRoute = require('./routes/parts');

app.use('/api', webhookRoute);
app.use('/api', buildRoutes);
app.use('/api', alternativePart);
app.use('/api', stripeRoute);
app.use('/api', subscribeRoute);
app.use('/api', deleteAccountRoute);
app.use('/api', partsRoute);

// ─── HEALTH CHECK ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── START ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});