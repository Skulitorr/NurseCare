// OpenAI API handler for Vercel serverless function
import OpenAI from 'openai';

// Initialize OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ 
        error: 'OpenAI API is not configured',
        response: "I'm sorry, but the AI service is currently not configured. Please contact the administrator."
      });
    }

    // Create completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for a nursing home dashboard. You can help with questions about staff management, patient care, and general nursing home operations. Keep your responses concise and professional."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extract the response
    const response = completion.choices[0].message.content;

    // Return the response
    return res.status(200).json({ response });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ error: 'Failed to get response from AI assistant' });
  }
} 