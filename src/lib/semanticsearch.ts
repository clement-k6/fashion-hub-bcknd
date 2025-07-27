import { pipeline, AutoTokenizer } from '@xenova/transformers';
import { supabase } from './supabaseClient';

// Fetch products (with embeddings) from Supabase
export async function loadProductsAndEmbeddings() {
  // Select all fields, including the 'embeddings' column
  const { data, error } = await supabase.from('fashionhub').select('*');
  if (error) throw error;
  // Split into products and embeddings arrays for compatibility
  const products = data;
  const embeddings = data.map((row: any) => ({ embedding: row.embeddings }));
  return { products, embeddings };
}

// Get embedding for a query using Transformers.js
let extractor: any = null;
let modelLoadError = false;

export async function getQueryEmbedding(text: string) {
  if (modelLoadError) {
    throw new Error('Model failed to load previously');
  }
  
  if (!extractor) {
    try {
      console.log('Loading embedding model...');
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      await AutoTokenizer.from_pretrained('Xenova/all-MiniLM-L6-v2');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load embedding model:', error);
      modelLoadError = true;
      throw new Error('Failed to load embedding model. Please check your internet connection and try again.');
    }
  }
  
  try {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return output.data[0];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding for your query.');
  }
}

// Compute cosine similarity
export function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
