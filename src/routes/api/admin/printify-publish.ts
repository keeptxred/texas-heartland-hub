import { createFileRoute } from "@tanstack/react-router";

/**
 * Secure product publishing bridge.
 * The caller supplies already-approved, print-ready PNG artwork and product choices.
 * Product catalog configurations are intentionally stored server-side, never supplied
 * as arbitrary blueprint/provider IDs by a public caller.
 *
 * Environment:
 *  PRODUCT_PUBLISH_SECRET: separate long random bearer token (required)
 *  PRINTIFY_API_TOKEN: Printify account token
 *  PRINTIFY_SHOP_ID: the shop connected to Etsy
 *  PRINTIFY_SHIRT_CONFIG / PRINTIFY_STICKER_CONFIG:
 *    {"blueprint_id":12,"print_provider_id":99,
 *     "variants":[{"id":18101,"price":2999}],
 *     "position":"front","decoration_method":"dtg"}
 *
 * Product configs must be verified against Printify catalog before production use.
 * POST with `publish:true` explicitly opts into Etsy publication.
 * Request must include a stable `job_id` for best-effort retry deduplication.
 */
const API = "https://api.printify.com/v1";
type Kind = "shirt" | "sticker";
type Variant = { id: number; price: number };
type Config = {
  blueprint_id: number;
  print_provider_id: number;
  variants: Variant[];
  position: string;
  decoration_method?: string;
};
type Body = {
  job_id: string;
  artwork_base64: string;
  file_name?: string;
  title: string;
  description: string;
  tags?: string[];
  products: Kind[];
  website?: "keeptxred" | "texasdefined" | "none";
  publish?: boolean;
};
type PrintifyProduct = { id: string; title?: string; tags?: string[]; visible?: boolean; external?: { handle?: string } };

