const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = 3000;

const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-native-audio-dialog';
const apiKey = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey,
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No reply received from Gemini.';
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Gemini API error occurred.' });
  }
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
  console.log(` Using Gemini model: ${model}`);
});
