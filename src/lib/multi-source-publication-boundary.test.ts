import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./multi-source-publish.ts", import.meta.url), "utf8");

describe("core newsroom publication boundary", () => {
  it("loads target_site for the primary feed item and rejects non-KTR routes", () => {
    expect(source).toContain('select("id,title,link,source,description,pub_date,internal_slug,extracted_body,target_site")');
    expect(source).toContain('primary.target_site !== "keeptxred"');
    expect(source).toContain('Publication held: feed item is routed to ${primary.target_site}, not KeepTXRed.');
  });

  it("excludes non-KTR feed rows from multi-source clustering", () => {
    expect(source).toContain("const recentKeepTxRed = (recent ?? []).filter(");
    expect(source).toContain('!row.target_site || row.target_site === "keeptxred"');
    expect(source).toContain("buildStoryCluster(primary, recentKeepTxRed as ClusterableFeedItem[]");
  });

  it("injects verified primary-record evidence into single-source rewrites without replacing the stored extraction", () => {
    expect(source).toContain("publishSingleSourceWithPrimaryRecord");
    expect(source).toContain("PRIMARY-RECORD-AUGMENTED SOURCE PACKET.");
    expect(source).toContain("use the official record and do not repeat the conflicting date as fact");
    expect(source).toContain("await publishLegacySingleFeedItem(feedItemId)");
    expect(source).toContain("original source extraction restore failed");
    expect(source).toContain("updateArticleAttribution(db, singleResult.slug, cluster, factVerification)");
  });

  it("paginates the full corroboration lookback instead of truncating the newest rows", () => {
    expect(source).toContain("const CLUSTER_CANDIDATE_PAGE_SIZE = 500");
    expect(source).toContain("loadRecentClusterCandidates(db, feedItemId, since)");
    expect(source).toContain(".range(from, from + CLUSTER_CANDIDATE_PAGE_SIZE - 1)");
    expect(source).toContain("page.length < CLUSTER_CANDIDATE_PAGE_SIZE");
    expect(source).not.toContain(".limit(140)");
    expect(source).toContain("Could not scan the full ${CLUSTER_LOOKBACK_HOURS}-hour corroboration window");
  });
});
