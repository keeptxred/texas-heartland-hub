import { createFileRoute } from "@tanstack/react-router";
import {
  LEGACY_GENERATE_NEWS_DISABLED,
  LEGACY_GENERATE_NEWS_REASON,
} from "./generate-news";

/**
 * Compatibility alias for the retired legacy writer.
 *
 * Historically this route proxied GET requests into the single-source RSS
 * publisher. It now reports the retirement state without making a publication
 * request, so old bookmarks or manual probes cannot bypass the newsroom gate.
 */
export const Route = createFileRoute("/api/public/hooks/run-generate-news")({
  server: {
    handlers: {
      GET: async () => Response.json(
        {
          ok: true,
          no_items: true,
          disabled: LEGACY_GENERATE_NEWS_DISABLED,
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
      ),
    },
  },
});
