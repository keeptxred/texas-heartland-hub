import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { clusterNewsFeedItems, deterministicStorySimilarity, guardedCountyClerkVotingAdsLawsuitKey, reserveDirectPublisherCohort } from "./newsroom-clustering";

const observedAt = "2026-08-15T12:00:00Z";

describe("direct-source reservation within existing clustering budget", () => {
  it("keeps all selected direct publisher records plus remaining newest wrappers without increasing work", () => {
    const newest = [
      { feed_item_id: 1, label: "recent Google wrapper 1" },
      { feed_item_id: 2, label: "recent Google wrapper 2" },
      { feed_item_id: 3, label: "recent direct report" },
      { feed_item_id: 4, label: "another Google wrapper" },
    ];
    const direct = [
      { feed_item_id: 3, label: "recent direct report" },
      { feed_item_id: 5, label: "older official direct report" },
    ];
    expect(reserveDirectPublisherCohort(newest, direct, 4).map(row => row.feed_item_id)).toEqual([3, 5, 1, 2]);
    expect(reserveDirectPublisherCohort(newest, direct, 6).map(row => row.feed_item_id)).toEqual([3, 5, 1, 2, 4]);
    expect(reserveDirectPublisherCohort(newest, direct, 0)).toEqual([]);
  });

  it("prioritizes local original publisher records without changing cluster size or independence", () => {
    const ktrDirect = [{ feed_item_id: 71 }, { feed_item_id: 72 }];
    const globalDirect = [{ feed_item_id: 72 }, { feed_item_id: 73 }];
    const newest = [{ feed_item_id: 75 }, { feed_item_id: 76 }];
    const preferred = reserveDirectPublisherCohort(reserveDirectPublisherCohort(newest, globalDirect, 4), ktrDirect, 4);
    expect(preferred.map((row) => row.feed_item_id)).toEqual([71, 72, 73, 75]);
    expect(preferred).toHaveLength(4);
  });

  it("still uses the 500-row, bounded 72h discovery horizon and requires actual direct URLs", () => {
    const builder = readFileSync("src/routes/api/public/hooks/cluster-newsroom-stories.ts", "utf8");
    expect(builder).toContain("const LOOKBACK_HOURS = 72");
    expect(builder).toContain("const CLUSTER_LIMIT = 500");
    expect(builder).toContain("const DIRECT_PUBLISHER_COHORT_LIMIT = 320");
    expect(builder).toContain("const KTR_DIRECT_PUBLISHER_COHORT_LIMIT = 240");
    expect(builder).toContain("const KTR_DIRECT_NORMALIZATION_BATCH_SIZE = 80");
    expect(builder).toContain('.eq("target_site", "keeptxred")');
    expect(builder).toContain('.not("link", "ilike", "https://news.google.com/%")');
    expect(builder).toContain('.is("duplicate_of_feed_item_id", null)');
    expect(builder).toContain("    ktrDirectNormalized,\n    CLUSTER_LIMIT,");
    expect(builder).toContain('.not("canonical_url", "ilike", "https://news.google.com/%")');
    expect(builder).toContain("reserveDirectPublisherCohort(");
    expect(builder).toContain("CLUSTER_LIMIT,");
    expect(builder).toContain("isPrimaryNewsSource(feed?.source, feed?.link)");
    expect(builder).toContain("countDistinctNewsSources(members)");
  });
});

