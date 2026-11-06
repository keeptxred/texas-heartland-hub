import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { reserveDirectPublisherCohort } from "./newsroom-clustering";
import { isPrimaryNewsSource } from "./newsroom-editorial-scoring";

const source = readFileSync("src/routes/api/public/hooks/cluster-newsroom-stories.ts", "utf8");

describe("bounded verified primary newsroom retrieval", () => {
  it("reserves official originals inside the existing 500-row CPU budget", () => {
    const newest = Array.from({ length: 500 }, (_, i) => ({ feed_item_id: i + 1 }));
    const originals = [{ feed_item_id: 6816316 }, { feed_item_id: 6816322 }];
    const chosen = reserveDirectPublisherCohort(newest, originals, 500);
    expect(chosen).toHaveLength(500);
    expect(chosen.slice(0, 2)).toEqual(originals);
    expect(new Set(chosen.map((row) => row.feed_item_id)).size).toBe(500);
  });

  it("recognizes original government URLs but excludes Google News wrappers", () => {
    expect(isPrimaryNewsSource("Texas DPS — Direct Press Releases", "https://www.dps.texas.gov/news/agency-release")).toBe(true);
    expect(isPrimaryNewsSource("Texas Register", "https://www.sos.state.tx.us/texreg/texreg.xml")).toBe(true);
    expect(isPrimaryNewsSource("Texas Courts (.gov)", "https://news.google.com/rss/articles/redirect-wrapper")).toBe(false);
    expect(source).toContain("KTR_VERIFIED_FIRSTPARTY_COHORT_LIMIT = 32");
    expect(source).toContain("KTR_FIRSTPARTY_LOOKUP_LIMIT = 48");
    expect(source).toContain("verifiedPrimaryCohortIncluded");
    expect(source).toContain("isPrimaryNewsSource(row.source, row.link)");
    expect(source).toContain('.is("duplicate_of_feed_item_id", null)');
    expect(source).toContain("CLUSTER_LIMIT = 500");
    expect(source).not.toContain("CLUSTER_LIMIT = 550");
  });

  it("does not bypass primary-source counting or publication safety", () => {
    expect(source).toContain("countDistinctPrimaryNewsSources(members)");
    expect(source).toContain("countDistinctNewsSources(members)");
    expect(source).toContain("clusterNewsFeedItems(clusterable)");
    expect(source).not.toContain("publishSingleFeedItem");
    expect(source).not.toContain("is_primary_source: true,");
  });
});
