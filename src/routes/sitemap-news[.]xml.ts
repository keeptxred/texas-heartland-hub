import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  xmlEscape,
  xmlResponse,
  toIsoDate,
  canonicalize,
  isArticleSlugDateConsistent,
} from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const WINDOW_MS = 48 * 60 * 60 * 1000;

function hasSubstantiveStaticBody(slug: string): boolean {
  return Boolean(ARTICLE_BODIES[slug]);
}

/** Google News sitemap — only articles from the last 48 hours. */
export const Route = createFileRoute("/sitemap-news.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cutoff = now - WINDOW_MS;

        type NewsItem = { loc: string; title: string; pubDate: string };
        const items: NewsItem[] = [];

        for (const a of ARTICLES.filter((a) =>
          isPublished(a)
          && isStaticArticleIndexable(a)
          && hasSubstantiveStaticBody(a.slug),
        )) {
          const t = new Date(a.publishedAt).getTime();
          if (isNaN(t) || t < cutoff || !isArticleSlugDateConsistent(a.slug, a.publishedAt)) continue;
          items.push({
            loc: `${BASE_URL}/news/${a.slug}`,
            title: a.title,
            pubDate: toIsoDate(a.publishedAt),
          });
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            if (a.kind !== "ingested" && a.kind !== "news") continue;
            const t = new Date(a.published_at).getTime();
            if (isNaN(t) || t < cutoff || !isArticleSlugDateConsistent(a.slug, a.published_at)) continue;
            items.push({
              loc: `${BASE_URL}/news/${a.slug}`,
              title: a.title,
              pubDate: toIsoDate(a.published_at),
            });
          }
        } catch (e) {
          console.error("sitemap-news: cloud fetch failed", e);
        }

        const seen = new Set<string>();
        const rows: string[] = [];
        for (const it of items) {
          const key = canonicalize(it.loc);
          if (!key || seen.has(key)) continue;
          seen.add(key);
          rows.push(
            `  <url>\n    <loc>${xmlEscape(key)}</loc>\n    <lastmod>${it.pubDate}</lastmod>\n    <news:news>\n      <news:publication>\n        <news:name>Keep Texas Red</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${it.pubDate}</news:publication_date>\n      <news:title>${xmlEscape(it.title)}</news:title>\n    </news:news>\n  </url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${rows.join("\n")}\n</urlset>`;
        return xmlResponse(xml);
      },
    },
  },
});