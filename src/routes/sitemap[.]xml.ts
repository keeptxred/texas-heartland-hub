import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES, isPublished } from "@/data/articles";
import { listEvergreenSlugs } from "@/lib/evergreen.functions";

const BASE_URL = "https://www.keeptxred.com";
const ROUTES = [
  "/",
  "/news",
  "/news/non-political",
  "/happening-now",
  "/keep-texas-red",
  "/texas-news",
  "/houston",
  "/texas-sports",
  "/texas-sports/nfl",
  "/texas-sports/mlb",
  "/texas-sports/nba",
  "/texas-business",
  "/elections",
  "/tax-calculator",
  "/about",
  "/representatives",
  "/find-representative",
  "/register-to-vote",
  "/contact-legislators",
  "/get-involved",
  "/county-elections",
  "/candidate-guides",
  "/voting-locations",
  "/laws",
  "/texas-laws",
  "/laws-to-know",
  "/legislative-updates",
  "/contact",
  "/privacy",
  "/terms",
  "/glossary",
  "/editorial-standards",
  "/texas-politics",
  "/texas-economy",
  "/texas-law-policy",
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticUrls = ROUTES.map(
          (p) =>
            `  <url><loc>${BASE_URL}${p}</loc><changefreq>${p === "/" ? "daily" : "weekly"}</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`
        );
        const articleUrls = ARTICLES.filter((a) => isPublished(a)).map(
          (a) =>
            `  <url><loc>${BASE_URL}/news/${a.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
        );
        let evergreenUrls: string[] = [];
        try {
          const { slugs } = await listEvergreenSlugs();
          evergreenUrls = slugs.map(
            (s) => `  <url><loc>${BASE_URL}/news/${s.slug}</loc><lastmod>${s.published_at.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
          );
        } catch (e) {
          console.error("sitemap evergreen fetch failed", e);
        }
        const authorSlugs = Array.from(
          new Set(ARTICLES.filter((a) => isPublished(a)).map((a) => a.author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")))
        );
        const authorUrls = authorSlugs.map(
          (s) => `  <url><loc>${BASE_URL}/authors/${s}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>`
        );
        const urls = [...staticUrls, ...articleUrls, ...evergreenUrls, ...authorUrls].join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});