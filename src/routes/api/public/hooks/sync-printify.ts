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

type WebsiteSettings = {
  is_active: boolean;
  category: string | null;
  collections: string[];
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
};

function stripHtml(value: string): string {
  return (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function variantIdFromSrc(src: string): number | null {
  const match = src.match(/\/mockup\/[^/]+\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

function imagesForVariant(
  variantId: number,
  images: PrintifyImage[],
  colorByVariantId: Map<number, string>,
): PrintifyImage[] {
  const exactMatches = images.filter((image) => variantIdFromSrc(image.src) === variantId);
  if (exactMatches.length > 0) return exactMatches;

  const desiredColor = colorByVariantId.get(variantId);
  if (desiredColor) {
    const colorMatches = images.filter((image) => {
      const mockupVariantId = variantIdFromSrc(image.src);
      return mockupVariantId != null && colorByVariantId.get(mockupVariantId) === desiredColor;
    });
    if (colorMatches.length > 0) return colorMatches;
  }

  return images.filter((image) => (image.variant_ids ?? []).includes(variantId));
}

function extractColors(variants: PrintifyVariant[]): string[] {
  const colors = new Set<string>();
  for (const variant of variants) {
    const color = variant.title?.split("/")[0]?.trim();
    if (color) colors.add(color);
  }
  return Array.from(colors);
}

function pickPrimaryImage(images: PrintifyImage[]): string {
  if (images.length === 0) return "";
  return (
    images.find((image) => image.is_default)?.src ??
    images.find((image) => (image.position ?? "").toLowerCase() === "front")?.src ??
    images[0].src
  );
}

function buildVariants(
  variants: PrintifyVariant[],
  images: PrintifyImage[],
): Array<{
  id: number;
  title: string;
  price: number;
  image: string | null;
  images: string[];
  color: string;
  is_enabled: boolean;
}> {
  const colorByVariantId = new Map<number, string>();
  for (const variant of variants) {
    const color = variant.title?.split("/")[0]?.trim();
    if (color) colorByVariantId.set(variant.id, color);
  }

  return variants
    .filter((variant) => variant.is_enabled && variant.title)
    .map((variant) => {
      const matches = imagesForVariant(variant.id, images, colorByVariantId);
      const variantImages = matches.map((image) => image.src);
      return {
        id: variant.id,
        title: variant.title!,
        price: Math.round(variant.price) / 100,
        image: variantImages[0] ?? null,
        images: variantImages,
        color: variant.title!.split("/")[0]?.trim() ?? "",
        is_enabled: variant.is_enabled,
      };
    });
}

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

function mapProduct(product: PrintifyProduct, settings?: WebsiteSettings) {
  const enabledVariants = (product.variants ?? []).filter((variant) => variant.is_enabled);
  const chosenVariant = enabledVariants.find((variant) => variant.is_default) ?? enabledVariants[0];
  const image = pickPrimaryImage(product.images ?? []);
  const externalHandle = product.external?.handle;
  const productUrl = externalHandle
    ? externalHandle.startsWith("http")
      ? externalHandle
      : `https://${externalHandle}`
    : `https://printify.com/app/store/products/${product.id}`;

  return {
    id: product.id,
    printify_product_id: product.id,
    title: product.title,
    description: stripHtml(product.description).slice(0, 800),
    price: Math.round(chosenVariant?.price ?? 0) / 100,
    currency: "USD",
    image_url: image,
    product_url: productUrl,
    tags: product.tags ?? [],
    colors: extractColors(enabledVariants),
    variants: buildVariants(product.variants ?? [], product.images ?? []),
    source: "printify",
    synced_at: new Date().toISOString(),

    // Website merchandising is owned by Keep TX Red, not Printify.
    // New products start hidden; existing choices survive every sync.
    is_active: settings?.is_active ?? false,
    category: settings?.category ?? null,
    collections: settings?.collections ?? [],
    is_featured: settings?.is_featured ?? false,
    is_new: settings?.is_new ?? false,
    is_on_sale: settings?.is_on_sale ?? false,
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
          { ok: false, error: `Printify products ${response.status}`, detail: detail.slice(0, 300) },
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
      .select("id,is_active,category,collections,is_featured,is_new,is_on_sale")
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
      });
    }

    const mapped = allProducts.map((product) => mapProduct(product, settingsById.get(product.id)));

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
