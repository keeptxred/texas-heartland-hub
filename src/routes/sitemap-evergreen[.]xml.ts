import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
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
          entries.push({
            loc: `${BASE_URL}/news/${a.slug}`,
            lastmod: toIsoDate(a.publishedAt),
          });
        }

        try {
          const { articles } = await listSitemapArticles();
          for (const a of articles) {
            entries.push({
              loc: `${BASE_URL}/news/${a.slug}`,
              lastmod: toIsoDate(a.updated_at || a.published_at),
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