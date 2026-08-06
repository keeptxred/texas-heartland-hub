import { createFileRoute } from "@tanstack/react-router";

const DEPLOYMENT_FINGERPRINT = "newsroom-coverage-2026-08-05-v1";

export const Route = createFileRoute("/api/public/deployment-fingerprint")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({
            ok: true,
            fingerprint: DEPLOYMENT_FINGERPRINT,
            newsroomHealthMode: "direct-table-aggregation",
            checkedAt: new Date().toISOString(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, max-age=0",
            },
          },
        ),
    },
  },
});
