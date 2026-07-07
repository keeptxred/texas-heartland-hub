import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, xmlEscape, xmlResponse } from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getProducts } from "@/lib/products.functions";
import { AUTHORS } from "@/data/authors";

/** Sitemap INDEX. Includes only sub-sitemaps that would contain >0 URLs. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cutoff = now - 48 * 60 * 60 * 1000;

        const localArticles = ARTICLES.filter((a) => isPublished(a));
        let cloudArticles: Array<{
          published_at: string;
          image_url: string | null;
          title: string;
          slug: string;
          kind: string;
          updated_at: string | null;
        }> = [];
        try {
          const res = await listSitemapArticles();
          cloudArticles = res.articles;
        } catch (e) {
          console.error("sitemap index: cloud articles fetch failed", e);
        }

        const newsCount =
          localArticles.filter((a) => new Date(a.publishedAt).getTime() >= cutoff).length +
          cloudArticles.filter(
            (a) =>
              new Date(a.published_at).getTime() >= cutoff &&
              (a.kind === "ingested" || a.kind === "news"),
          ).length;

        const evergreenCount = localArticles.length + cloudArticles.length;

        let productCount = 0;
        try {
          const { products } = await getProducts();
          productCount = products.length;
        } catch (e) {
          console.error("sitemap index: products fetch failed", e);
        }

        const authorCount = AUTHORS.length;
        const imageCount =
          localArticles.length +
          cloudArticles.filter((a) => !!a.image_url).length +
          productCount;

        const included = [
          { file: "sitemap-pages.xml", count: 1 },
          { file: "sitemap-news.xml", count: newsCount },
          { file: "sitemap-evergreen.xml", count: evergreenCount },
          { file: "sitemap-products.xml", count: productCount },
          { file: "sitemap-authors.xml", count: authorCount },
          { file: "sitemap-images.xml", count: imageCount },
        ].filter((s) => s.count > 0);

        const lastmod = new Date().toISOString();
        const entries = included
          .map(
            (s) =>
              `  <sitemap>\n    <loc>${xmlEscape(`${BASE_URL}/${s.file}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
        return xmlResponse(xml);
      },
    },
  },
});