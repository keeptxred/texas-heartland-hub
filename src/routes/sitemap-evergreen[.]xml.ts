import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  renderUrlset,
  xmlResponse,
  toIsoDate,
  latestIsoDate,
  isArticleSlugDateConsistent,
  type UrlEntry,
} from "@/lib/sitemap-shared";
import { ARTICLES, isPublished } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { listSitemapArticles } from "@/lib/evergreen.functions";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/**
 * Tombstoned article slugs that are known to return 404 and must never be
 * advertised in a sitemap even if a stale database row remains behind.
 */
const TOMBSTONED_ARTICLE_SLUGS = new Set([
  "2026-07-10-texas-wrestling-coach-from-amarillo-sentenced-to-18-years-for-abuse",
]);

function isSitemapArticleAllowed(slug: string): boolean {
  return !TOMBSTONED_ARTICLE_SLUGS.has(slug);
}

function hasSubstantiveStaticBody(slug: string): boolean {
  return Boolean(ARTICLE_BODIES[slug]);
}

/** Evergreen + all article URLs (news items also live here for long-term
 *  indexing; the 48-hour News sitemap is separate). */
export const Route = createFileRoute("/sitemap-evergreen.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];

        for (const a of ARTICLES.filter((a) =>
          isPublished(a)
          && isStaticArticleIndexable(a)
          && hasSubstantiveStaticBody(a.slug),
        )) {
          if (!isArticleSlugDateConsistent(a.slug, a.publishedAt)) continue;
          if (!isSitemapArticleAllowed(a.slug)) continue;
          entries.push({
            loc: `${BASE_URL}/news/${a.slug}`,
            lastmod: toIsoDate(a.publishedAt),
          });
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            if (!isArticleSlugDateConsistent(a.slug, a.published_at)) continue;
            if (!isSitemapArticleAllowed(a.slug)) continue;
            entries.push({
              loc: `${BASE_URL}/news/${a.slug}`,
              lastmod: latestIsoDate(a.published_at, a.updated_at),
            });
          }
        } catch (e) {
          console.error("sitemap-evergreen: cloud fetch failed", e);
        }

        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});