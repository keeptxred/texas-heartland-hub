import { describe, expect, it } from "vitest";
import { originalSportsRssPublishedAt, originalSportsPermalinkPublishedAt } from "./sports-original-source-date";
import { readFileSync } from "node:fs";
const NOW = Date.parse("2026-11-11T18:00:00Z");

describe("official sports discovery original timestamps", () => {
  it("preserves a first-party RSS date without introducing crawl timestamps", () => {
    expect(originalSportsRssPublishedAt("Tue, 10 Nov 2026 14:35:00 GMT", NOW))
      .toBe("2026-11-10T14:35:00.000Z");
    expect(originalSportsRssPublishedAt("2026-11-07T17:30:00-06:00", NOW))
      .toBe("2026-11-07T23:30:00.000Z");
  });

  it("rejects undated, invalid, archival, and future RSS stories", () => {
    for (const raw of [undefined, "", "last updated today", "not-a-date", "Sat, 7 Nov 2025 12:00:00 GMT", "2026-09-07", "2026-12-10"]) {
      expect(originalSportsRssPublishedAt(raw, NOW)).toBeNull();
    }
  });

  it("uses dates encoded in first-party original article URLs rather than a crawl clock", () => {
    expect(originalSportsPermalinkPublishedAt("https://tlubulldogs.com/news/2026/11/7/football-tlu-holds-on.aspx", NOW))
      .toBe("2026-11-07T12:00:00.000Z");
    expect(originalSportsPermalinkPublishedAt("https://www.12thman.com/news/2026/11/10/football-recap", NOW))
      .toBe("2026-11-10T12:00:00.000Z");
    expect(originalSportsPermalinkPublishedAt("https://www.firstalert7.com/2026/11/09/local-story/", NOW))
      .toBe("2026-11-09T12:00:00.000Z");
  });

  it("refuses index links, non-dated HTML, impossible calendar days, stale and off-protocol links", () => {
    for (const url of [
      "https://www.nhl.com/stars/news/sports-story",
      "https://www.12thman.com/news/",
      "https://www.12thman.com/news/2026/11/",
      "https://www.12thman.com/news/2026/2/30/football",
      "https://www.12thman.com/news/2026/9/25/football",
      "https://www.12thman.com/news/2026/12/12/football",
      "http://www.12thman.com/news/2026/11/10/football",
      "https://www.12thman.com/news/2026/11/10/",
      "javascript:alert(1)",
    ]) expect(originalSportsPermalinkPublishedAt(url, NOW)).toBeNull();
  });

  it("keeps the existing source, attribution, bounded batches and editorial routing", () => {
    const source = readFileSync("src/routes/api/public/hooks/ingest-sports.ts", "utf8");
    expect(source).toContain("originalSportsRssPublishedAt(date)");
    expect(source).toContain("originalSportsPermalinkPublishedAt(canonical)");
    expect(source).not.toContain("pub_date: new Date()");
    expect(source).not.toContain("safeIso(date)");
    expect(source).toContain("trend_source: source.name");
    expect(source).toContain("SPORTS_UPSERT_BATCH_SIZE = 50");
    expect(source).toContain('onConflict: "link", ignoreDuplicates: true');
    expect(source).toContain("classifySportsText");
  });
});
