import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./multi-source-publish.ts", import.meta.url), "utf8");
const candidateLoader = source.slice(
  source.indexOf("async function loadRecentClusterCandidates"),
  source.indexOf("async function fetchReadableText"),
);

describe("core newsroom publication boundary", () => {
  it("loads target_site for the primary feed item and rejects non-KTR routes", () => {
    expect(source).toContain('select("id,title,link,source,description,pub_date,internal_slug,extracted_body,target_site")');
    expect(source).toContain('primary.target_site !== "keeptxred"');
    expect(source).toContain('Publication held: feed item is routed to ${primary.target_site}, not KeepTXRed.');
  });

  it("filters non-KTR rows inside the corroboration query and keeps payloads lightweight", () => {
    expect(candidateLoader).toContain('.select("id,title,link,source,description,pub_date,internal_slug")');
    expect(candidateLoader).toContain('.or("target_site.is.null,target_site.eq.keeptxred")');
    expect(candidateLoader).not.toContain("extracted_body");
    expect(source).toContain("buildStoryCluster(primary, recent ?? [], MAX_CLUSTER_SOURCES)");
  });

  it("injects verified primary-record evidence into single-source rewrites without replacing the stored extraction", () => {
    expect(source).toContain("publishSingleSourceWithPrimaryRecord");
    expect(source).toContain("PRIMARY-RECORD-AUGMENTED SOURCE PACKET.");
    expect(source).toContain("use the official record and do not repeat the conflicting date as fact");
    expect(source).toContain("await publishLegacySingleFeedItem(feedItemId)");
    expect(source).toContain("original source extraction restore failed");
    expect(source).toContain("updateArticleAttribution(db, singleResult.slug, cluster, factVerification)");
  });

  it("loads full bodies only after a candidate is selected into the bounded cluster", () => {
    expect(source).toContain("enrichClusterBodies(cluster, db)");
    expect(source).toContain("fetchReadableText(row.link)");
    expect(source).toContain('update({ extracted_body: body }).eq("id", row.id)');
  });

  it("paginates the full corroboration lookback instead of truncating the newest rows", () => {
    expect(source).toContain("const CLUSTER_CANDIDATE_PAGE_SIZE = 500");
    expect(source).toContain("corroborationAnchorMs");
    expect(source).toContain("corroborationAnchorMs - corroborationWindowMs");
    expect(source).toContain("corroborationAnchorMs + corroborationWindowMs");
    expect(source).toContain("loadRecentClusterCandidates(");
    expect(candidateLoader).toContain('.gte("pub_date", since)');
    expect(candidateLoader).toContain('.lte("pub_date", until)');
    expect(source).toContain(".range(from, from + CLUSTER_CANDIDATE_PAGE_SIZE - 1)");
    expect(source).toContain("page.length < CLUSTER_CANDIDATE_PAGE_SIZE");
    expect(source).not.toContain(".limit(140)");
    expect(source).toContain("Could not scan the full ${CLUSTER_LOOKBACK_HOURS}-hour corroboration window");
  });
});
