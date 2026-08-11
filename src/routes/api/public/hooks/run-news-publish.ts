import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduler-compatible GET bridge for the existing production news publisher.
 *
 * ChatGPT scheduled tasks can reliably perform a normal GET, while the
 * established generate-news endpoint is intentionally implemented as POST.
 * This bridge keeps all publication work inside the production app where the
 * Supabase and Cloudflare Workers AI credentials already live, rather than
 * requiring the scheduler itself to possess database or image-provider
 * credentials.
 */
export const Route = createFileRoute("/api/public/hooks/run-news-publish")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const incoming = new URL(request.url);
        const target = new URL("/api/public/hooks/generate-news", incoming.origin);

        const response = await fetch(target, {
          method: "POST",
          headers: {
            "User-Agent": "KeepTXRed-ScheduledPublisher/1.0",
            Accept: "application/json",
          },
        });

        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers: {
            "Content-Type": response.headers.get("Content-Type") ?? "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});