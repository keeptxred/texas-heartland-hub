import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { getProducts } from "@/lib/products.functions";

// Stable fallback for any legacy live row that predates synced_at. Current live
// products use their actual catalog synchronization timestamp.
const PRODUCT_CATALOG_LASTMOD = toIsoDate("2026-07-01T00:00:00-05:00");

export const Route = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];
        try {
          const { products, isFallback } = await getProducts();
          if (isFallback) {
            console.error("sitemap-products: live catalog unavailable; omitting demo products");
            return xmlResponse(renderUrlset(entries));
          }
          for (const p of products) {
            const id = String(p.id ?? "").trim();
            const title = String(p.title ?? "").trim();
            const image = String(p.image ?? "").trim();
            if (!id || !title || !image) continue;
            entries.push({
              loc: `${BASE_URL}/shop/${encodeURIComponent(id)}`,
              lastmod: toIsoDate(p.syncedAt) || PRODUCT_CATALOG_LASTMOD,
            });
          }
        } catch (e) {
          console.error("sitemap-products: fetch failed", e);
        }
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
