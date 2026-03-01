const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        // 1. Add to Resend audience (acts as your mailing list)
        await resend.contacts.create({
            email,
            audienceId: process.env.RESEND_AUDIENCE_ID,
            unsubscribed: false,
        });

        // 2. Send welcome email
        await resend.emails.send({
            from: 'TechKage <hello@techkage.com>',
            to: email,
            subject: 'Welcome to TechKage 👾',
            html: `
        <div style="font-family:sans-serif;background:#050608;color:#fff;padding:40px 20px;max-width:600px;margin:0 auto;">
          <h1 style="color:#0FD980;">You're in. 🎉</h1>
          <p style="color:#aaa;">Thanks for subscribing to TechKage. You'll be the first to know about:</p>
          <ul style="color:#aaa;line-height:2;">
            <li>New AI build features</li>
            <li>Curated build guides</li>
            <li>Part deals and drops</li>
          </ul>
          <a href="https://techkage.com/builder" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#0FD980;color:#050608;border-radius:8px;font-weight:700;text-decoration:none;">
            Build Your PC →
          </a>
          <p style="color:#444;font-size:12px;margin-top:32px;">You can unsubscribe at any time.</p>
        </div>
      `,
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Subscribe error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;