const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Initialize Stripe with timeout and retry configuration
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  timeout: 20000, // 20 seconds
  maxNetworkRetries: 2,
});

// ─── POST /api/create-checkout-session ───────────────────────────
// Called from Cart.jsx when user clicks "Checkout with Stripe"
// Body: { buildName, totalPrice, userId, buildData, config }

router.post("/create-checkout-session", async (req, res) => {
  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error(" STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Stripe is not configured on the server" });
  }

  if (!process.env.CLIENT_URL) {
    console.error(" CLIENT_URL is not set");
    return res.status(500).json({ error: "Client URL is not configured" });
  }

  console.log(" Stripe key present:", process.env.STRIPE_SECRET_KEY.substring(0, 7) + "...");
  console.log(" Client URL:", process.env.CLIENT_URL);

  const { buildName, totalPrice, userId, buildData, config } = req.body;

  const buildSummary = Object.entries(buildData || {}).reduce((acc, [cat, part]) => {
    acc[cat] = { name: part.name, price: part.price };
    return acc;
  }, {});

  // Basic validation
  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({ error: "Invalid total price" });
  }

  const LABOUR_FEE = 150; // ← change this to your actual labour fee
  const grandTotal = Math.round(totalPrice * 100);

  console.log("Creating Stripe session for:", { buildName, totalPrice, grandTotal });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX"], // ← add whatever countries you ship to
      },
      phone_number_collection: {
        enabled: true,
      },

      // What shows on the Stripe checkout page
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: buildName || "Custom PC Build",
              description: `Parts + $${LABOUR_FEE} labour fee · Tech Kage`,
            },
            unit_amount: grandTotal,
          },
          quantity: 1,
        },
      ],

      // Metadata — passed to webhook so we can write the order to Supabase
      metadata: {
        user_id: userId || "",
        build_name: buildName || "Custom Build",
        total_price: totalPrice.toString(),
        build_summary: JSON.stringify(buildSummary),
        order_type: config?.mode === "upgrade" ? "upgrade" : "custom_build",
      },

      // Store build data for webhook (metadata has 500 char limit so we use this)
      payment_intent_data: {
        metadata: {
          user_id: userId || "",
          build_name: buildName || "Custom Build",
        },
      },

      // Where Stripe redirects after payment
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe error details:");
    console.error("Message:", err.message);
    console.error("Type:", err.type);
    console.error("Code:", err.code);
    console.error("Status:", err.statusCode);
    console.error("Full error:", JSON.stringify(err, null, 2));

    // Return user-friendly error
    res.status(500).json({
      error: err.message || "Failed to create checkout session",
      details: err.type || "unknown_error"
    });
  }
});

module.exports = router;