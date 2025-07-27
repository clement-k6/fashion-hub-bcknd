import pandas as pd
import numpy as np
import json
from sentence_transformers import SentenceTransformer

# Load your CSV
df = pd.read_csv('dataset/myntra_products_catalog.csv')

# Combine fields for embedding (e.g., name + description)
texts = (df['ProductName'].fillna('') + ' ' + df['Description'].fillna('')).tolist()

# Load the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings
embeddings = model.encode(texts, show_progress_bar=True)

# Save as a list of dicts: [{ProductID, embedding: [...]}, ...]
output = []
for i, row in df.iterrows():
    output.append({
        'ProductID': row['ProductID'],
        'embedding': embeddings[i].tolist()
    })

with open('dataset/product_embeddings.json', 'w') as f:
    json.dump(output, f)

print('Embeddings saved to dataset/product_embeddings.json')
