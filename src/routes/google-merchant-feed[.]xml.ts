import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getProducts, type Product, type ProductVariant } from "@/lib/products.functions";
import { BASE_URL } from "@/lib/sitemap-shared";

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const BRAND = "Keep TX Red";

type MerchantItem = {
  id: string;
  itemGroupId?: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: number;
  currency: string;
  color?: string;
  size?: string;
  category: string;
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

function absoluteImageUrl(value: string | null | undefined): string {
  if (!value) return "";
  try {
    return new URL(value, BASE_URL).toString();
  } catch {
    return "";
  }
}

function productCategory(product: Product): { category: string; apparel: boolean } {
  const haystack = [product.title, ...(product.tags ?? [])].join(" ").toLowerCase();

  if (/\b(t-?shirt|tee|shirt|sweatshirt|hoodie|tank top|long sleeve)\b/.test(haystack)) {
    return { category: "Apparel & Accessories > Clothing", apparel: true };
  }
  if (/\b(hat|cap|beanie|headwear)\b/.test(haystack)) {
    return { category: "Apparel & Accessories > Clothing Accessories > Hats", apparel: true };
  }
  if (/\b(sticker|decal)\b/.test(haystack)) {
    return { category: "Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Stickers", apparel: false };
  }
  if (/\b(mug|tumbler|cup|drinkware)\b/.test(haystack)) {
    return { category: "Home & Garden > Kitchen & Dining > Tableware > Drinkware", apparel: false };
  }
  if (/\b(poster|print|wall art|canvas)\b/.test(haystack)) {
    return { category: "Home & Garden > Decor > Artwork", apparel: false };
  }
  if (/\b(tote|bag)\b/.test(haystack)) {
    return { category: "Apparel & Accessories > Handbags, Wallets & Cases > Handbags", apparel: true };
  }

  return { category: "Apparel & Accessories", apparel: false };
}

function variantSize(variant: ProductVariant): string | undefined {
  const title = variant.title.trim();
  if (!title) return undefined;

  const parts = title.split(/\s*\/\s*|\s*\|\s*|\s+-\s+/).map((part) => part.trim()).filter(Boolean);
  const knownSize = parts.find((part) =>
    /^(?:XXS|XS|S|M|L|XL|2XL|XXL|3XL|XXXL|4XL|XXXXL|5XL|6XL|\d+(?:\.\d+)?\s*(?:in|inch|inches|cm)?|\d+\s*[x×]\s*\d+)$/i.test(part),
  );
  return knownSize;
}

function itemTitle(product: Product, variant?: ProductVariant): string {
  if (!variant) return product.title;
  const options = [variant.color, variantSize(variant)].filter(Boolean);
  return options.length ? `${product.title} - ${options.join(" / ")}` : product.title;
}

function merchantItems(product: Product): MerchantItem[] {
  const description = plainText(product.description) || `${product.title} from Keep TX Red.`;
  const link = `${BASE_URL}/shop/${encodeURIComponent(product.id)}`;
  const { category, apparel } = productCategory(product);
  const enabledVariants = (product.variants ?? []).filter((variant) => variant.is_enabled !== false);

  if (enabledVariants.length === 0) {
    const imageLink = absoluteImageUrl(product.image);
    if (!imageLink || !Number.isFinite(product.price) || product.price <= 0) return [];
    return [{
      id: product.id,
      title: product.title,
      description,
      link,
      imageLink,
      price: product.price,
      currency: product.currency || "USD",
      category,
      apparel,
      color: product.colors?.length === 1 ? product.colors[0] : undefined,
    }];
  }

  return enabledVariants.flatMap((variant) => {
    const imageLink = absoluteImageUrl(variant.image || variant.images?.[0] || product.image);
    const price = Number(variant.price || product.price);
    if (!imageLink || !Number.isFinite(price) || price <= 0) return [];

    return [{
      id: `${product.id}-${variant.id}`,
      itemGroupId: product.id,
      title: itemTitle(product, variant),
      description,
      link,
      imageLink,
      price,
      currency: product.currency || "USD",
      color: variant.color || undefined,
      size: variantSize(variant),
      category,
      apparel,
    }];
  });
}

function renderItem(item: MerchantItem): string {
  const optional = [
    item.itemGroupId ? `      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>` : "",
    item.color ? `      <g:color>${escapeXml(item.color)}</g:color>` : "",
    item.size ? `      <g:size>${escapeXml(item.size)}</g:size>` : "",
    item.apparel ? "      <g:age_group>adult</g:age_group>" : "",
    item.apparel ? "      <g:gender>unisex</g:gender>" : "",
  ].filter(Boolean).join("\n");

  return `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:condition>new</g:condition>
      <g:price>${escapeXml(item.price.toFixed(2))} ${escapeXml(item.currency)}</g:price>
      <g:brand>${escapeXml(BRAND)}</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${escapeXml(item.category)}</g:google_product_category>
${optional}
    </item>`;
}

function renderFeed(items: MerchantItem[]): string {
  const renderedItems = items.map(renderItem).join("\n");
  return `${XML_HEADER}
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Keep TX Red Product Catalog</title>
    <link>${escapeXml(`${BASE_URL}/shop`)}</link>
    <description>Official Keep TX Red apparel and merchandise.</description>
${renderedItems}
  </channel>
</rss>`;
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
    },
  });
}

export const Route = createFileRoute("/google-merchant-feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const result = await getProducts();

        // Never publish the local demo catalog to Merchant Center. Returning a
        // temporary error preserves Google's last successful catalog instead of
        // replacing it with placeholder products during an outage.
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
