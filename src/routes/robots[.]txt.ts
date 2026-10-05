import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/sitemap-shared";

const GOOGLE_SEARCH_AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Storebot-Google",
  "Mediapartners-Google",
  "AdsBot-Google",
] as const;

const SEARCH_DISCOVERY_AGENTS = [
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
] as const;

// Training / extended-use policy is deliberately separate from search access.
// Permissions are unchanged from the prior shared group; future training-policy
// changes therefore cannot accidentally disable OAI-SearchBot or other search bots.
const TRAINING_EXTENDED_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "CCBot",
  "Bytespider",
] as const;

const COMMON_RULES = [
  "Allow: /ads.txt",
  "Allow: /",
  "Allow: /api/public/article-image/",
  "Disallow: /api/",
  "Disallow: /admin",
  "Disallow: /admin/",
  "Disallow: /preview/",
  "Disallow: /draft/",
  "Disallow: /private/",
  "Disallow: /email/",
  "Disallow: /cart",
  "Disallow: /shop/checkout",
  "Disallow: /shop/checkout-return",
  "Disallow: /*?topic=",
  "Disallow: /*?q=",
  "Disallow: /*?query=",
  "Disallow: /*?search=",
  "Disallow: /*?sort=",
  "Disallow: /*?filter=",
] as const;

function group(agents: readonly string[]): string[] {
  return [...agents.map((agent) => `User-agent: ${agent}`), ...COMMON_RULES, ""];
}

/** Public pages are crawlable while operational/private/query-state URLs remain excluded. */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "# Keep TX Red — public indexable content is open to search crawlers; private and low-value states are excluded.",
          "# Search/discovery access and training/extended-use policy are intentionally separate.",
          "",
          ...group(GOOGLE_SEARCH_AGENTS),
          ...group(SEARCH_DISCOVERY_AGENTS),
          ...group(TRAINING_EXTENDED_AGENTS),
          "User-agent: *",
          ...COMMON_RULES,
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
