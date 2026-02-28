// index.js
// Express server entry point

require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');


const buildRoutes = require('./routes/build');


const app = express();
const PORT = process.env.PORT || 3001;


// ─── MIDDLEWARE ───────────────────────────────────────────────────

app.use(cors());

// ⚠️ Webhook route MUST be registered BEFORE express.json()
// Stripe sends a raw buffer — if express.json() parses it first,
// the signature verification will fail with a 400 error.
const webhookRoute = require('./routes/webhook');
app.use('/api', webhookRoute);

// Now safe to parse JSON for all other routes
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────

const alternativePart   = require('./routes/alternativePart');
const stripeRoute       = require('./routes/stripe');

app.use('/api', buildRoutes);
app.use('/api', alternativePart);
app.use('/api', stripeRoute);

// ─── HEALTH CHECK ────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    endpoints: [
      'POST /api/generate-build',
      'POST /api/alternative-part',
      'POST /api/create-checkout-session',
      'POST /api/webhook',
    ]
  });
});

// ─── START ────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Build endpoint: http://localhost:${PORT}/api/generate-build`);
  console.log(`Stripe checkout: POST http://localhost:${PORT}/api/create-checkout-session`);
  console.log(`Stripe webhook: POST http://localhost:${PORT}/api/webhook`);
});