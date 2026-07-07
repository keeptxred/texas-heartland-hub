import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  renderUrlset,
  xmlResponse,
  toIsoDate,
  absUrl,
  isRealImage,
  type UrlEntry,
} from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getProducts } from "@/lib/products.functions";

/** Image sitemap: one <image:image> per indexable page with a primary image.
 *  Dedupes by image URL so the same asset never appears twice. */
export const Route = createFileRoute("/sitemap-images.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];
        const seenImg = new Set<string>();

        const push = (loc: string, image: string | null | undefined, title: string, lastmod: string) => {
          if (!isRealImage(image)) return;
          const abs = absUrl(image);
          if (seenImg.has(abs)) return;
          seenImg.add(abs);
          entries.push({ loc, lastmod, image: { loc: abs, title } });
        };

        for (const a of ARTICLES.filter((a) => isPublished(a))) {
          push(`${BASE_URL}/news/${a.slug}`, a.image, a.title, toIsoDate(a.publishedAt));
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            push(
              `${BASE_URL}/news/${a.slug}`,
              a.image_url,
              a.title,
              toIsoDate(a.updated_at || a.published_at),
            );
          }
        } catch (e) {
          console.error("sitemap-images: cloud fetch failed", e);
        }

        try {
          const { products } = await getProducts();
          const lastmod = toIsoDate(new Date());
          for (const p of products) {
            push(`${BASE_URL}/shop/${p.id}`, p.image, p.title, lastmod);
          }
        } catch (e) {
          console.error("sitemap-images: products fetch failed", e);
        }

        return xmlResponse(renderUrlset(entries, { image: true }));
      },
    },
  },
});