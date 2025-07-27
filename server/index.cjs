const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');
const { cosine } = require('ml-distance');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is running! Use /api/products to get product data.');
});

app.get('/api/products', (req, res) => {
  const results = [];
  fs.createReadStream('../dataset/myntra_products_catalog.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

/** Load the embeddings once at startup: */
const embeddingsPath = path.join(__dirname, '../dataset/product_embeddings.json');
const productEmbeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));

/** Helper to get embedding by ProductID: */
function getEmbeddingById(productId) {
  return productEmbeddings.find(p => String(p.ProductID) === String(productId));
}

/** Cosine similarity function: */
function cosineSimilarity(a, b) {
  // ml-distance cosine returns distance, so similarity = 1 - distance
  return 1 - cosine(a, b);
}

app.get('/api/recommendations/:productId', (req, res) => {
  const { productId } = req.params;
  const target = getEmbeddingById(productId);
  if (!target) return res.status(404).json({ error: 'Product not found' });

  // Compute similarity to all other products
  const sims = productEmbeddings
    .filter(p => String(p.ProductID) !== String(productId))
    .map(p => ({
      ProductID: p.ProductID,
      similarity: cosineSimilarity(target.embedding, p.embedding)
    }));

  // Sort by similarity, descending
  sims.sort((a, b) => b.similarity - a.similarity);

  // Get top 4 recommendations
  const top = sims.slice(0, 4).map(s => s.ProductID);

  // Optionally, fetch product details for these IDs
  const results = [];
  fs.createReadStream('../dataset/myntra_products_catalog.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (top.includes(data.ProductID)) results.push(data);
    })
    .on('end', () => {
      res.json(results);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
