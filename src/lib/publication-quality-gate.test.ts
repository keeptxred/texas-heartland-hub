import { describe, expect, it } from "vitest";
import {
  assessPublicationReadiness,
  independentPublisherFamilyCount,
} from "./publication-quality-gate";
import type { ClusterableFeedItem, StoryCluster } from "./story-clustering";

function item(overrides: Partial<ClusterableFeedItem> = {}): ClusterableFeedItem {
  return {
    id: 1,
    title: "Texas officials release statewide election guidance",
    link: "https://example.com/story",
    source: "Example News",
    description: "Texas election officials released guidance for voters and county election administrators ahead of the statewide election.",
    pub_date: "2026-08-16T18:00:00Z",
    extracted_body: "",
    internal_slug: null,
    ...overrides,
  } as ClusterableFeedItem;
}

function cluster(primary: ClusterableFeedItem, overrides: Partial<StoryCluster> = {}): StoryCluster {
  return {
    primary,
    members: [],
    score: 0,
    sourceCount: 1,
    strongMerge: false,
    ...overrides,
  } as StoryCluster;
}

describe("publication quality gate", () => {
  it("holds a secondary single-source rewrite even when it is an authority topic", () => {
    const readiness = assessPublicationReadiness(cluster(item()));
    expect(readiness.publish).toBe(false);
    expect(readiness.mode).toBe("hold_for_corroboration");
    expect(readiness.authorityTopic).toBe(true);
  });

  it("allows independently corroborated multi-source events", () => {
    const primary = item({ link: "https://firstnews.com/story" });
    const readiness = assessPublicationReadiness(cluster(primary, {
      strongMerge: true,
      sourceCount: 2,
      members: [
        {
          ...item({ id: 2, source: "Second News", link: "https://secondnews.com/story" }),
          combinationScore: 91,
          overlapTerms: ["texas", "election", "guidance"],
        },
      ] as StoryCluster["members"],
    }));
    expect(readiness.publish).toBe(true);
    expect(readiness.mode).toBe("multi_source");
    expect(readiness.independentSourceCount).toBe(2);
  });

  it("does not count one publisher's feed and canonical URLs as independent corroboration", () => {
    const primary = item({
      source: "The Texas Tribune",
      link: "https://www.texastribune.org/2026/08/17/texas-city-budgets-cuts-tax-hikes/",
    });
    const samePublisherFeed = {
      ...item({
        id: 2,
        source: "Texas Tribune RSS",
        link: "https://feeds.texastribune.org/link/123/texas-city-budgets-cuts-tax-hikes",
      }),
      combinationScore: 95,
      overlapTerms: ["budget", "cities", "tax"],
    };
    const story = cluster(primary, {
      strongMerge: true,
      sourceCount: 2,
      members: [samePublisherFeed] as StoryCluster["members"],
    });

    expect(independentPublisherFamilyCount(story)).toBe(1);
    const readiness = assessPublicationReadiness(story);
    expect(readiness.publish).toBe(false);
    expect(readiness.mode).toBe("hold_for_corroboration");
    expect(readiness.reason).toContain("same-publisher");
  });

  it("allows a substantive official primary record without manufacturing a second source", () => {
    const primary = item({
      source: "Texas Secretary of State",
      link: "https://www.sos.state.tx.us/elections/laws/advisory2026.shtml",
      extracted_body: Array.from({ length: 95 }, (_, index) => `word${index}`).join(" "),
    });
    const readiness = assessPublicationReadiness(cluster(primary));
    expect(readiness.publish).toBe(true);
    expect(readiness.mode).toBe("primary_record");
    expect(readiness.primaryRecord).toBe(true);
  });

  it("does not treat a thin official item as automatically publication-worthy", () => {
    const primary = item({
      title: "Meeting notice",
      source: "City of Example",
      link: "https://example.gov/meeting",
      description: "Meeting notice.",
      extracted_body: "",
    });
    const readiness = assessPublicationReadiness(cluster(primary));
    expect(readiness.publish).toBe(false);
    expect(readiness.primaryRecord).toBe(true);
  });
});
