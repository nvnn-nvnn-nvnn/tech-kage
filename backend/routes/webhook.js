const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");
const { sendEmail } = require("../services/email");

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

router.post("/webhook", async (req, res) => {
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
    const shipping = session.shipping_details;
    const customer = session.customer_details;

    if (session.payment_status !== "paid") return res.json({ received: true });

    const { user_id, build_name, total_price, build_summary, order_type } = session.metadata;

    // Parse the parts list
    let buildParts = null;
    try { buildParts = build_summary ? JSON.parse(build_summary) : null; }
    catch { buildParts = null; }

    const { error } = await supabase.from("orders").insert({
      user_id: user_id || null,
      stripe_session_id: session.id,
      build_data: {                    // 👈 now stores actual parts
        build_name,
        order_type: order_type || "custom_build",
        parts: buildParts,
      },
      total_price: parseFloat(total_price) || 0,
      status: "paid",
      shipping_address: shipping?.address,
      customer_name: customer?.name,
      customer_email: customer?.email,
      customer_phone: customer?.phone,
    });

    if (error) {
      console.error("Supabase insert failed:", error.message);
      return res.status(500).json({ error: "DB write failed" });
    }

    // Confirmation email with parts list
    if (customer?.email) {
      const partsHtml = buildParts
        ? Object.entries(buildParts).map(([cat, part]) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #222;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${cat}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;font-weight:600;color:#fff;">${part.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #222;text-align:right;color:#0FD980;font-weight:700;">${part.price}</td>
          </tr>`).join('')
        : `<tr><td colspan="3" style="padding:12px;">No parts data available</td></tr>`;

      await sendEmail(
        customer.email,
        `Order Confirmed — TechKage #${session.id.slice(-8).toUpperCase()}`,
        `Thank you for your order! Build: ${build_name} | Total: $${total_price}`,
        `
      <div style="font-family:sans-serif;background:#050608;color:#fff;padding:40px 20px;max-width:600px;margin:0 auto;">
        <h1 style="color:#0FD980;margin-bottom:4px;">Order Confirmed ✅</h1>
        <p style="color:#aaa;margin-top:0;">We've received your payment and will start sourcing parts shortly.</p>

        <div style="background:#0a0c10;border:1px solid #1a1a1a;border-radius:10px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 6px;color:#aaa;font-size:12px;letter-spacing:2px;">ORDER ID</p>
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">#${session.id.slice(-8).toUpperCase()}</p>
          <p style="margin:0 0 6px;color:#aaa;font-size:12px;letter-spacing:2px;">TOTAL PAID</p>
          <p style="margin:0;font-size:24px;font-weight:900;color:#0FD980;">$${total_price}</p>
        </div>

        <h3 style="letter-spacing:2px;font-size:11px;color:#aaa;margin-bottom:0;">YOUR BUILD</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;background:#0a0c10;border-radius:8px;overflow:hidden;">
          ${partsHtml}
        </table>

        <div style="margin-top:24px;padding:16px;background:#0a0c10;border-radius:8px;border:1px solid #1a1a1a;">
          <p style="margin:0 0 4px;color:#aaa;font-size:12px;letter-spacing:2px;">SHIPPING TO</p>
          <p style="margin:0;color:#fff;">${customer.name}</p>
          <p style="margin:4px 0 0;color:#aaa;font-size:13px;">${shipping?.address ? Object.values(shipping.address).filter(Boolean).join(', ') : 'N/A'}</p>
        </div>

        <p style="color:#555;font-size:12px;margin-top:32px;">Questions? Contact us at support@techkage.com</p>
      </div>
      `
      );
    }
  }
  res.json({ received: true });
});

module.exports = router;