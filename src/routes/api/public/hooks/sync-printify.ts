import { createFileRoute } from "@tanstack/react-router";

const PRINTIFY_BASE = "https://api.printify.com/v1";

type PrintifyShop = { id: number; title: string };
type PrintifyImage = {
  src: string;
  is_default?: boolean;
  position?: string;
  variant_ids?: number[];
};
type PrintifyVariant = {
  id: number;
  title?: string;
  price: number;
  is_enabled: boolean;
  is_default?: boolean;
};
type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  images?: PrintifyImage[];
  variants?: PrintifyVariant[];
  visible?: boolean;
  is_locked?: boolean;
  external?: { handle?: string };
};

function stripHtml(s: string): string {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractColors(variants: PrintifyVariant[]): string[] {
  const colors = new Set<string>();
  for (const v of variants) {
    if (v.title) {
      // Printify usually formats like: "White / S" or "Red / M"
      const color = v.title.split("/")[0].trim();
      if (color) colors.add(color);
    }
  }
  return Array.from(colors);
}

// Choose the most representative primary image for the shop grid.
// Prefers non-white/off-white shots, then default flag, then position=front, then first.
function pickPrimaryImage(images: PrintifyImage[]): string {
  if (!images || images.length === 0) return "";
  const isWhitish = (src: string) => /white|blank|ghost/i.test(src);
  const nonWhite = images.filter((i) => !isWhitish(i.src));
  const pool = nonWhite.length > 0 ? nonWhite : images;
  return (
    pool.find((i) => i.is_default)?.src ??
    pool.find((i) => (i.position ?? "").toLowerCase() === "front")?.src ??
    pool[0].src
  );
}

// Build per-color variant image map for the product detail page.
// Returns [{ color, image, variantIds }] with one entry per distinct color.
function buildColorVariants(
  variants: PrintifyVariant[],
  images: PrintifyImage[],
): Array<{ color: string; image: string; variant_ids: number[] }> {
  const enabled = variants.filter((v) => v.is_enabled && v.title);
  const byColor = new Map<string, number[]>();
  for (const v of enabled) {
    const color = v.title!.split("/")[0].trim();
    if (!color) continue;
    const list = byColor.get(color) ?? [];
    list.push(v.id);
    byColor.set(color, list);
  }
  const out: Array<{ color: string; image: string; variant_ids: number[] }> = [];
  for (const [color, ids] of byColor.entries()) {
    const idSet = new Set(ids);
    const match = images.find((img) =>
      (img.variant_ids ?? []).some((vid) => idSet.has(vid)),
    );
    if (!match) continue;
    out.push({ color, image: match.src, variant_ids: ids });
  }
  return out;
}

async function resolveShopId(token: string, requested: string): Promise<string> {
  if (/^\d+$/.test(requested)) return requested;
  const res = await fetch(`${PRINTIFY_BASE}/shops.json`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Printify /shops.json ${res.status}`);
  const shops = (await res.json()) as PrintifyShop[];
  const wanted = requested.toLowerCase();
  const match = shops.find((s) => s.title?.toLowerCase().includes(wanted)) ?? shops[0];
  if (!match) throw new Error("No Printify shops found on this account");
  return String(match.id);
}

function mapProduct(p: PrintifyProduct, shopId: string) {
  const enabled = (p.variants ?? []).filter((v) => v.is_enabled);
  const chosen = enabled.find((v) => v.is_default) ?? enabled[0];
  const priceCents = chosen?.price ?? 0;
  const image = pickPrimaryImage(p.images ?? []);
  const variants = buildColorVariants(p.variants ?? [], p.images ?? []);
  const handle = p.external?.handle;
  const url = handle
    ? handle.startsWith("http")
      ? handle
      : `https://${handle}`
    : `https://printify.com/app/store/products/${p.id}`;
  return {
    id: p.id,
    title: p.title,
    description: stripHtml(p.description).slice(0, 800),
    price: Math.round(priceCents) / 100,
    currency: "USD",
    image_url: image,
    product_url: url,
    tags: p.tags ?? [],
    colors: extractColors(enabled),
    variants,
    source: "printify",
    is_active: (p.visible ?? true) && enabled.length > 0 && Boolean(image),
    synced_at: new Date().toISOString(),
  };
}

export const Route = createFileRoute("/api/public/hooks/sync-printify")({
  server: {
    handlers: {
      GET: async () => runSync(),
      POST: async () => runSync(),
    },
  },
});

async function runSync(): Promise<Response> {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopEnv = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopEnv) {
    return Response.json({ ok: false, error: "Missing Printify env vars" }, { status: 500 });
  }

  try {
    const shopId = await resolveShopId(token, shopEnv);

    const all: PrintifyProduct[] = [];
    let page = 1;
    // Printify returns up to ~50 per page; loop until we get less than limit.
    // Safety cap 20 pages.
    while (page <= 20) {
      const res = await fetch(
        `${PRINTIFY_BASE}/shops/${shopId}/products.json?limit=50&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return Response.json(
          { ok: false, error: `Printify products ${res.status}`, detail: body.slice(0, 300) },
          { status: 502 },
        );
      }
      const json = (await res.json()) as { data: PrintifyProduct[] };
      const batch = json.data ?? [];
      all.push(...batch);
      if (batch.length < 50) break;
      page++;
    }

    const mapped = all.map((p) => mapProduct(p, shopId));
    const seenIds = new Set(mapped.map((m) => m.id));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (mapped.length > 0) {
      const { error: upsertErr } = await supabaseAdmin
        .from("products")
        .upsert(mapped, { onConflict: "id" });
      if (upsertErr) {
        return Response.json({ ok: false, error: upsertErr.message }, { status: 500 });
      }
    }

    // Deactivate products no longer returned from Printify (soft delete).
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("source", "printify");
    const stale = (existing ?? [])
      .map((r) => r.id)
      .filter((id) => !seenIds.has(id));
    if (stale.length > 0) {
      await supabaseAdmin
        .from("products")
        .update({ is_active: false })
        .in("id", stale);
    }

    return Response.json({
      ok: true,
      shopId,
      fetched: all.length,
      upserted: mapped.length,
      deactivated: stale.length,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}