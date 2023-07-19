require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // Set the desired port number

app.use(express.json());

// Define a route to handle incoming chatbot messages
app.post('/message', async (req, res) => {
  const message = req.body.message;

  try {
    const generatedText = await sendMessageToOpenAI(message);
    res.json({ response: generatedText });
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Function to send a message to the OpenAI API
async function sendMessageToOpenAI(message) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      'https://platform.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
        n: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const generatedText = response.data.choices[0].text.trim();
    return generatedText;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// Start the Express.js server
app.listen(port, () => {
  console.log(`Chatbot listening at http://localhost:${port}`);
});
