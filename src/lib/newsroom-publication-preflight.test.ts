import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  newsroomHasPublisherDiversity,
  newsroomIndependentPublisherFamilyFromUrl,
  newsroomLeadSourceUrl,
  newsroomSourceFamilyFromUrl,
  uniquePacketSources,
} from "@/lib/newsroom-publication-preflight";
import type { ResearchPacketSource } from "@/lib/newsroom-research-packet";

function source(url: string, isPrimarySource = false, sourceReputationScore = 80): ResearchPacketSource {
  return {
    feedItemId: 1,
    title: "A verified Texas event",
    source: "Publisher",
    url,
    publishedAt: "2026-10-14T12:00:00Z",
    description: "",
    extractedBody: "A real source text.",
    isPrimarySource,
    sourceReputationScore,
  };
}

describe("newsroom publication preflight", () => {
  it("uses the same publisher families as the Postgres diversity guard", () => {
    expect(newsroomSourceFamilyFromUrl("https://www.texastribune.org/politics")).toBe("texastribune.org");
    expect(newsroomSourceFamilyFromUrl("https://feeds.texastribune.org/link/abc")).toBe("texastribune.org");
    expect(newsroomSourceFamilyFromUrl("https://example.co.uk/story")).toBe("example.co.uk");
    expect(newsroomSourceFamilyFromUrl("http://www.example.org:8080/story")).toBe("example.org");
    expect(newsroomSourceFamilyFromUrl("")).toBeNull();
  });

  it("does not mistake syndicated URLs for independent corroboration", () => {
    const samePublisher = [
      source("https://www.texastribune.org/first"),
      source("https://feeds.texastribune.org/second"),
    ];
    expect(newsroomHasPublisherDiversity(samePublisher)).toBe(false);
    expect(newsroomHasPublisherDiversity([
      ...samePublisher,
      source("https://texasstandard.org/independent-report"),
    ])).toBe(true);
  });

  it("excludes Google News discovery links from independent source corroboration", () => {
    const singlePublisherAndDiscovery = [
      source("https://www.kxan.com/politics/story"),
      source("https://news.google.com/rss/articles/CBMiABC"),
    ];
    expect(newsroomSourceFamilyFromUrl(singlePublisherAndDiscovery[1].url)).toBe("google.com");
    expect(newsroomIndependentPublisherFamilyFromUrl(singlePublisherAndDiscovery[1].url)).toBeNull();
    expect(newsroomHasPublisherDiversity(singlePublisherAndDiscovery)).toBe(false);
    expect(newsroomHasPublisherDiversity([
      ...singlePublisherAndDiscovery,
      source("https://www.texastribune.org/2026/10/independent-story"),
    ])).toBe(true);
  });

  it("never uses a Google News discovery link as the canonical news article lead or source citation", () => {
    const discovery = source("https://news.google.com/rss/articles/CBMiABC", false, 100);
    const publisherA = source("https://www.texastribune.org/2026/10/14/report", false, 80);
    const publisherB = source("https://www.kxan.com/news/report", false, 75);
    const packet = [discovery, publisherA, publisherB];
    expect(newsroomHasPublisherDiversity(packet)).toBe(true);
    expect(newsroomLeadSourceUrl(packet)).toBe(publisherA.url);
    expect(uniquePacketSources(packet).map((row) => row.url)).toEqual([publisherA.url, publisherB.url]);
    expect(newsroomLeadSourceUrl([discovery])).toBeNull();
    expect(newsroomHasPublisherDiversity([discovery])).toBe(false);
    expect(newsroomHasPublisherDiversity([source(discovery.url, true)])).toBe(false);
  });

  it("accepts a substantive official primary record without a second publisher", () => {
    expect(newsroomHasPublisherDiversity([source("https://gov.texas.gov/news/post/test", true)])).toBe(true);
    expect(newsroomHasPublisherDiversity([source("https://www.kxan.com/story")])).toBe(false);
    expect(newsroomHasPublisherDiversity([])).toBe(false);
  });

  it("uses the same deterministic lead source at preflight and publication", () => {
    const secondary = source("https://media.example.com/story", false, 100);
    const primary = source("https://gov.texas.gov/news/post/official", true, 55);
    expect(newsroomLeadSourceUrl([secondary, primary])).toBe(primary.url);
    expect(uniquePacketSources([secondary, primary, secondary]).map((x) => x.url)).toEqual([
      primary.url,
      secondary.url,
    ]);
    expect(newsroomLeadSourceUrl([])).toBeNull();
  });

  it("checks duplicates and family diversity before reserving paid AI", () => {
    const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    expect(generator).toContain('.in("source_url", leadUrls.slice(offset, offset + 25))');
    expect(generator).toContain("already_published_source_url");
    expect(generator).toContain("insufficient_independent_sources");
    expect(generator.indexOf("existingLeadSources = new Set")).toBeLessThan(
      generator.indexOf('db.rpc("newsroom_reserve_ai_generation"'),
    );
  });
});
