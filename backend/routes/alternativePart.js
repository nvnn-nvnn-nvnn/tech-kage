// routes/alternativePart.js
// Handles "Find Better Alternative" and "Find Cheaper Option" requests

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── PROMPT BUILDER ──────────────────────────────────────────────────────────

function buildAlternativePrompt(category, currentPart, type, config = {}) {
  const currentPrice = currentPart.price || currentPart.priceNumeric;
  const baseContext = `
Current part being replaced:
- Category: ${category}
- Name: ${currentPart.name}
- Price: ${currentPrice}
- Spec: ${currentPart.spec || 'N/A'}

User build context:
- Performance tier: ${config.performance || 'enthusiast'}
- Use case: ${(config.usage || []).join(', ') || 'general'}
- Cooling: ${config.cooling || 'any'}
- Budget ceiling: ${config.budget ? `$${config.budget}` : 'flexible'}
  `.trim();

  if (type === 'cheaper') {
    return `${baseContext}

Task: Recommend a CHEAPER alternative ${category} that costs meaningfully less than ${currentPrice} while still being a solid choice for this build. Do not suggest the same part.

Respond ONLY with a single valid JSON object. No markdown, no explanation, no code blocks. Exactly this shape:
{
  "name": "Full product name",
  "price": "$XXX",
  "priceNumeric": 000,
  "spec": "Key specs separated by dots",
  "badge": "VALUE PICK",
  "rating": 4.5,
  "reason": "One or two sentences explaining why this is a good cheaper alternative and what tradeoffs the user accepts."
}`;
  }

  if (type === 'better') {
    return `${baseContext}

Task: Recommend a BETTER performing alternative ${category} that outperforms ${currentPart.name}. It can cost more. Do not suggest the same part.

Respond ONLY with a single valid JSON object. No markdown, no explanation, no code blocks. Exactly this shape:
{
  "name": "Full product name",
  "price": "$XXX",
  "priceNumeric": 000,
  "spec": "Key specs separated by dots",
  "badge": "UPGRADE",
  "rating": 4.7,
  "reason": "One or two sentences explaining why this is a better choice and what the user gains over their current pick."
}`;
  }
}

// ─── CLAUDE CALL ─────────────────────────────────────────────────────────────

async function getAlternativePart(category, currentPart, type, config) {
  const userPrompt = buildAlternativePrompt(category, currentPart, type, config);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    system: `You are an expert PC hardware specialist. You recommend specific, real, currently available PC parts.
You ONLY respond with valid JSON — no markdown fences, no explanation, no preamble.
Always include both price as a string (e.g. "$249") and priceNumeric as a number (e.g. 249).`,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  });

  // Extract and clean response
  let raw = message.content[0].text.trim();

  // Strip markdown fences if Claude adds them despite instructions
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  const part = JSON.parse(raw);

  // Normalise — ensure both price formats always exist
  if (part.priceNumeric === undefined && part.price) {
    part.priceNumeric = parseFloat(String(part.price).replace(/[^0-9.]/g, '')) || 0;
  }
  if (!part.price && part.priceNumeric) {
    part.price = `$${part.priceNumeric}`;
  }

  return part;
}

// ─── ROUTE ───────────────────────────────────────────────────────────────────

router.post('/alternative-part', async (req, res) => {
  try {
    const { category, currentPart, type, config } = req.body;

    // Validate
    if (!category || !currentPart || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, currentPart, type',
      });
    }

    if (!['better', 'cheaper'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'type must be "better" or "cheaper"',
      });
    }

    console.log(`[alternative-part] Finding ${type} alternative for ${category}: ${currentPart.name}`);

    const part = await getAlternativePart(category, currentPart, type, config || {});

    console.log(`[alternative-part] Found: ${part.name} at ${part.price}`);

    return res.json({ success: true, part });

  } catch (error) {
    console.error('[alternative-part] Error:', error);

    // JSON parse failures get a clearer message
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        error: 'Claude returned malformed JSON. Try again.',
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;