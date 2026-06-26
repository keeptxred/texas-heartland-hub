import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/data/articles";

const BASE_URL = "https://keeptxred.com";
const ROUTES = [
  "/",
  "/news",
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
  "/glossary",
] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticUrls = ROUTES.map(
          (p) =>
            `  <url><loc>${BASE_URL}${p}</loc><changefreq>${p === "/" ? "daily" : "weekly"}</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`
        );
        const articleUrls = ARTICLES.map(
          (a) =>
            `  <url><loc>${BASE_URL}/news/${a.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
        );
        const urls = [...staticUrls, ...articleUrls].join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});