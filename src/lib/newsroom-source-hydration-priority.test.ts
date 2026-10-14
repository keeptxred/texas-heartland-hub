import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { newsroomSourceFamilyFromUrl } from "@/lib/newsroom-publication-preflight";

const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");

describe("zero-AI research source-page prioritization", () => {
  it("prefers publisher-independent or primary-source packets before spending fetch slots", () => {
    expect(builder).toContain("newsroomSourceFamilyFromUrl");
    expect(builder).toContain("const provenanceByCluster = new Map");
    expect(builder).toContain("state.hasPrimary ||= membership.is_primary_source");
    expect(builder).toContain("state.families.size >= 2");
    expect(builder).toContain("publishableProvenance.has(membership.cluster_id) ? 10_000 : 0");
    expect(builder.indexOf("publishableProvenance.has(membership.cluster_id)")).toBeLessThan(
      builder.indexOf(".slice(0, SOURCE_PAGE_FETCH_LIMIT)"),
    );
  });

  it("does not count two syndicated hostnames as independent publisher families", () => {
    const family = new Set([
      newsroomSourceFamilyFromUrl("https://www.texastribune.org/2026/10/news/"),
      newsroomSourceFamilyFromUrl("https://feeds.texastribune.org/link/story"),
    ]);
    expect(family.size).toBe(1);
    family.add(newsroomSourceFamilyFromUrl("https://texasstandard.org/story"));
    expect(family.size).toBe(2);
  });

  it("retains cooldown, fixed fetch limits, and source-backed publication gating", () => {
    expect(builder).toContain("const SOURCE_PAGE_FETCH_LIMIT = 40");
    expect(builder).toContain("const SOURCE_PAGE_FETCH_CONCURRENCY = 4".replace("SOURCE_PAGE_FETCH_CONCURRENCY", "SOURCE_PAGE_CONCURRENCY"));
    expect(builder).toContain("const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000");
    expect(builder).toContain('candidate.status === "PENDING" ? 1_000 : 0');
    expect(builder).toContain("aiCalls: 0");
  });
});
