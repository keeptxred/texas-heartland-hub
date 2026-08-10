import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy candidate-guide landing page.
 *
 * Candidate data now lives in the verified Election Central experience. Keep
 * this route only as a permanent redirect so old links and Search Console URLs
 * consolidate onto the current canonical election hub instead of exposing a
 * stale noindex page with hard-coded race data.
 */
export const Route = createFileRoute("/candidate-guides")({
  beforeLoad: () => {
    throw redirect({ href: "/elections/2026", statusCode: 301 });
  },
});