function response(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
function validateConfig(raw: string | undefined, kind: Kind): Config {
  if (!raw) throw new Error(`Missing PRINTIFY_${kind === "shirt" ? "SHIRT" : "STICKER"}_CONFIG`);
  const config = JSON.parse(raw) as Config;
  if (!Number.isInteger(config.blueprint_id) || !Number.isInteger(config.print_provider_id)
      || !Array.isArray(config.variants) || config.variants.length === 0
      || config.variants.some(v => !Number.isInteger(v.id) || !Number.isInteger(v.price) || v.price < 100)
      || !config.position || typeof config.position !== "string") {
    throw new Error(`Invalid ${kind} Printify catalog configuration`);
  }
  return config;
}
async function api<T>(token: string, path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "KeepTXRed-Publisher/1.0" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Printify ${method} ${path} failed (${res.status}): ${text.slice(0, 250)}`);
  return (text ? JSON.parse(text) : null) as T;
}
async function findTaggedProduct(token: string, shop: string, marker: string): Promise<PrintifyProduct | null> {
  for (let page = 1; page <= 20; page++) {
    const result = await api<{ data: PrintifyProduct[] }>(token, `/shops/${shop}/products.json?limit=50&page=${page}`);
    const products = result.data ?? [];
    const match = products.find(p => (p.tags ?? []).includes(marker));
    if (match) return match;
    if (products.length < 50) break;
  }
  return null;
}
function authorized(request: Request): boolean {
  const token = process.env.PRODUCT_PUBLISH_SECRET;
  const provided = request.headers.get("Authorization")?.match(/^Bearer (.+)$/i)?.[1];
  return !!token && !!provided && token.length >= 32 && provided === token;
}
function safeInput(raw: unknown): Body {
  if (!raw || typeof raw !== "object") throw new Error("JSON object required");
  const b = raw as Partial<Body>;
  if (!b.job_id || !/^[a-zA-Z0-9_-]{8,64}$/.test(b.job_id)) throw new Error("job_id must be 8-64 safe characters");
  if (!b.title || b.title.length > 140 || !b.description || b.description.length > 10000)
    throw new Error("Valid title and description required");
  if (!b.artwork_base64 || b.artwork_base64.length > 7_000_000
      || !/^[A-Za-z0-9+/=]+$/.test(b.artwork_base64))
    throw new Error("PNG base64 required (up to approximately 5MB)");
  if (!Array.isArray(b.products) || b.products.length === 0 || b.products.length > 2
      || b.products.some(k => k !== "shirt" && k !== "sticker") || new Set(b.products).size !== b.products.length)
    throw new Error("products must be shirt, sticker, or both");
  if (b.website && !["keeptxred", "texasdefined", "none"].includes(b.website))
    throw new Error("Invalid website");
  if (b.tags && (!Array.isArray(b.tags) || b.tags.some(t => typeof t !== "string" || t.length > 50)))
    throw new Error("Invalid tags");
  return b as Body;
}
async function run(request: Request) {
  if (!authorized(request)) return response({ ok: false, error: "Unauthorized" }, 401);
  let body: Body;
  try { body = safeInput(await request.json()); }
  catch (error) { return response({ ok: false, error: String(error) }, 400); }

  const token = process.env.PRINTIFY_API_TOKEN;
  const shop = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shop || !/^\d+$/.test(shop)) return response({ ok: false, error: "Printify credentials/shop not configured" }, 503);
  let configs: Array<[Kind, Config]>;
  try {
    configs = body.products.map(k => [k, validateConfig(process.env[k === "shirt" ? "PRINTIFY_SHIRT_CONFIG" : "PRINTIFY_STICKER_CONFIG"], k)]);
  } catch (error) { return response({ ok: false, error: String(error) }, 503); }

  // Safe default: preview only. No uploads or product mutations unless publish is explicitly true.
  if (body.publish !== true) {
    return response({ ok: true, dry_run: true, job_id: body.job_id, website: body.website ?? "none",
      products: configs.map(([kind, c]) => ({ kind, blueprint_id: c.blueprint_id, print_provider_id: c.print_provider_id,
        variants: c.variants.length })) });
  }

  const results: Array<{ kind: Kind; id?: string; created?: boolean; submitted_to_channel?: boolean; error?: string }> = [];
  let imageId: string | undefined;
  for (const [kind, config] of configs) {
    const marker = `ktr-${body.job_id}-${kind}`;
    try {
      const existing = await findTaggedProduct(token, shop, marker);
      if (existing) {
        results.push({ kind, id: existing.id, created: false, submitted_to_channel: !!existing.visible });
        continue;
      }
      if (!imageId) {
        const image = await api<{ id: string }>(token, "/uploads/images.json", "POST", {
          file_name: body.file_name && /^[a-zA-Z0-9_.-]+\.png$/i.test(body.file_name)
            ? body.file_name : `${body.job_id}.png`,
          contents: body.artwork_base64,
        });
        imageId = image.id;
      }
      const product = await api<PrintifyProduct>(token, `/shops/${shop}/products.json`, "POST", {
        title: `${body.title} – ${kind === "shirt" ? "T-Shirt" : "Sticker"}`,
        description: body.description,
        tags: [...new Set([...(body.tags ?? []), marker])].slice(0, 13),
        blueprint_id: config.blueprint_id,
        print_provider_id: config.print_provider_id,
        variants: config.variants.map(v => ({ id: v.id, price: v.price, is_enabled: true })),
        print_areas: [{ variant_ids: config.variants.map(v => v.id), placeholders: [{
          position: config.position,
          ...(config.decoration_method ? { decoration_method: config.decoration_method } : {}),
          images: [{ id: imageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
        }] }],
      });
      // Only the configured Printify shop is published; it must be connected to Etsy.
      // Successful API acceptance does not prove an Etsy listing is live.
      try {
        await api<unknown>(token, `/shops/${shop}/products/${product.id}/publish.json`, "POST", {
          title: true, description: true, images: true, variants: true, tags: true,
          keyFeatures: true, shipping_template: true,
        });
        results.push({ kind, id: product.id, created: true, submitted_to_channel: true });
      } catch (error) {
        results.push({ kind, id: product.id, created: true, submitted_to_channel: false, error: String(error) });
      }
    } catch (error) {
      results.push({ kind, error: String(error) });
    }
  }
  // Existing Printify -> Supabase sync remains the website merchandising authority.
  // Do not silently flip website visibility flags for newly-created products.
  return response({
    ok: results.every(r => r.submitted_to_channel === true),
    job_id: body.job_id, website_requested: body.website ?? "none",
    website_publication: "pending_product_sync_and_merchandising",
    etsy_listing_verification: "not_verified",
    results,
  }, results.every(r => r.submitted_to_channel) ? 200 : 207);
}
export const Route = createFileRoute("/api/admin/printify-publish")({
  server: { handlers: {
    GET: async () => response({ ok: false, error: "Method not allowed" }, 405),
    POST: async ({ request }) => run(request),
  } },
});
