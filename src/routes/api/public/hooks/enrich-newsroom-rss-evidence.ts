import { createFileRoute } from "@tanstack/react-router";
import { refreshNewsroomRssEvidence } from "@/lib/newsroom-rss-evidence.server";

async function handler() {
  try {
    const result = await refreshNewsroomRssEvidence();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      aiCalls: 0,
    }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/hooks/enrich-newsroom-rss-evidence")({
  server: { handlers: { GET: handler, POST: handler } },
});
