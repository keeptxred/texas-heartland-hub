import { createFileRoute } from "@tanstack/react-router";

const body = {
  ok: false,
  retired: true,
  error: "This legacy Aug. 10 Flyover remediation hook is retired.",
  replacement: "/api/public/flyover-aug10-health",
  reason: "The durable keyed reconciliation ledger is authoritative; this endpoint no longer performs discovery, ingestion, scoring, or publication.",
};

function retiredResponse() {
  return new Response(JSON.stringify(body), {
    status: 410,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/public/hooks/remediate-aug10-flyover")({
  server: {
    handlers: {
      GET: retiredResponse,
      POST: retiredResponse,
    },
  },
});
