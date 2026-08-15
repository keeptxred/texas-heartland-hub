import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_INTERNAL_ORIGIN = "https://keeptxred-site.freddy-coppola.workers.dev";

function safeConfiguredOrigin(value: string | undefined): string | null {
  const configured = value?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:") return null;
    if (url.hostname === "lovable.app" || url.hostname.endsWith(".lovable.app")) {
      console.warn("Ignoring retired Lovable INTERNAL_APP_ORIGIN", { hostname: url.hostname });
      return null;
    }
    return url.origin;
  } catch {
    console.warn("Ignoring invalid INTERNAL_APP_ORIGIN");
    return null;
  }
}

function resolveInternalOrigin(requestUrl: string): string {
  const configured = safeConfiguredOrigin(process.env.INTERNAL_APP_ORIGIN);
  if (configured) return configured;

  const incoming = new URL(requestUrl);
  if (incoming.hostname.endsWith(".workers.dev")) return incoming.origin;

  // Keep server-to-server publication on the Worker origin so it does not
  // depend on a retired hosting provider or loop through the branded domain.
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
