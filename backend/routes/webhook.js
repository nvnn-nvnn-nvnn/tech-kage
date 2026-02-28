const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase service role client — bypasses RLS so we can write orders
// Use the SERVICE ROLE key here, NOT the anon key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── POST /api/webhook ───────────────────────────────────────────
// Stripe sends events here after payment
// IMPORTANT: This route needs raw body — set up in server.js (see note below)

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  // Verify the webhook came from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ── Handle payment success ────────────────────────────────────
if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  console.log("✓ Event received:", event.type);
  console.log("Payment status:", session.payment_status);
  console.log("Metadata:", session.metadata);
  console.log("Shipping:", session.shipping_details);
  console.log("Customer:", session.customer_details);

  const shipping = session.shipping_details;
  const customer = session.customer_details;

  if (session.payment_status !== "paid") return res.json({ received: true });

  const { user_id, build_name, total_price } = session.metadata;

  console.log("Inserting order for user:", user_id);

  try {
    const { data, error } = await supabase.from("orders").insert({
      user_id:           user_id || null,
      stripe_session_id: session.id,
      build_data:        { build_name },
      total_price:       parseFloat(total_price) || 0,
      status:            "paid",
      shipping_address:  shipping?.address,
      customer_name:     customer?.name,
      customer_email:    customer?.email,
      customer_phone:    customer?.phone,
    });

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase insert failed:", error.message);
      return res.status(500).json({ error: "DB write failed" });
    }

    console.log(`✓ Order written for session ${session.id}`);
  } catch (err) {
    console.error("Webhook handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

  res.json({ received: true });
});

module.exports = router;