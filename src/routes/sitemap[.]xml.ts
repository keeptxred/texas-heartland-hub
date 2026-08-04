import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, isRealImage, toIsoDate, xmlEscape, xmlResponse } from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getProducts } from "@/lib/products.functions";
import { AUTHORS } from "@/data/authors";
import { ELECTION_STATIC_SITEMAP_COUNT } from "@/lib/elections/sitemap";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";

const INDEX_LASTMOD = toIsoDate("2026-08-03T00:00:00-05:00");

function isCompleteAuthor(author: (typeof AUTHORS)[number]): boolean {
  return Boolean(
    author.slug.trim()
      && author.name.trim().length >= 3
      && author.role.trim().length >= 3
      && author.bio.some((paragraph) => paragraph.trim().length >= 80)
      && author.beats.some((beat) => beat.trim().length >= 3),
  );
}

/** Sitemap index. Includes every dedicated sitemap at most once and omits empty dynamic sitemaps. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const cutoff = Date.now() - 48 * 60 * 60 * 1000;
        const localArticles = ARTICLES.filter((article) => isPublished(article));
        let cloudArticles: Array<{
          published_at: string;
          image_url: string | null;
          title: string;
          slug: string;
          kind: string;
          updated_at: string | null;
        }> = [];
        try {
          cloudArticles = (await listSitemapArticles()).articles;
        } catch (error) {
          console.error("sitemap index: cloud articles fetch failed", error);
        }

        const newsCount =
          localArticles.filter((article) => new Date(article.publishedAt).getTime() >= cutoff).length
          + cloudArticles.filter((article) =>
            new Date(article.published_at).getTime() >= cutoff
            && (article.kind === "ingested" || article.kind === "news"),
          ).length;
        const evergreenCount = localArticles.length + cloudArticles.length;

        let productCount = 0;
        let productImageCount = 0;
        try {
          const { products, isFallback } = await getProducts();
          if (!isFallback) {
            const completeProducts = products.filter((product) =>
              String(product.id ?? "").trim()
              && String(product.title ?? "").trim()
              && isRealImage(product.image),
            );
            productCount = completeProducts.length;
            productImageCount = completeProducts.length;
          }
        } catch (error) {
          console.error("sitemap index: products fetch failed", error);
        }

        const authorCount = AUTHORS.filter(isCompleteAuthor).length;
        const imageCount =
          localArticles.filter((article) => isRealImage(article.image)).length
          + cloudArticles.filter((article) => isRealImage(article.image_url)).length
          + productImageCount;

        const candidates = [
          { file: "sitemap-pages.xml", count: 1 },
          { file: "sitemap-elections.xml", count: ELECTION_STATIC_SITEMAP_COUNT },
          { file: "sitemap-government.xml", count: GOVERNMENT_ENTITIES.length + 1 },
          { file: "sitemap-bills.xml", count: 1 },
          { file: "sitemap-representatives.xml", count: 1 },
          { file: "sitemap-committees.xml", count: 1 },
          { file: "sitemap-districts.xml", count: 205 },
          { file: "sitemap-legislature.xml", count: 3 },
          { file: "sitemap-news.xml", count: newsCount },
          { file: "sitemap-evergreen.xml", count: evergreenCount },
          { file: "sitemap-products.xml", count: productCount },
          { file: "sitemap-authors.xml", count: authorCount },
          { file: "sitemap-images.xml", count: imageCount },
        ];

        const seen = new Set<string>();
        const included = candidates.filter(({ file, count }) => {
          if (count <= 0 || seen.has(file)) return false;
          seen.add(file);
          return true;
        });
        const entries = included.map(({ file }) =>
          `  <sitemap>\n    <loc>${xmlEscape(`${BASE_URL}/${file}`)}</loc>\n    <lastmod>${INDEX_LASTMOD}</lastmod>\n  </sitemap>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
        return xmlResponse(xml);
      },
    },
  },
});