import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  xmlEscape,
  xmlResponse,
  toIsoDate,
  latestIsoDate,
  canonicalize,
  isArticleSlugDateConsistent,
} from "@/lib/sitemap-shared";
import { SITE_NAME } from "@/lib/seo";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { getNewsSitemapHeadlines } from "@/lib/news-sitemap.functions";
import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const WINDOW_MS = 48 * 60 * 60 * 1000;
const MAX_NEWS_URLS = 1000;

function hasSubstantiveStaticBody(slug: string): boolean {
  return Boolean(ARTICLE_BODIES[slug]);
}

export function isGoogleNewsArticleKind(kind: string): boolean {
  return kind === "ingested" || kind === "news";
}

/** Google News sitemap — only recent news articles from the last 48 hours. */
export const Route = createFileRoute("/sitemap-news.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cutoff = now - WINDOW_MS;

        type NewsItem = { loc: string; title: string; pubDate: string; lastmod: string };
        const items: NewsItem[] = [];

        for (const a of ARTICLES.filter((a) =>
          isPublished(a)
          && !a.pillar
          && isStaticArticleIndexable(a)
          && hasSubstantiveStaticBody(a.slug),
        )) {
          const t = new Date(a.publishedAt).getTime();
          if (
            isNaN(t)
            || t < cutoff
            || t > now
            || !isArticleSlugDateConsistent(a.slug, a.publishedAt)
          ) continue;
          items.push({
            loc: `${BASE_URL}/news/${a.slug}`,
            title: a.title,
            pubDate: toIsoDate(a.publishedAt),
            lastmod: latestIsoDate(a.publishedAt, ARTICLE_BODIES[a.slug]?.updated),
          });
        }

        try {
          const { articles } = await listSitemapArticles();
          const recentCloud = articles.filter((a) => {
            if (!isGoogleNewsArticleKind(a.kind)) return false;
            if (!isKeepTxRedSearchOwnedStory({
              title: a.title,
              description: a.dek,
              category: a.category,
              source: a.source_name,
              kind: a.kind,
            })) return false;
            const t = new Date(a.published_at).getTime();
            return !(
              isNaN(t)
              || t < cutoff
              || t > now
              || !isArticleSlugDateConsistent(a.slug, a.published_at)
            );
          });
          const { headlines } = await getNewsSitemapHeadlines({
            data: { slugs: recentCloud.map((a) => a.slug) },
          });

          for (const a of recentCloud) {
            items.push({
              loc: `${BASE_URL}/news/${a.slug}`,
              title: headlines[a.slug] ?? a.title,
              pubDate: toIsoDate(a.published_at),
              lastmod: latestIsoDate(a.published_at, a.updated_at),
            });
          }
        } catch (e) {
          console.error("sitemap-news: cloud fetch failed", e);
        }

        items.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));

        const seen = new Set<string>();
        const rows: string[] = [];
        for (const it of items) {
          if (rows.length >= MAX_NEWS_URLS) break;
          const key = canonicalize(it.loc);
          if (!key || seen.has(key)) continue;
          seen.add(key);
          rows.push(
            `  <url>\n    <loc>${xmlEscape(key)}</loc>\n    <lastmod>${it.lastmod}</lastmod>\n    <news:news>\n      <news:publication>\n        <news:name>${xmlEscape(SITE_NAME)}</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${it.pubDate}</news:publication_date>\n      <news:title>${xmlEscape(it.title)}</news:title>\n    </news:news>\n  </url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${rows.join("\n")}\n</urlset>`;
        return xmlResponse(xml);
      },
    },
  },
});