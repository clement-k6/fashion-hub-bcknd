import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

serve(async (req) => {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) return new Response(JSON.stringify({ error: "Missing productId" }), { status: 400 });

  // Fetch the target embedding
  const { data: target, error: targetError } = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/rest/v1/embeddings?ProductID=eq.${productId}`,
    {
      headers: {
        apikey: Deno.env.get("SUPABASE_ANON_KEY"),
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    }
  ).then(res => res.json());

  if (!target || !target[0]) return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });

  // Fetch all embeddings
  const { data: allEmbeddings } = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/rest/v1/embeddings`,
    {
      headers: {
        apikey: Deno.env.get("SUPABASE_ANON_KEY"),
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    }
  ).then(res => res.json());

  // Compute similarities
  const sims = allEmbeddings
    .filter((e: any) => String(e.ProductID) !== String(productId))
    .map((e: any) => ({
      ProductID: e.ProductID,
      similarity: cosineSimilarity(target[0].embedding, e.embedding),
    }))
    .sort((a: any, b: any) => b.similarity - a.similarity)
    .slice(0, 4);

  // Fetch product details for the top recommendations
  const ids = sims.map((s: any) => s.ProductID).join(",");
  const { data: products } = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/rest/v1/fashionhub?ProductID=in.(${ids})`,
    {
      headers: {
        apikey: Deno.env.get("SUPABASE_ANON_KEY"),
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    }
  ).then(res => res.json());

  return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
});
