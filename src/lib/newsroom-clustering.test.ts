import { describe, expect, it } from "vitest";
import { clusterNewsFeedItems, deterministicStorySimilarity } from "./newsroom-clustering";

const observedAt = "2026-08-15T12:00:00Z";

describe("newsroom deterministic story clustering", () => {
  it("groups independent outlets covering the same event", () => {
    const clusters = clusterNewsFeedItems([
      { feedItemId: 1, normalizedTitle: "spurs arena funding vote heads san antonio ballot", sourceKey: "outlet-a", observedAt },
      { feedItemId: 2, normalizedTitle: "san antonio spurs arena funding heads ballot vote", sourceKey: "outlet-b", observedAt },
    ]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].memberFeedItemIds).toEqual([1, 2]);
  });

  it("does not merge unrelated stories that merely share Texas", () => {
    const score = deterministicStorySimilarity(
      { feedItemId: 1, normalizedTitle: "texas drought plan expands water grants panhandle", sourceKey: "a", observedAt },
      { feedItemId: 2, normalizedTitle: "texas rangers win extra innings houston", sourceKey: "b", observedAt },
    );
    expect(score).toBe(0);
  });

  it("does not merge explicitly different pillars", () => {
    const score = deterministicStorySimilarity(
      { feedItemId: 1, normalizedTitle: "stadium funding ballot vote san antonio spurs", sourceKey: "a", observedAt, pillarSlug: "elections" },
      { feedItemId: 2, normalizedTitle: "stadium funding ballot vote san antonio spurs", sourceKey: "b", observedAt, pillarSlug: "sports" },
    );
    expect(score).toBe(0);
  });

  it("keeps reports beyond the 36-hour event window separate", () => {
    const score = deterministicStorySimilarity(
      { feedItemId: 1, normalizedTitle: "agency releases wildfire recovery grants west texas", sourceKey: "a", observedAt: "2026-08-13T00:00:00Z" },
      { feedItemId: 2, normalizedTitle: "agency releases wildfire recovery grants west texas", sourceKey: "b", observedAt: "2026-08-15T12:00:00Z" },
    );
    expect(score).toBe(0);
  });

  it("creates stable singleton clusters without inventing corroboration", () => {
    const clusters = clusterNewsFeedItems([
      { feedItemId: 7, normalizedTitle: "ercot releases august grid reliability outlook", sourceKey: "ercot", observedAt },
    ]);
    expect(clusters).toEqual([{
      anchorFeedItemId: 7,
      memberFeedItemIds: [7],
      canonicalSubject: "ercot releases august grid reliability outlook",
      confidence: 1,
    }]);
  });
});
