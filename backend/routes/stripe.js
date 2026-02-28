const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─── POST /api/create-checkout-session ───────────────────────────
// Called from Cart.jsx when user clicks "Checkout with Stripe"
// Body: { buildName, totalPrice, userId, buildData, config }

router.post("/create-checkout-session", async (req, res) => {
  const { buildName, totalPrice, userId, buildData, config } = req.body;

  // Basic validation
  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({ error: "Invalid total price" });
  }



  const LABOUR_FEE = 150; // ← change this to your actual labour fee
  const grandTotal = Math.round(totalPrice * 100);

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
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;