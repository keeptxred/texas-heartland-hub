import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";
import { BASE_URL } from "@/lib/sitemap-shared";

const INDEXABLE_POLICY_TRACKERS = ALL_POLICY_TRACKERS.filter(isPolicyTrackerIndexable);

function renderPolicyTrackerManifest() {
  return [
    "# Keep TX Red Policy Trackers",
    "",
    `Canonical hub: ${BASE_URL}/policy`,
    `Freshness queue: ${BASE_URL}/api/reference-freshness`,
    "",
    "Keep TX Red policy trackers are permanent factual and institutional pages underneath daily news and separate from KTR's explicitly labeled editorial positions in The Texas Case. Each tracker identifies controlling law or authority, current status, official sources, relevant KTR reference pages, and changes readers should watch.",
    "",
    `## Current trackers (${INDEXABLE_POLICY_TRACKERS.length})`,
    "",
    ...INDEXABLE_POLICY_TRACKERS.map((tracker) => `- ${BASE_URL}/policy/${tracker.slug} — ${tracker.title} — reviewed ${tracker.updated}`),
    "",
    "## Editorial / factual separation",
    "",
    `Editorial argument: ${BASE_URL}/texas-case`,
    `Factual companion library: ${BASE_URL}/texas-case/facts`,
    `Political search-intent reference: ${BASE_URL}/texas-political-reference`,
    `Government reference: ${BASE_URL}/texas-government`,
    `Legislature: ${BASE_URL}/texas-legislature`,
    `Bills: ${BASE_URL}/bills`,
    `Laws: ${BASE_URL}/laws`,
    `Representatives: ${BASE_URL}/representatives`,
    "",
    "## Source standard",
    "",
    "Primary government records control factual claims when they conflict with summaries or campaign material. A tracker review date is not a guarantee that a time-sensitive fact remains unchanged after that date. Policy trackers use a 30-day normal review window; political-reference pages use shorter windows for races, redistricting, PACs, fundraising, and events. The machine-readable freshness endpoint identifies pages due for source review without auto-inventing replacements.",
    "",
  ].join("\n");
}

export const Route = createFileRoute("/policy-trackers.txt")({
  server: {
    handlers: {
      GET: async () => new Response(renderPolicyTrackerManifest(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      }),
    },
  },
});
