# import pandas as pd

# # Load the CSV file
# df = pd.read_csv('dataset\myntra_products_catalog.csv')

# # Print the number of rows for reference
# print(f"Original dataset size: {len(df)} rows")

# # Take the first half of the dataset
# half_size = len(df) // 2
# df_half = df.iloc[:half_size]

# # Save the reduced CSV
# df_half.to_csv('myntra_products_half.csv', index=False)
# print(f"Reduced dataset size: {len(df_half)} rows, saved as 'myntra_products_half.csv'")

# from sentence_transformers import SentenceTransformer
# import pandas as pd
# import json
# import gzip
# import os

# # Load the reduced CSV
# df = pd.read_csv('dataset/myntra_products_catalog.csv')
# print("Columns in CSV:", df.columns.tolist())

# # Load the model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # Generate embeddings for the 'Description' column
# df['Description'] = df['Description'].fillna('').astype(str)
# df['embedding'] = df['Description'].apply(lambda x: model.encode(x).tolist())

# # Select relevant columns
# output_df = df[['ProductID', 'ProductName', 'embedding']]

# # Save to JSON and compress
# output_df.to_json('dataset/product_embeddings.json', orient='records', lines=False)
# with open('dataset/product_embeddings.json', 'r') as f:
#     data = json.load(f)
# with gzip.open('dataset/product_embeddings.json.gz', 'wt', encoding='utf-8') as f:
#     json.dump(data, f)

# # Check file sizes
# json_size = os.path.getsize('dataset/product_embeddings.json') / (1024 * 1024)
# gz_size = os.path.getsize('dataset/product_embeddings.json.gz') / (1024 * 1024)
# print(f"Uncompressed JSON size: {json_size:.2f} MB")
# print(f"Compressed JSON size: {gz_size:.2f} MB")