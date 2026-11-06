import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const src = readFileSync("src/lib/newsroom-rss-evidence.server.ts", "utf8");

describe("DPS pre-scoring first-party source evidence", () => {
  it("fetches a bounded set of verified original government articles", () => {
    expect(src).toContain("DPS_PRIMARY_PREFLIGHT_LOOKBACK_HOURS = 72");
    expect(src).toContain("DPS_PRIMARY_PREFLIGHT_FETCH_LIMIT = 2");
    expect(src).toContain('eq("source", "Texas DPS — Direct Press Releases")');
    expect(src).toContain('eq("target_site", "keeptxred")');
    expect(src).toContain('dpsOfficialArticleRelayUrl(row.link)');
    expect(src).toContain("fetchReadableNewsroomSource(row.link!)");
    expect(src).toContain("shouldReplaceExistingEvidence(row.extracted_body, body)");
    expect(src).toContain(".update({ extracted_body: body })");
  });
  it("never changes editorial scoring, article status, or publishing limits", () => {
    const start = src.indexOf("async function prehydrateRecentDpsPrimaryEvidence");
    const end = src.indexOf("export async function refreshNewsroomRssEvidence", start);
    const block = src.slice(start,end);
    expect(block).not.toContain("daily_articles");
    expect(block).not.toContain("news_publish_candidates");
    expect(block).not.toContain("source_count");
    expect(block).not.toContain("is_primary_source");
    expect(block).not.toContain("publishSingleFeedItem");
    expect(block).not.toContain("runCloudflareJson");
    expect(block).toContain('eq("source", "Texas DPS — Direct Press Releases")');
    expect(block).toContain("DPS_PRIMARY_PREFLIGHT_FETCH_LIMIT");
  });
});
