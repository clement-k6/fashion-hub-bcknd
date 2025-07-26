import json
import pandas as pd
from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
df = pd.read_csv('dataset/myntra_products_catalog.csv')
with open('dataset/product_embeddings.json', 'r') as f:
    product_embeddings = json.load(f)

# Prepare embeddings matrix and id mapping
emb_matrix = [item['embedding'] for item in product_embeddings]
product_ids = [item['ProductID'] for item in product_embeddings]

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def clean_dict(d):
    """Replace NaN/None in dict values with empty string or 0."""
    for k, v in d.items():
        if isinstance(v, float) and math.isnan(v):
            d[k] = 0.0
        elif v is None:
            d[k] = ""
    return d

@app.post("/recommend")
async def recommend(request: Request):
    try:
        data = await request.json()
    except Exception:
        return {"results": []}
    query = data.get("query", "")
    top_k = int(data.get("top_k", 4))

    # Generate embedding for query
    query_emb = model.encode([query])

    # Compute cosine similarity
    sims = cosine_similarity(query_emb, emb_matrix)[0]
    top_indices = sims.argsort()[-top_k:][::-1]

    results = []
    for idx in top_indices:
        prod_id = product_ids[idx]
        prod_info = df[df['ProductID'] == prod_id].iloc[0].to_dict()
        sim = float(sims[idx])
        if math.isnan(sim):
            continue
        prod_info['similarity'] = sim
        prod_info = clean_dict(prod_info)
        # Optionally, only return the fields you want:
        result = {
            "ProductID": prod_info.get("ProductID", ""),
            "ProductName": prod_info.get("ProductName", ""),
            "Price": prod_info.get("Price", ""),
            "ImageURL": prod_info.get("ImageURL", ""),
            "ProductURL": f"/product/{prod_info.get('ProductID', '')}",
            "similarity": sim
        }
        results.append(result)

    return {"results": results}
