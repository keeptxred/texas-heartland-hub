import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { merchantImageUrl } from "@/lib/merchant-image-url";
import { parseProductVariantOptions } from "@/lib/product-variant-options";
import { getProducts, type Product, type ProductVariant } from "@/lib/products.functions";
import { BASE_URL } from "@/lib/sitemap-shared";
import { seoDescription, seoTitle } from "@/lib/shop-seo";

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const BRAND = "Keep TX Red";
const TITLE_LIMIT = 150;
const DESCRIPTION_LIMIT = 5000;
const STANDARD_SHIPPING_PRICE_USD = 6.99;
const FREE_SHIPPING_THRESHOLD_USD = 35;

type VariantOption = {
  name: "Color" | "Size";
  value: string;
};

type MerchantItem = {
  id: string;
  mpn: string;
  itemGroupId?: string;
  itemGroupTitle?: string;
  variantOptions?: VariantOption[];
  title: string;
  description: string;
  link: string;
  canonicalLink: string;
  imageLink: string;
  price: number;
  currency: string;
  color?: string;
  size?: string;
  category?: string;
  apparel: boolean;
};

function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function plainText(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function limitText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
}

function productCategory(product: Product): { category?: string; apparel: boolean } {
  const haystack = [product.title, ...(product.tags ?? [])].join(" ").toLowerCase();

  if (/\b(t-?shirt|tee|shirt|sweatshirt|hoodie|tank top|long sleeve)\b/.test(haystack)) {
    return { category: "212", apparel: true };
  }
  if (/\b(hat|cap|beanie|headwear)\b/.test(haystack)) {
    return { category: "173", apparel: true };
  }
  if (/\b(sticker|decal)\b/.test(haystack)) {
    return { category: "4054", apparel: false };
  }
  if (/\btumbler\b/.test(haystack)) {
    return { category: "2951", apparel: false };
  }
  if (/\bmug\b/.test(haystack)) {
    return { category: "2169", apparel: false };
  }
  if (/\b(cup|drinkware)\b/.test(haystack)) {
    return { category: "674", apparel: false };
  }
  if (/\b(poster|print|wall art|canvas)\b/.test(haystack)) {
    return { category: "500044", apparel: false };
  }
  if (/\btote\b/.test(haystack)) {
    return { category: "5608", apparel: false };
  }
  if (/\bbag\b/.test(haystack)) {
    return { category: "5181", apparel: false };
  }

  return { apparel: false };
}

function variantAttributes(variant: ProductVariant): { color?: string; size?: string } {
  const parsed = parseProductVariantOptions(variant.title, variant.color);
  return {
    ...(parsed.color ? { color: parsed.color } : {}),
    ...(parsed.size ? { size: parsed.size } : {}),
  };
}

function itemTitle(product: Product, variant?: ProductVariant): string {
  const title = seoTitle(product);
  if (!variant) return limitText(plainText(title), TITLE_LIMIT);
  const attrs = variantAttributes(variant);
  const options = [attrs.color, attrs.size].filter(Boolean);
  const withOptions = options.length ? `${title} - ${options.join(" / ")}` : title;
  return limitText(plainText(withOptions), TITLE_LIMIT);
}

function variantOptionNames(
  product: Product,
  variants: ProductVariant[],
  apparel: boolean,
): Array<VariantOption["name"]> {
  if (variants.length <= 1) return [];

  const rows = variants.map((variant) => {
    const attrs = variantAttributes(variant);
    return { Color: attrs.color, Size: attrs.size };
  });
  const candidates: Array<Array<VariantOption["name"]>> = [
    ["Color"],
    ["Size"],
    ["Color", "Size"],
  ];

  for (const names of candidates) {
    if (!rows.every((row) => names.every((name) => Boolean(row[name])))) continue;
    const combinations = rows.map((row) => names.map((name) => row[name]).join("\u001f"));
    if (new Set(combinations).size === combinations.length) return names;
  }

  return [];
}

