import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");

describe("72-hour publication evidence packet coverage", () => {
  it("refreshes the same 500 ranked 72h pending candidates the publisher scans", () => {
    expect(builder).toContain("const LOOKBACK_HOURS = 72");
    expect(builder).toContain("const CANDIDATE_LIMIT = 500");
    expect(builder).toContain('.eq("status", "PENDING")');
    expect(builder).toContain('.in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])');
    expect(builder).toContain('.gte("created_at", since)');
    expect(builder).toContain('.order("editorial_score", { ascending: false })');
    expect(builder).toContain('.order("created_at", { ascending: false })');
    expect(builder).toContain('.order("id", { ascending: true })');
    expect(generator).toContain("const NEWSROOM_PUBLISH_SCAN_LIMIT = 500");
    expect(generator).toContain("newsroomNewStoryCutoff()");
  });

  it("does not let completed or held stories displace publishable candidates", () => {
    expect(builder).toContain("const pending = (pendingData ?? []) as CandidateRow[]");
    expect(builder).toContain("const published = (publishedData ?? []) as CandidateRow[]");
    expect(builder).toContain("const candidates = [...new Map<string, CandidateRow>(");
    expect(builder).toContain('      .eq("status", "PUBLISHED")');
    expect(builder).not.toContain('.in("status", ["PENDING", "HELD", "SELECTED", "PUBLISHED"])');
  });

  it("still refreshes published articles from later material sources", () => {
    expect(builder).toContain("const PUBLISHED_REFRESH_HOURS = 48");
    expect(builder).toContain("const PUBLISHED_REFRESH_LIMIT = 80");
    expect(builder).toContain('.gte("published_at", new Date(Date.now() - PUBLISHED_REFRESH_HOURS');
  });

  it("limits cluster, feed, and packet reads/writes to bounded requests", () => {
    expect(builder).toContain("const CLUSTER_READ_BATCH_SIZE = 100");
    expect(builder).toContain("const CLUSTER_READ_CONCURRENCY = 2");
    expect(builder).toContain("chunkValues(clusterIds, CLUSTER_READ_BATCH_SIZE)");
    expect(builder).toContain("mapWithConcurrency(clusterBatches, CLUSTER_READ_CONCURRENCY");
    expect(builder).toContain("for (const batch of chunkValues(packetsToWrite, CLUSTER_READ_BATCH_SIZE))");
    expect(builder).toContain("const SOURCE_PAGE_FETCH_LIMIT = 40");
    expect(builder).toContain("const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000");
    expect(builder).toContain("candidate.status === \"PENDING\" ? 1_000 : 0");
    expect(builder).toContain("aiCalls: 0");
  });
});
