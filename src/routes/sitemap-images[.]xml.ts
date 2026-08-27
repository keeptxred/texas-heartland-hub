import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  renderUrlset,
  xmlResponse,
  toIsoDate,
  latestIsoDate,
  absUrl,
  isRealImage,
  type UrlEntry,
} from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getProducts } from "@/lib/products.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const PRODUCT_CATALOG_LASTMOD = toIsoDate("2026-07-01T00:00:00-05:00");
const TOMBSTONED_ARTICLE_SLUGS = new Set([
  "2026-07-10-texas-wrestling-coach-from-amarillo-sentenced-to-18-years-for-abuse",
]);

/** Image sitemap: one <image:image> per indexable page with a primary image.
 * Dedupes by image URL so the same asset never appears twice. */
export const Route = createFileRoute("/sitemap-images.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];
        const seenImg = new Set<string>();

        const push = (
          loc: string,
          image: string | null | undefined,
          title: string,
          lastmod: string,
          caption?: string | null,
        ) => {
          if (!isRealImage(image)) return;
          const abs = absUrl(image);
          if (!abs || seenImg.has(abs)) return;
          seenImg.add(abs);
          entries.push({
            loc,
            lastmod,
            image: {
              loc: abs,
              title: title.trim(),
              caption: caption?.trim() || title.trim(),
            },
          });
        };

        for (const a of ARTICLES.filter(
          (a) => isPublished(a) && isStaticArticleIndexable(a) && Boolean(ARTICLE_BODIES[a.slug]),
        )) {
          if (TOMBSTONED_ARTICLE_SLUGS.has(a.slug)) continue;
          push(
            `${BASE_URL}/news/${a.slug}`,
            a.image,
            a.title,
            toIsoDate(a.publishedAt),
            a.dek,
          );
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            if (TOMBSTONED_ARTICLE_SLUGS.has(a.slug)) continue;
            push(
              `${BASE_URL}/news/${a.slug}`,
              a.image_url,
              a.title,
              latestIsoDate(a.published_at, a.updated_at),
              a.title,
            );
          }
        } catch (e) {
          console.error("sitemap-images: cloud fetch failed", e);
        }

        try {
          const { products, isFallback } = await getProducts();
          if (isFallback) {
            console.error("sitemap-images: live catalog unavailable; omitting demo product images");
          } else {
            for (const p of products) {
              const id = String(p.id ?? "").trim();
              if (!id) continue;
              push(
                `${BASE_URL}/shop/${encodeURIComponent(id)}`,
                p.image,
                p.title,
                toIsoDate(p.syncedAt) || PRODUCT_CATALOG_LASTMOD,
                `${p.title} from the Keep TX Red shop`,
              );
            }
          }
        } catch (e) {
          console.error("sitemap-images: products fetch failed", e);
        }

        return xmlResponse(renderUrlset(entries, { image: true }));
      },
    },
  },
});