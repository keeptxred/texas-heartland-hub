import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_INTERNAL_ORIGIN = "https://keeptxred.lovable.app";

function resolveInternalOrigin(requestUrl: string): string {
  const incoming = new URL(requestUrl);
  const configured = process.env.INTERNAL_APP_ORIGIN?.trim();
  if (configured) return configured.replace(/\/$/, "");

  // Server-to-server publication must not loop back through the public custom
  // domain. That path can traverse an external CDN/proxy and has produced
  // Cloudflare 1016/524 failures even while the Lovable production origin is
  // healthy. Requests already arriving on lovable.app can safely reuse their
  // own origin; branded/custom-domain requests use the stable Lovable origin.
  if (incoming.hostname.endsWith("lovable.app")) return incoming.origin;
  return DEFAULT_INTERNAL_ORIGIN;
}

export const Route = createFileRoute("/api/public/hooks/run-generate-news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = resolveInternalOrigin(request.url);
        const response = await fetch(`${origin}/api/public/hooks/generate-news`, {
          method: "POST",
          headers: { accept: "application/json" },
        });
        const text = await response.text();
        return new Response(text, {
          status: response.status,
          headers: {
            "content-type": response.headers.get("content-type") ?? "application/json",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
