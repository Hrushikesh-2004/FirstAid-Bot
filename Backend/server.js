const express = require('express');
const axios = require('axios');
const pinecone = require('@pinecone-database/pinecone');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to print incoming requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  // console.log('Headers:', req.headers);
  // console.log('Body:', req.body);
  next();
});

// API keys
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Initialize Pinecone
const pineconeClient = new pinecone.Pinecone({ apiKey: PINECONE_API_KEY });

let embedder;

async function loadModel() {
  try {
    console.log('Loading model...');
    const transformers = await import('@xenova/transformers');
    embedder = await transformers.pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

async function retrieve(queryText) {
  try {
    if (!embedder) throw new Error('Embedder model not loaded');

    const embedderOutput = await embedder(queryText, { pooling: 'mean', normalize: true });
    let vector = Array.isArray(embedderOutput[0]) ? embedderOutput[0] : Array.from(embedderOutput[0]);

    const index = pineconeClient.Index('firstaid-rag');
    console.log(`Querying Pinecone with a ${vector.length}-dimensional vector`);

    const response = await index.query({ vector, topK: 5, includeMetadata: true });
    return response.matches;
  } catch (error) {
    console.error('Error retrieving from Pinecone:', error);
    throw error;
  }
}

async function generateResponse(context, query) {
  const contextText = context.map(res => res.metadata?.text || '').join('\n');
  const prompt = `Context: ${contextText}\nQuestion: ${query}\nProvide a clear and concise answer.`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions', // Fixed API URL
      {
        model: 'llama3-70b-8192', // Ensure correct model
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error.response?.data || error.message);
    throw error;
  }
}

// API Endpoints
app.post('/query', async (req, res) => {
  try {
    const queryText = req.body.query;
    if (!queryText) return res.status(400).json({ error: 'Query is required' });

    console.log('Received query:', queryText);
    const context = await retrieve(queryText);
    const answer = await generateResponse(context, queryText);

    res.json({ query: queryText, answer });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Initialize and Run
(async () => {
  try {
    await loadModel();
    console.log('Server initialization complete');
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
})();
