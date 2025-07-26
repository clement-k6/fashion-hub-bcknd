# Build stage
FROM python:3.10-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    rm -rf /root/.cache/pip /root/.cache/huggingface

# Final stage
FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY recommend_api.py .
COPY dataset/myntra_products_catalog.csv dataset/
COPY dataset/product_embeddings.json.gz dataset/
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "uvicorn recommend_api:app --host 0.0.0.0 --port 8080"]