describe("same named voter-ad lawsuit across independently authored reporting", () => {
  const time = "2026-10-29T20:00:00Z";
  const official = {
    feedItemId: 6649862,
    normalizedTitle: "the office attorney general sues harris county clerk running racially discriminatory voter suppression scheme that could harm integrity texas elections",
    sourceKey: "texas-attorney-general-direct-news-releases",
    observedAt: "2026-10-29T12:00:00Z",
    pillarSlug: "texas-elections",
  };
  const hpm = {
    feedItemId: 6650833,
    normalizedTitle: "texas ag s office sues harris county clerk allegedly running racially discriminatory advertisements",
    sourceKey: "houston-public-media",
    observedAt: "2026-10-29T19:43:15Z",
    pillarSlug: "texas-laws-legislature",
  };
  const kprc = {
    feedItemId: 6650345,
    normalizedTitle: "texas ag s office sues harris county clerk over accusations selectively targeting demographics voting ads",
    sourceKey: "kprc-2-click2houston",
    observedAt: "2026-10-29T19:20:25Z",
    pillarSlug: "texas-elections",
  };
  it("identifies the same particular lawsuit, not publisher identity", () => {
    const key = guardedCountyClerkVotingAdsLawsuitKey(official.normalizedTitle);
    expect(key).toBe("attorney-general-sues-harris-county-clerk-discriminatory-voter-ads");
    expect(guardedCountyClerkVotingAdsLawsuitKey(hpm.normalizedTitle)).toBe(key);
    expect(guardedCountyClerkVotingAdsLawsuitKey(kprc.normalizedTitle)).toBe(key);
    expect(deterministicStorySimilarity(official, hpm)).toBe(0.8);
    expect(deterministicStorySimilarity(official, kprc)).toBe(0.8);
    const clusters = clusterNewsFeedItems([official, hpm, kprc]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].memberFeedItemIds).toEqual([6649862, 6650345, 6650833]);
  });
  it("does not equate different counties, actors, dates, or a voting theme with the same filing", () => {
    const otherCounty = { ...kprc, feedItemId: 9, normalizedTitle: kprc.normalizedTitle.replace("harris county", "dallas county") };
    const oppositeLawsuit = { ...kprc, feedItemId: 10,
      normalizedTitle: "harris county clerk sues attorney general for racially discriminatory voting ads" };
    const noDiscrimination = { ...kprc, feedItemId: 11,
      normalizedTitle: "texas ag s office sues harris county clerk over late public records disclosure" };
    const otherIssue = { ...kprc, feedItemId: 12,
      normalizedTitle: "texas ag s office sues harris county clerk about a racially discriminatory hiring policy" };
    const stale = { ...kprc, feedItemId: 13, observedAt: "2026-10-26T00:00:00Z" };
    for (const unrelated of [otherCounty, oppositeLawsuit, noDiscrimination, otherIssue, stale]) {
      expect(deterministicStorySimilarity(official, unrelated), unrelated.normalizedTitle).toBe(0);
      expect(clusterNewsFeedItems([official, unrelated]), unrelated.normalizedTitle).toHaveLength(2);
    }
    expect(guardedCountyClerkVotingAdsLawsuitKey("texas ag office sues local agency over voting ads")).toBeNull();
    expect(guardedCountyClerkVotingAdsLawsuitKey("harris county election officials review voter advertising")).toBeNull();
  });
  it("does not infer the missing named county clerk from a different Tribune headline", () => {
    const independentlyAuthored = {
      feedItemId: 6653302,
      normalizedTitle: "texas ag s office labels get out vote ads discriminatory focus black latino asian voters",
      sourceKey: "the-texas-tribune-politics",
      observedAt: time,
      pillarSlug: "texas-elections",
    };
    expect(guardedCountyClerkVotingAdsLawsuitKey(independentlyAuthored.normalizedTitle)).toBeNull();
    expect(deterministicStorySimilarity(official, independentlyAuthored)).toBe(0);
  });
});

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

  it("reunites the exact governor announcement even if an agency and a newsroom use different categories", () => {
    const announcement = "governor abbott announces 40 million strengthen texas teacher workforce";
    const a = { feedItemId: 71, normalizedTitle: announcement, sourceKey: "gov.texas.gov", observedAt, pillarSlug: "texas-energy-oil" };
    const b = { feedItemId: 72, normalizedTitle: announcement, sourceKey: "independent-publisher", observedAt, pillarSlug: "texas-economy-small-business" };
    expect(deterministicStorySimilarity(a, b)).toBe(1);
    const clusters = clusterNewsFeedItems([a, b]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].memberFeedItemIds).toEqual([71, 72]);
  });

  it("never uses cross-pillar fuzzy matching to conflate related-but-distinct facts", () => {
    const a = { feedItemId: 81, normalizedTitle: "governor abbott announces 40 million strengthen texas teacher workforce", sourceKey: "gov", observedAt, pillarSlug: "texas-politics-government" };
    const b = { feedItemId: 82, normalizedTitle: "governor abbott announces 20 million strengthen texas teacher workforce", sourceKey: "news", observedAt, pillarSlug: "texas-economy-small-business" };
    expect(deterministicStorySimilarity(a, b)).toBe(0);
    expect(clusterNewsFeedItems([a, b])).toHaveLength(2);
  });

  it("keeps exact but short recurring cross-pillar stories separate", () => {
    const a = { feedItemId: 91, normalizedTitle: "governor abbott announces latest slate appointments", sourceKey: "gov", observedAt, pillarSlug: "texas-politics-government" };
    const b = { feedItemId: 92, normalizedTitle: "governor abbott announces latest slate appointments", sourceKey: "news", observedAt, pillarSlug: "texas-elections" };
    expect(deterministicStorySimilarity(a, b)).toBe(0);
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
