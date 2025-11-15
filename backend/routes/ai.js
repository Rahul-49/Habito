import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/describe", async (req, res) => {
  try {
    const { title, location, area, price } = req.body || {};

    if (!title || !location || area === undefined || price === undefined) {
      return res.status(400).json({
        message: "title, location, area, and price are required"
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY not configured"
      });
    }

const prompt = `
You are a professional real estate copywriter.

Write a compelling and polished property description between 120–150 words.
Do NOT repeat the title verbatim. Focus on lifestyle appeal, key features, and location advantages.

Property Details:
- Title: ${title}
- Location: ${location}
- Area: ${area} sq.ft
- Price: ${price}

Requirements:
- Tone: professional, inviting, and trustworthy.
- Highlight the property's unique value, convenience, and suitability for buyers.
- Use clear, elegant language—no emojis, no overly promotional claims.
- Return plain text only, no formatting.
`.trim();


    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,        // Same as your curl
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // If API returned an error
    if (!response.ok) {
      console.error("Gemini Error:", JSON.stringify(data, null, 2));
      return res.status(500).json({
        message: "Gemini API error",
        details: data.error || data
      });
    }

    // Extract Gemini text
    const description =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!description) {
      return res.status(502).json({
        message: "Failed to extract description",
        raw: data
      });
    }

    res.json({ description: description.trim() });

  } catch (err) {
    console.error("Route Error:", err);
    res.status(500).json({
      message: "Failed to generate description",
      error: err.message
    });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const { title, location, area, price, bedrooms, bathrooms, features = [] } = req.body || {};

    if (!title || !location || area === undefined || price === undefined) {
      return res.status(400).json({
        message: "title, location, area, and price are required"
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY not configured"
      });
    }

    const prompt = `
You are a real estate expert. Create a concise property summary (50-80 words) highlighting key selling points.

Property Details:
- Title: ${title}
- Location: ${location}
- Area: ${area} sq.ft
- Price: ${price}
${bedrooms ? `- Bedrooms: ${bedrooms}\n` : ''}${bathrooms ? `- Bathrooms: ${bathrooms}\n` : ''}
${features.length > 0 ? `Key Features:\n${features.map(f => `- ${f}`).join('\n')}\n` : ''}

Requirements:
- Keep it brief and scannable
- Highlight unique selling points
- Mention location benefits
- No emojis or special formatting
- Use professional, positive language
`.trim();

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", JSON.stringify(data, null, 2));
      return res.status(500).json({
        message: "Gemini API error",
        details: data.error || data
      });
    }

    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

    if (!summary) {
      return res.status(502).json({
        message: "Failed to generate summary",
        raw: data
      });
    }

    res.json({ summary });

  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({
      message: "Failed to generate property summary",
      error: err.message
    });
  }
});

export default router;