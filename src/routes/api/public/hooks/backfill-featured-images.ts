import { createFileRoute } from "@tanstack/react-router";
import { backfillBatch } from "@/lib/featured-image.functions";

// Batch endpoint: generate featured images for articles missing one.
// Call repeatedly (cron or manual) with ?limit=5 (default 5, max 20)
// to work through the backlog without exhausting credits in one hit.
export const Route = createFileRoute("/api/public/hooks/backfill-featured-images")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const raw = Number(url.searchParams.get("limit") ?? "5");
        const limit = Math.max(1, Math.min(20, Number.isFinite(raw) ? raw : 5));
        const overwrite = url.searchParams.get("overwrite") === "1";
        const result = await backfillBatch(limit, overwrite);
        return Response.json(result);
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const raw = Number(url.searchParams.get("limit") ?? "5");
        const limit = Math.max(1, Math.min(20, Number.isFinite(raw) ? raw : 5));
        const overwrite = url.searchParams.get("overwrite") === "1";
        const result = await backfillBatch(limit, overwrite);
        return Response.json(result);
      },
    },
  },
});