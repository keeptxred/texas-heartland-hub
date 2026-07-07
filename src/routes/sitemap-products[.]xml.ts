import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { getProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];
        try {
          const { products } = await getProducts();
          const lastmod = toIsoDate(new Date());
          for (const p of products) {
            entries.push({ loc: `${BASE_URL}/shop/${p.id}`, lastmod });
          }
        } catch (e) {
          console.error("sitemap-products: fetch failed", e);
        }
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});