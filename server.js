// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();

// Initialize OpenAI with the API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for development, restrict this in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiKeySet: !!process.env.OPENAI_API_KEY
  });
});

// NurseCare AI Chat API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Valid messages array is required' 
      });
    }
    
    console.log('Processing chat request');
    
    // Configure the model to focus on nursing facility information
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use the most capable model
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
      presence_penalty: 0.3, // Slight penalty to avoid repetition
      frequency_penalty: 0.3 // Slight penalty to encourage varied responses
    });
    
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }
    
    console.log('AI Response received successfully');
    
    res.json({ 
      response: aiResponse,
      success: true
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false
    });
  }
});

// Legacy API route for compatibility with older code
app.post('/api/generate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'Text parameter is required' 
      });
    }
    
    // Create a simple message structure for the legacy endpoint
    const messages = [
      {
        role: "system",
        content: `You are NurseCare AI, an intelligent assistant for healthcare professionals in a nursing facility. 
        Respond in Icelandic unless specified otherwise. Be concise, accurate and helpful.`
      },
      {
        role: "user",
        content: text
      }
    ];
    
    console.log('Processing legacy generate request');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 400
    });
    
    const result = completion.choices[0]?.message?.content;
    
    if (!result) {
      throw new Error('No response from OpenAI');
    }
    
    res.json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Is set' : 'Not set');
});