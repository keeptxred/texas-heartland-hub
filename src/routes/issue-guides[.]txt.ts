import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { issueGuides } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { BASE_URL } from "@/lib/sitemap-shared";

const INDEXABLE_ISSUE_GUIDES = issueGuides.filter(isIssueGuideIndexable);

function renderIssueGuideManifest() {
  return [
    "# Keep TX Red Texas Issue Guides",
    "",
    `Canonical hub: ${BASE_URL}/issues`,
    `Policy tracker library: ${BASE_URL}/policy`,
    `Policy tools: ${BASE_URL}/tools`,
    `Civic tools: ${BASE_URL}/civic-tools`,
    "",
    "Keep TX Red issue guides are broad evergreen, source-first explanations of durable Texas policy frameworks. They are distinct from narrower current-status policy trackers, transparent calculators, live news coverage, and explicitly labeled editorial positions in The Texas Case.",
    "",
    `## Current issue guides (${INDEXABLE_ISSUE_GUIDES.length})`,
    "",
    ...INDEXABLE_ISSUE_GUIDES.map((guide) => `- ${BASE_URL}/issues/${guide.slug} — ${guide.title} — ${guide.category}`),
    "",
    "## Authority layers",
    "",
    `Evergreen issue context: ${BASE_URL}/issues`,
    `Current-status policy trackers: ${BASE_URL}/policy`,
    `Transparent policy arithmetic: ${BASE_URL}/tools`,
    `Primary-source navigation: ${BASE_URL}/civic-tools`,
    `Live reporting: ${BASE_URL}/news`,
    `Editorial positions: ${BASE_URL}/texas-case`,
    "",
    "## Source standard",
    "",
    "Issue guides prioritize enacted statutes, official agency material, constitutional text, enrolled bills, and other primary government records. When a current-status question changes faster than an evergreen guide should, use the related policy tracker or official source rather than treating the guide as a live status feed.",
    "",
  ].join("\n");
}

export const Route = createFileRoute("/issue-guides.txt")({
  server: {
    handlers: {
      GET: async () => new Response(renderIssueGuideManifest(), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      }),
    },
  },
});
