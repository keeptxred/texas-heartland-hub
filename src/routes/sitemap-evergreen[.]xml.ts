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
import { listSitemapArticles } from "@/lib/evergreen.functions";

/** Evergreen + all article URLs (news items also live here for long-term
 *  indexing; the 48-hour News sitemap is separate). */
export const Route = createFileRoute("/sitemap-evergreen.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: UrlEntry[] = [];

        for (const a of ARTICLES.filter((a) => isPublished(a))) {
          if (!isArticleSlugDateConsistent(a.slug, a.publishedAt)) continue;
          entries.push({
            loc: `${BASE_URL}/news/${a.slug}`,
            lastmod: toIsoDate(a.publishedAt),
          });
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            if (!isArticleSlugDateConsistent(a.slug, a.published_at)) continue;
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