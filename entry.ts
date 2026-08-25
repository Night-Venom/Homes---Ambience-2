const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const productId = body?.product_id;
    if (!productId) {
      return Response.json({ error: 'product_id is required' }, { status: 400 });
    }

    const products = await db.entities.Product.list('-created_date', 100);
    const active = products.find((p) => p.id === productId);
    if (!active) {
      return Response.json({ error: 'product not found' }, { status: 404 });
    }

    // Deterministic fallback: same category first, then any other product.
    const sameCategory = products.filter(
      (p) => p.id !== productId && p.category === active.category
    );
    const others = products.filter(
      (p) => p.id !== productId && p.category !== active.category
    );
    const fallback = [...sameCategory, ...others].slice(0, 2);

    let recommended = fallback;

    // Try AI refinement (Claude Opus 4.8); fall back to category match on any failure.
    try {
      const candidates = products
        .filter((p) => p.id !== productId)
        .map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          price: p.price
        }));

      const prompt =
        'You are a premium home & tech merchandiser for an editorial store called "Homes & Ambience". ' +
        'A customer is viewing the product below. From the catalogue, choose exactly 2 products that best ' +
        'complement the viewed item — first prefer the same category, then complementary accessories that ' +
        'encourage a larger cart. Return only the chosen product ids.\n\n' +
        'VIEWED PRODUCT:\n' +
        'Title: ' + active.title + '\n' +
        'Category: ' + active.category + '\n' +
        'Description: ' + active.description + '\n' +
        'Price: £' + active.price + '\n\n' +
        'CATALOGUE:\n' + JSON.stringify(candidates);

      const schema = {
        type: 'object',
        properties: {
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['id']
            }
          }
        },
        required: ['recommendations']
      };

      const llmRes = await db.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        model: 'claude_opus_4_8',
        response_json_schema: schema
      });

      const ids = (llmRes?.recommendations || [])
        .map((r) => r.id)
        .filter(Boolean)
        .slice(0, 2);

      const aiPicks = ids
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

      if (aiPicks.length === 2) {
        recommended = aiPicks;
      }
    } catch (_aiError) {
      // Use the deterministic category fallback.
    }

    return Response.json({ recommendations: recommended });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}