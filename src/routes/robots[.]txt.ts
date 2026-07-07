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
          "# Keep TX Red — allow all public content, block internal system paths.",
          "User-agent: OAI-SearchBot",
          "Allow: /",
          "",
          "User-agent: GPTBot",
          "Allow: /",
          "",
          "User-agent: PerplexityBot",
          "Allow: /",
          "",
          "User-agent: ClaudeBot",
          "Allow: /",
          "",
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