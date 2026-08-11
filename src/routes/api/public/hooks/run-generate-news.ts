import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hooks/run-generate-news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
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
