import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { newsroomIndependentPublisherFamilyFromUrl, newsroomSourceFamilyFromUrl } from "@/lib/newsroom-publication-preflight";
import { newsroomHydrationPriority } from "@/lib/newsroom-source-page.server";

const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");

describe("zero-AI research source-page prioritization", () => {
  it("prefers publisher-independent or primary-source packets before spending fetch slots", () => {
    expect(builder).toContain("newsroomIndependentPublisherFamilyFromUrl");
    expect(builder).toContain("const families = new Set<string>()");
    expect(builder).toContain("if (family) {");
    expect(builder).toContain("hasPrimary ||= membership.is_primary_source");
    expect(builder).toContain("independentlySourced: hasPrimary || families.size >= 2");
    expect(builder).toContain("newsroomHydrationPriority({");
    expect(builder.indexOf("newsroomHydrationPriority({")).toBeLessThan(
      builder.indexOf(".slice(0, SOURCE_PAGE_FETCH_LIMIT)"),
    );
    const rank = (pending: boolean, independentlySourced: boolean, evidenceChars: number) =>
      newsroomHydrationPriority({ pending, independentlySourced, evidenceChars, requiredEvidenceChars: 5_000, editorialScore: 85 });
    expect(rank(true, true, 4_800)).toBeGreaterThan(rank(true, true, 500));
    expect(rank(true, true, 500)).toBeGreaterThan(rank(true, false, 4_800));
    expect(rank(true, false, 4_800)).toBeGreaterThan(rank(false, true, 4_800));
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

  it("does not promote a Google News discovery pointer to a second publisher", () => {
    expect(newsroomIndependentPublisherFamilyFromUrl("https://news.google.com/rss/articles/ABC")).toBeNull();
    expect(newsroomSourceFamilyFromUrl("https://news.google.com/rss/articles/ABC")).toBe("google.com");
    expect(newsroomIndependentPublisherFamilyFromUrl("https://www.texastribune.org/2026/10/story")).toBe("texastribune.org");
  });

  it("retains cooldown, fixed fetch limits, and source-backed publication gating", () => {
    expect(builder).toContain("const SOURCE_PAGE_FETCH_LIMIT = 40");
    expect(builder).toContain("const SOURCE_PAGE_FETCH_CONCURRENCY = 4".replace("SOURCE_PAGE_FETCH_CONCURRENCY", "SOURCE_PAGE_CONCURRENCY"));
    expect(builder).toContain("const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000");
    expect(builder).toContain("const SOURCE_PAGE_UNREADABLE_RETRY_COOLDOWN_MS = 24 * 60 * 60 * 1000");
    expect(builder).toContain("isNewsroomSourceFetchCoolingDown(");
    expect(builder).toContain(".filter((feed) => !sourcePageCoolingDown(feed.id))");
    expect(builder).toContain('pending: candidate.status === "PENDING"');
    expect(builder).toContain(".slice(0, SOURCE_PAGE_FETCH_LIMIT)");
    expect(builder).toContain("aiCalls: 0");
  });
});
