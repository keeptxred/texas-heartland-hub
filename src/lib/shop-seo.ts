import type { Product } from "@/lib/products.functions";

const BRAND = "Keep Texas Red";

/**
 * Manufacturer / generic terms we strip from Printify titles before rebuilding
 * a Texas-first SEO title.
 */
const NOISE = [
  "unisex",
  "heavy blend",
  "heavyweight",
  "cotton canvas",
  "kiss[-\\s]?cut",
  "die[-\\s]?cut",
  "gildan",
  "bella\\s*\\+?\\s*canvas",
  "next level",
  "champion",
  "premium",
  "classic",
  "eco",
  "organic",
  "adult",
];

/**
 * Product-type keywords we normalize to a clean noun for the SEO title.
 * Order matters: first match wins.
 */
const TYPE_MAP: Array<[RegExp, string]> = [
  [/hoodie|pullover|sweatshirt/i, "Hoodie"],
  [/long[-\s]?sleeve/i, "Long Sleeve Tee"],
  [/t[-\s]?shirt|\btee\b/i, "Tee"],
  [/tote\s*bag|canvas\s*tote/i, "Canvas Tote Bag"],
  [/beanie/i, "Beanie"],
  [/trucker/i, "Trucker Hat"],
  [/snapback/i, "Snapback Hat"],
  [/dad\s*hat/i, "Dad Hat"],
  [/\bcap\b|\bhat\b/i, "Hat"],
  [/mug/i, "Mug"],
  [/poster|print/i, "Poster Print"],
  [/sticker/i, "Vinyl Stickers"],
  [/mouse\s*pad/i, "Mouse Pad"],
  [/pillow/i, "Throw Pillow"],
  [/tank/i, "Tank Top"],
];

function stripNoise(input: string): string {
  let out = input;
  for (const n of NOISE) out = out.replace(new RegExp(`\\b${n}\\b`, "gi"), "");
  return out.replace(/\s{2,}/g, " ").trim();
}

function inferProductType(title: string): string {
  for (const [rx, label] of TYPE_MAP) if (rx.test(title)) return label;
  const cleaned = stripNoise(title);
  return cleaned || "Apparel";
}

/**
 * Returns an SEO-optimized display title for a Printify product. If the
 * source title already contains Texas-flavored branding we leave it alone.
 */
export function seoTitle(product: Pick<Product, "title">): string {
  const raw = (product.title || "").trim();
  if (!raw) return `${BRAND} Texas Patriotic Apparel`;
  if (/(keep\s*texas\s*red|texas\s*flag|texas|patriotic)/i.test(raw)) return raw;
  const type = inferProductType(raw);
  return `${BRAND} Texas Patriotic ${type}`;
}

export function seoDescription(product: Pick<Product, "title">): string {
  return `Buy ${seoTitle(product)} from ${BRAND}. Premium Texas patriotic apparel for proud Texans with secure checkout and fast shipping.`;
}

export function seoAlt(product: Pick<Product, "title">, color?: string | null): string {
  const t = seoTitle(product);
  return color ? `${t} in ${color} by ${BRAND}` : `${t} by ${BRAND}`;
}

export function productSlug(product: Pick<Product, "id" | "title">): string {
  const base = seoTitle(product)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || product.id;
}