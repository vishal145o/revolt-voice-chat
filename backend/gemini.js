const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const systemPrompt = `
You are Rev, an AI assistant for Revolt Motors. Only answer queries related to Revolt electric bikes, test rides, pricing, dealership, and company support. Politely refuse any unrelated questions.
`;

exports.handleChat = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { role: 'user', parts: [{ text: userMessage }] },
          { role: 'model', parts: [{ text: systemPrompt }] }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ error: 'Something went wrong with Gemini API' });
  }
};
