import { createFileRoute } from "@tanstack/react-router";

/**
 * Legacy single-source RSS writer retired for publication quality.
 *
 * This endpoint intentionally remains addressable so old manual callers do not
 * fail noisily, but it can no longer spend AI quota or write daily_articles.
 * Production publication must use the clustered newsroom / multi-source path,
 * which enforces independent corroboration or a substantive primary record.
 */
export const LEGACY_GENERATE_NEWS_DISABLED = true;
export const LEGACY_GENERATE_NEWS_REASON =
  "legacy_single_source_writer_retired_use_clustered_newsroom";

function disabledResponse() {
  return Response.json(
    {
      ok: true,
      no_items: true,
      disabled: true,
      reason: LEGACY_GENERATE_NEWS_REASON,
      replacement: "/api/public/hooks/generate-newsroom?mode=publish",
      aiCalls: 0,
      inserted: 0,
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

export const Route = createFileRoute("/api/public/hooks/generate-news")({
  server: {
    handlers: {
      GET: async () => disabledResponse(),
      POST: async () => disabledResponse(),
    },
  },
});
