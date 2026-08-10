import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/sitemap-shared";

/** Dynamic robots.txt. Points at the sitemap INDEX so any new sub-sitemap
 *  is picked up automatically without editing this file. */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "# Keep TX Red — public pages are crawlable; private, operational, checkout, and low-value query states are excluded for every crawler.",
          // Keep one shared group so Googlebot, Googlebot-Image, search crawlers,
          // and AI crawlers inherit the same crawl boundaries. A bot-specific
          // Allow group can otherwise bypass wildcard-group restrictions.
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          "Disallow: /admin",
          "Disallow: /admin/",
          "Disallow: /preview/",
          "Disallow: /draft/",
          "Disallow: /private/",
          "Disallow: /lovable/",
          "Disallow: /email/",
          "Disallow: /hubs",
          "Disallow: /hubs/",
          // Cart / checkout and low-value search/filter/sort URLs should not
          // enter the crawl queue. Pagination is intentionally crawlable so
          // Googlebot can follow bill-directory links beyond the first page.
          "Disallow: /cart",
          "Disallow: /shop/checkout",
          "Disallow: /shop/checkout-return",
          "Disallow: /*?topic=",
          "Disallow: /*?q=",
          "Disallow: /*?query=",
          "Disallow: /*?search=",
          "Disallow: /*?sort=",
          "Disallow: /*?filter=",
          "",
          `Sitemap: ${BASE_URL}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
