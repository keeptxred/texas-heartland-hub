import { createFileRoute } from "@tanstack/react-router";

const SITES = ["keeptxred", "texasdefined"] as const;
type Site = (typeof SITES)[number];

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = origin === "https://texasdefined.com" || origin === "https://www.texasdefined.com" || origin === "https://keeptxred.com" || origin === "https://www.keeptxred.com";
  return {
    "access-control-allow-origin": allowed ? origin : "https://texasdefined.com",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    vary: "Origin",
  };
}

export const Route = createFileRoute("/api/public/store-products")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const site = url.searchParams.get("site") as Site | null;
        if (!site || !SITES.includes(site)) {
          return Response.json({ ok: false, error: "site must be keeptxred or texasdefined" }, { status: 400, headers: corsHeaders(request) });
        }

        const collection = url.searchParams.get("collection")?.trim() || null;
        const requestedLimit = Number(url.searchParams.get("limit") || 100);
        const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(Math.floor(requestedLimit), 1), 250) : 100;
        const prefix = site === "keeptxred" ? "keeptxred" : "texasdefined";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let query = supabaseAdmin
          .from("products")
          .select(`id,printify_product_id,title,description,price,currency,image_url,product_url,tags,is_new,is_on_sale,${prefix}_category,${prefix}_collections,${prefix}_featured,${prefix}_display_order,synced_at`)
          .eq("source", "printify")
          .eq(`publish_${prefix}`, true)
          .order(`${prefix}_featured`, { ascending: false })
          .order(`${prefix}_display_order`, { ascending: true })
          .order("synced_at", { ascending: false })
          .limit(limit);

        if (collection) query = query.contains(`${prefix}_collections`, [collection]);
        const { data, error } = await query;
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500, headers: corsHeaders(request) });

        const products = (data ?? []).map((row: Record<string, unknown>) => ({
          id: row.id,
          printifyProductId: row.printify_product_id,
          title: row.title,
          description: row.description,
          price: row.price,
          currency: row.currency,
          imageUrl: row.image_url,
          productUrl: row.product_url,
          tags: row.tags ?? [],
          category: row[`${prefix}_category`],
          collections: row[`${prefix}_collections`] ?? [],
          featured: row[`${prefix}_featured`] ?? false,
          displayOrder: row[`${prefix}_display_order`] ?? 0,
          isNew: row.is_new ?? false,
          isOnSale: row.is_on_sale ?? false,
        }));

        return Response.json({ ok: true, site, products }, { headers: corsHeaders(request) });
      },
    },
  },
});
