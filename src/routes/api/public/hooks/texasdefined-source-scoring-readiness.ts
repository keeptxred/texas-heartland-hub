import { createFileRoute } from "@tanstack/react-router";

/**
 * Read-only release proof for the TexasDefined source scorer. The GitHub
 * source-only workflow must NOT call the score-viral endpoint before this
 * build is live: an older Worker does not recognize the suppression mode
 * and could accidentally publish KeepTXRed articles.
 *
 * No credentials, DB reads, AI, publishing or approvals on this endpoint.
 */
export const Route = createFileRoute("/api/public/hooks/texasdefined-source-scoring-readiness")({
  server: {
    handlers: {
      GET: () => new Response(JSON.stringify({
        ok: true,
        mode: "td-source-routing",
        version: "20261117-v1",
        publicationSuppressed: true,
      }), {
        status: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      }),
    },
  },
});
