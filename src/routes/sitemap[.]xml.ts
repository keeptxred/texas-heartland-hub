import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, xmlEscape, xmlResponse } from "@/lib/sitemap-shared";

/**
 * Deterministic sitemap index.
 *
 * The root sitemap must remain available even when optional database, catalog,
 * or byline services are cold or unavailable. Child sitemap routes own their
 * data fetching and may return an empty but valid urlset when they have no
 * eligible entries. Bulk district, representative, and bill-detail sitemaps
 * remain intentionally unadvertised to protect crawl budget.
 *
 * sitemap-priority.xml is a derivative discovery feed: every URL it advertises
 * must also be canonically owned by one of the primary child sitemaps.
 */
const ADVERTISED_SITEMAPS = [
  "sitemap-pages.xml",
  "sitemap-sources.xml",
  "sitemap-news.xml",
  "sitemap-evergreen.xml",
  "sitemap-priority.xml",
  "sitemap-elections.xml",
  "sitemap-government.xml",
  "sitemap-political-figures.xml",
  "sitemap-political-geography.xml",
  "sitemap-party-representation.xml",
  "sitemap-legislature.xml",
  "sitemap-committees.xml",
  "sitemap-authors.xml",
  "sitemap-products.xml",
  "sitemap-images.xml",
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries = ADVERTISED_SITEMAPS.map((file) =>
          `  <sitemap>\n    <loc>${xmlEscape(`${BASE_URL}/${file}`)}</loc>\n  </sitemap>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
        return xmlResponse(xml);
      },
    },
  },
});
