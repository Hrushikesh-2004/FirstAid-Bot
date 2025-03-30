const fs = require('fs');
const pdfParse = require('pdf-parse');
const pinecone = require('@pinecone-database/pinecone');

const pineconeClient = new pinecone.Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

let embedder;

// Load the embedding model using dynamic import
async function loadModel() {
  try {
    console.log('Loading model...');
    const { pipeline } = await import('@xenova/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

// Extract text from PDF
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw error;
  }
}

// Store embeddings in Pinecone
async function storeEmbedding(id, text) {
  try {
    if (!embedder) throw new Error('Embedder model not loaded');

    const embedderOutput = await embedder(text, { pooling: 'mean', normalize: true });
    const vector = Array.isArray(embedderOutput[0]) ? embedderOutput[0] : Array.from(embedderOutput[0]);

    if (vector.length !== 768) {
      throw new Error(`Vector dimension mismatch. Expected 768, got ${vector.length}`);
    }

    const index = pineconeClient.Index('firstaid-rag');
    await index.upsert([{ id: id, values: vector, metadata: { text: text.slice(0, 200) } }]);

    console.log(`Stored embedding for PDF with ID: ${id}`);
  } catch (error) {
    console.error('Error storing embedding:', error);
  }
}

// Main function to process PDF
async function processPDF(pdfPath, id) {
  try {
    await loadModel();
    const text = await extractTextFromPDF(pdfPath);
    await storeEmbedding(id, text);
    console.log('PDF processed and stored successfully');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Example usage
processPDF('./material/Basic_First_Aid_Manual_English.pdf', 'pdf-001');
