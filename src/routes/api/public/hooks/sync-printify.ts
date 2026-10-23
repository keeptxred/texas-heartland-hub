import { createFileRoute } from "@tanstack/react-router";
import {
  mapProduct,
  type PrintifyProduct,
  type WebsiteSettings,
} from "@/lib/printify-sync-product";
import { environment, Store } from "@/lib/publisher/store.server";

const PRINTIFY_BASE = "https://api.printify.com/v1";

type PrintifyShop = { id: number; title: string };
async function resolveShopId(token: string, requested: string): Promise<string> {
  if (/^\d+$/.test(requested)) return requested;

  const response = await fetch(`${PRINTIFY_BASE}/shops.json`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Printify /shops.json ${response.status}`);

  const shops = (await response.json()) as PrintifyShop[];
  const requestedName = requested.toLowerCase();
  const match = shops.find((shop) => shop.title?.toLowerCase().includes(requestedName)) ?? shops[0];
  if (!match) throw new Error("No Printify shops found on this account");
  return String(match.id);
}

function isAuthorized(request: Request) {
  const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] ?? "";
  const adminPasscode = request.headers.get("x-admin-passcode") ?? "";
  const expected = process.env.PRINTIFY_SYNC_SECRET ?? process.env.ADMIN_PASSCODE ?? "";
  return expected.length > 0 && (bearer === expected || adminPasscode === expected);
}

export const Route = createFileRoute("/api/public/hooks/sync-printify")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          { ok: false, error: "Method not allowed" },
          { status: 405, headers: { Allow: "POST" } },
        ),
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }
        return runSync();
      },
    },
  },
});

async function runSync(): Promise<Response> {
  const token = process.env.PRINTIFY_API_TOKEN;
  const requestedShop = process.env.PRINTIFY_SHOP_ID;
  if (!token || !requestedShop) {
    return Response.json({ ok: false, error: "Missing Printify env vars" }, { status: 500 });
  }

  try {
    const shopId = await resolveShopId(token, requestedShop);
    const allProducts: PrintifyProduct[] = [];

    let page = 1;
    while (page <= 20) {
      const response = await fetch(
        `${PRINTIFY_BASE}/shops/${shopId}/products.json?limit=50&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        return Response.json(
          {
            ok: false,
            error: `Printify products ${response.status}`,
            detail: detail.slice(0, 300),
          },
          { status: 502 },
        );
      }

      const payload = (await response.json()) as { data: PrintifyProduct[] };
      const batch = payload.data ?? [];
      allProducts.push(...batch);
      if (batch.length < 50) break;
      page += 1;
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("products")
      .select(
        "id,is_active,category,collections,is_featured,is_new,is_on_sale,publish_keeptxred,publish_texasdefined,keeptxred_category,texasdefined_category,keeptxred_collections,texasdefined_collections,keeptxred_featured,texasdefined_featured,keeptxred_display_order,texasdefined_display_order",
      )
      .eq("source", "printify");

    if (existingError) {
      return Response.json({ ok: false, error: existingError.message }, { status: 500 });
    }

    const settingsById = new Map<string, WebsiteSettings>();
    for (const row of existingRows ?? []) {
      settingsById.set(row.id, {
        is_active: row.is_active ?? false,
        category: row.category ?? null,
        collections: Array.isArray(row.collections) ? row.collections : [],
        is_featured: row.is_featured ?? false,
        is_new: row.is_new ?? false,
        is_on_sale: row.is_on_sale ?? false,
        publish_keeptxred: row.publish_keeptxred ?? false,
        publish_texasdefined: row.publish_texasdefined ?? false,
        keeptxred_category: row.keeptxred_category ?? null,
        texasdefined_category: row.texasdefined_category ?? null,
        keeptxred_collections: Array.isArray(row.keeptxred_collections)
          ? row.keeptxred_collections
          : [],
        texasdefined_collections: Array.isArray(row.texasdefined_collections)
          ? row.texasdefined_collections
          : [],
        keeptxred_featured: row.keeptxred_featured ?? false,
        texasdefined_featured: row.texasdefined_featured ?? false,
        keeptxred_display_order: row.keeptxred_display_order ?? 0,
        texasdefined_display_order: row.texasdefined_display_order ?? 0,
      });
    }

    // Read durable publisher routing intents so overlapping syncs cannot restore
    // website flags captured before a publisher job assigned its destination.
    // A missing publisher migration is a deployment error: fail closed, never
    // silently erase routing on newly published merchandise.
    const publisherStore = new Store(environment(undefined));
    const routes = new Map<string, { website: string; kind: string }>();
    for (let offset = 0; ; offset += 500) {
      const page = await publisherStore.rest<
        { key: string; value: { website: string; kind: string } }[]
      >(`publisher_state?key=like.route:*&select=key,value&limit=500&offset=${offset}&order=key`);
      for (const row of page) routes.set(row.key.slice(6), row.value);
      if (page.length < 500) break;
    }
    const mapped = allProducts.map((product) => {
      const row = mapProduct(product, settingsById.get(product.id));
      const route = routes.get(product.id);
      if (route && (route.website === "keeptxred" || route.website === "texasdefined")) {
        row.is_active = true;
        row.publish_keeptxred = route.website === "keeptxred";
        row.publish_texasdefined = route.website === "texasdefined";
        row[`${route.website}_category`] = route.kind === "shirt" ? "shirts" : "stickers";
      }
      return row;
    });

    if (mapped.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("products")
        .upsert(mapped, { onConflict: "id" });
      if (upsertError) {
        return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
      }
    }

    const newlyImported = mapped.filter((product) => !settingsById.has(product.id)).length;

    return Response.json({
      ok: true,
      shopId,
      fetched: allProducts.length,
      upserted: mapped.length,
      newlyImported,
      newProductsDefaultHidden: true,
      preservedWebsiteSettings: true,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
