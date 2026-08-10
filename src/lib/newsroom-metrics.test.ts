import { describe, expect, it } from "vitest";
import { aggregateNewsroomMetrics } from "./newsroom-metrics";

function clusteredRow(id: number, kind: "confirmation" | "follow_up" | null, at: string) {
  return {
    id,
    internal_slug: `story-${id}`,
    cluster_json: {
      clustered_at: at,
      source_count: 3,
      development_kind: kind,
      source_links: [
        { label: "A", url: "https://a.example/story" },
        { label: "B", url: "https://b.example/story" },
        { label: "C", url: "https://c.example/story" },
      ],
    },
    viral_signals: {},
  };
}

describe("newsroom metrics", () => {
  it("deduplicates cluster metadata copied across feed rows", () => {
    const first = clusteredRow(1, null, "2026-08-08T20:00:00Z");
    const second = { ...clusteredRow(2, null, "2026-08-08T20:00:00Z") };
    const metrics = aggregateNewsroomMetrics([first, second]);
    expect(metrics.clusteredRows).toBe(2);
    expect(metrics.uniqueClusters).toBe(1);
    expect(metrics.multiSourceSyntheses).toBe(1);
    expect(metrics.sourceRelationshipsAdded).toBe(2);
    expect(metrics.estimatedRewriteCallsAvoided).toBe(2);
  });

  it("counts confirmations as one avoided rewrite regardless of cluster size", () => {
    const metrics = aggregateNewsroomMetrics([
      clusteredRow(1, "confirmation", "2026-08-08T20:01:00Z"),
    ]);
    expect(metrics.confirmations).toBe(1);
    expect(metrics.estimatedRewriteCallsAvoided).toBe(1);
  });

  it("reports review blocks and auto-publish eligibility from feed state", () => {
    const metrics = aggregateNewsroomMetrics([
      {
        id: 1,
        internal_slug: null,
        cluster_json: null,
        viral_signals: { auto_publish_eligible: true },
      },
      {
        id: 2,
        internal_slug: null,
        cluster_json: null,
        viral_signals: { post_rewrite_review_required: true },
      },
    ]);
    expect(metrics.autoPublishEligibleRows).toBe(1);
    expect(metrics.postRewriteReviewBlocks).toBe(1);
  });
});
