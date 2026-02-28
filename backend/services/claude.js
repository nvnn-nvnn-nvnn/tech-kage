// claude.js
// Handles the actual Claude API call

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateBuild(userPrompt, budget) {
  const budgetMap = { 600: "$600", 1000: "$1,000", 1500: "$1,500+" };
  const budgetLabel = budgetMap[budget] || `$${budget}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: `You are an expert PC hardware specialist with deep knowledge of compatibility, performance, and value.
    You provide accurate, current part recommendations based on user requirements.
    You ONLY respond with valid JSON, nothing else.
    The user's total budget is ${budgetLabel}.
    The combined price of ALL parts MUST NOT exceed this budget.
    Prioritize cheaper alternatives if needed to stay within budget.`,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract the text response
    const responseText = message.content[0].text;

    // Clean markdown code blocks if present
    let cleanResponse = responseText.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON
    const buildData = JSON.parse(cleanResponse);

    return {
      success: true,
      build: buildData,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens
    };

  } catch (error) {
    console.error("Claude API Error:", error);
    
    // Return a structured error
    return {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
  }
}

module.exports = { generateBuild };