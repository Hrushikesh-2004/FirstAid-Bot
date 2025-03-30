// const express = require('express');
// const axios = require('axios');
// const pinecone = require('@pinecone-database/pinecone');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(express.json());

// const pineconeClient = new pinecone.Pinecone({
//   apiKey: 'pcsk_5ER3zb_6CoivEncEZMM2fUHSopCaL2tjByoehKgNxAybuYJg4ebRL877djhGqMm9u9X1rr'
// });

// let embedder;

// async function listIndexes() {
//   try {
//     const indexes = await pineconeClient.listIndexes();
//     console.log('My indexes:', indexes);
//   } catch (error) {
//     console.error('Error listing indexes:', error);
//   }
// }

// async function loadModel() {
//   console.log('Loading model...');
//   const transformers = await import('@xenova/transformers');
//   embedder = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//   console.log('Model loaded successfully');
// }

// // Retriever function
// async function retrieve(queryText) {
//   const queryEmbedding = await embedder(queryText);
//   const response = await pineconeClient.query({
//     index: 'my-index',
//     vector: queryEmbedding[0],
//     topK: 5,
//     includeMetadata: true
//   });
//   return response.matches;
// }

// // Generator function
// async function generateResponse(context, query) {
//   const contextText = context.map(res => res.metadata.text).join('\n');
//   const prompt = `Context: ${contextText}\nQuestion: ${query}\nProvide a clear and concise answer.`;

//   try {
//     const response = await axios.post('https://api.groq.com/v1/chat/completions', {
//       model: 'llama-3.3-70b-versatile',
//       messages: [{ role: 'user', content: prompt }],
//     }, {
//       headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
//     });

//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error('Error generating response:', error);
//     throw error;
//   }
// }

// // API Endpoints
// app.post('/query', async (req, res) => {
//   try {
//     const queryText = req.body.query;
//     if (!queryText) return res.status(400).json({ error: 'Query is required' });

//     console.log('Received query:', queryText);
//     const context = await retrieve(queryText);
//     const answer = await generateResponse(context, queryText);

//     res.json({ query: queryText, answer });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // Initialize and run
// (async () => {
//   await listIndexes();
//   await loadModel();
// })();
require('dotenv').config();


console.log(process.env.PINECONE_API_KEY);