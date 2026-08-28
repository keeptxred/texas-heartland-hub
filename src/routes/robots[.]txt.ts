import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/sitemap-shared";

const GOOGLE_MERCHANT_AGENTS = ["Googlebot", "Googlebot-Image", "Storebot-Google"] as const;
const AI_DISCOVERY_AGENTS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "CCBot",
  "Bytespider",
] as const;

/** Dynamic robots.txt. This is the single robots policy for Keep TX Red.
 *  Public search, merchant, and AI-discovery crawlers share the same rule
 *  group as the wildcard so explicit allowlisting never bypasses the common
 *  private/operational crawl boundaries. */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "# Keep TX Red — public pages are crawlable; private, operational, checkout, and low-value query states are excluded for every crawler.",
          // Merchant Center explicitly requires Googlebot and Googlebot-Image.
          // Storebot-Google is included for Google Shopping product analysis.
          // AI/search discovery agents are explicitly named so OpenAI,
          // Anthropic/Claude, Perplexity, Gemini/Google, Apple, Amazon,
          // Meta, Common Crawl, and ByteDance controls are unambiguous.
          // Keep all named agents consecutive with `*` so this remains ONE
          // shared rules group instead of allowing a specific bot to bypass
          // the common Disallow rules below.
          ...GOOGLE_MERCHANT_AGENTS.map((agent) => `User-agent: ${agent}`),
          ...AI_DISCOVERY_AGENTS.map((agent) => `User-agent: ${agent}`),
          "User-agent: *",
          "Allow: /",
          "Disallow: /api/",
          "Disallow: /admin",
          "Disallow: /admin/",
          "Disallow: /preview/",
          "Disallow: /draft/",
          "Disallow: /private/",
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
            "Cache-Control": "public, max-age=300, s-maxage=300",
          },
        });
      },
    },
  },
});
