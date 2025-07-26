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

# # Load the reduced CSV
# df = pd.read_csv('dataset\myntra_products_catalog.csv')

# # Check available columns and adjust if needed
# print("Columns in CSV:", df.columns.tolist())

# # Load the embedding model (lightweight, 384 dimensions)
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # Generate embeddings for the 'Description' column (adjust column name if different)
# # Handle missing or non-string values
# df['Description'] = df['Description'].fillna('').astype(str)
# df['embedding'] = df['Description'].apply(lambda x: model.encode(x).tolist())

# # Select relevant columns for JSON (adjust as needed)
# output_df = df[['ProductID', 'ProductName', 'embedding']]  # Add other columns if required

# # Save to JSON
# output_df.to_json('product_embeddings_half.json', orient='records', lines=False)
# print("Generated embeddings saved to 'product_embeddings_half.json'")

# # Check file size (in MB)
# import os
# file_size = os.path.getsize('product_embeddings_half.json') / (1024 * 1024)
# print(f"File size: {file_size:.2f} MB")