function merchantItems(product: Product): MerchantItem[] {
  const description = limitText(plainText(seoDescription(product)), DESCRIPTION_LIMIT);
  const canonicalLink = `${BASE_URL}/shop/${encodeURIComponent(product.id)}`;
  const { category, apparel } = productCategory(product);
  const enabledVariants = (product.variants ?? []).filter((variant) => variant.is_enabled !== false);

  if (enabledVariants.length === 0) {
    const imageLink = merchantImageUrl(product.image);
    if (!imageLink || !Number.isFinite(product.price) || product.price <= 0 || !description) return [];

    const color = product.colors?.length === 1 ? product.colors[0]?.trim() || undefined : undefined;
    if (apparel) return [];

    return [{
      id: product.id,
      mpn: product.id,
      title: itemTitle(product),
      description,
      link: canonicalLink,
      canonicalLink,
      imageLink,
      price: product.price,
      currency: product.currency || "USD",
      category,
      apparel,
      color,
    }];
  }

  const optionNames = variantOptionNames(product, enabledVariants, apparel);

  return enabledVariants.flatMap((variant) => {
    const imageLink = merchantImageUrl(variant.image || variant.images?.[0] || product.image);
    const price = Number(variant.price || product.price);
    const attrs = variantAttributes(variant);
    const color = attrs.color || (product.colors?.length === 1 ? product.colors[0]?.trim() : undefined);
    const size = attrs.size;
    if (!imageLink || !Number.isFinite(price) || price <= 0 || !description) return [];
    if (apparel && (!color || !size)) return [];

    const id = `${product.id}-${variant.id}`;
    const link = `${BASE_URL}/product-offer/${encodeURIComponent(product.id)}/${encodeURIComponent(String(variant.id))}`;
    const values = { Color: color, Size: size };
    const variantOptions = optionNames.flatMap((name) => {
      const value = values[name];
      return value ? [{ name, value }] : [];
    });

    return [{
      id,
      mpn: id,
      itemGroupId: product.id,
      itemGroupTitle: limitText(plainText(seoTitle(product)), TITLE_LIMIT),
      variantOptions,
      title: itemTitle(product, variant),
      description,
      link,
      canonicalLink,
      imageLink,
      price,
      currency: product.currency || "USD",
      color,
      size,
      category,
      apparel,
    }];
  });
}

function renderVariantOptions(options: VariantOption[] | undefined): string {
  if (!options?.length) return "";
  return options.map((option) => `      <g:variant_option>\n        <g:name>${escapeXml(option.name)}</g:name>\n        <g:value>${escapeXml(option.value)}</g:value>\n      </g:variant_option>`).join("\n");
}

function renderItem(item: MerchantItem): string {
  const optional = [
    item.itemGroupId ? `      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>` : "",
    item.itemGroupTitle ? `      <g:item_group_title>${escapeXml(item.itemGroupTitle)}</g:item_group_title>` : "",
    renderVariantOptions(item.variantOptions),
    item.color ? `      <g:color>${escapeXml(item.color)}</g:color>` : "",
    item.size ? `      <g:size>${escapeXml(item.size)}</g:size>` : "",
    item.apparel ? "      <g:age_group>adult</g:age_group>" : "",
    item.apparel ? "      <g:gender>unisex</g:gender>" : "",
    item.apparel && item.size ? "      <g:size_system>US</g:size_system>" : "",
    item.category ? `      <g:google_product_category>${escapeXml(item.category)}</g:google_product_category>` : "",
    item.currency.toUpperCase() === "USD" ? `      <g:shipping>\n        <g:country>US</g:country>\n        <g:service>Standard</g:service>\n        <g:price>${STANDARD_SHIPPING_PRICE_USD.toFixed(2)} USD</g:price>\n      </g:shipping>` : "",
    item.currency.toUpperCase() === "USD" ? `      <g:free_shipping_threshold>\n        <g:country>US</g:country>\n        <g:price_threshold>${FREE_SHIPPING_THRESHOLD_USD.toFixed(2)} USD</g:price_threshold>\n      </g:free_shipping_threshold>` : "",
  ].filter(Boolean).join("\n");

  return `    <item>\n      <g:id>${escapeXml(item.id)}</g:id>\n      <title>${escapeXml(item.title)}</title>\n      <description>${escapeXml(item.description)}</description>\n      <link>${escapeXml(item.link)}</link>\n      <g:canonical_link>${escapeXml(item.canonicalLink)}</g:canonical_link>\n      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>\n      <g:availability>in_stock</g:availability>\n      <g:condition>new</g:condition>\n      <g:price>${escapeXml(item.price.toFixed(2))} ${escapeXml(item.currency)}</g:price>\n      <g:brand>${escapeXml(BRAND)}</g:brand>\n      <g:mpn>${escapeXml(item.mpn)}</g:mpn>\n${optional}\n    </item>`;
}

function renderFeed(items: MerchantItem[]): string {
  const renderedItems = items.map(renderItem).join("\n");
  return `${XML_HEADER}\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n  <channel>\n    <title>Keep TX Red Product Catalog</title>\n    <link>${escapeXml(`${BASE_URL}/shop`)}</link>\n    <description>Official Keep TX Red apparel and merchandise.</description>\n${renderedItems}\n  </channel>\n</rss>`;
}

function response(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": status === 200
        ? "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400"
        : "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}

export const Route = createFileRoute("/google-merchant-feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const result = await getProducts();

        if (result.isFallback) {
          console.error("google-merchant-feed: live catalog unavailable", result.error);
          return response("Merchant catalog temporarily unavailable.", 503);
        }

        const items = result.products.flatMap(merchantItems);
        return response(renderFeed(items));
      },
    },
  },
});
