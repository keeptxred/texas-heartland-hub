import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { isVerifiedTexasInstitutionalDiscovery } from "./newsroom-institution-source-relevance";

describe("strict original Texas institutional newsroom discovery", () => {
  it("admits the original November 2026 UTEP mallard research report as a Texas news lead", () => {
    expect(isVerifiedTexasInstitutionalDiscovery(
      "UTEP — Official University News",
      "https://www.utep.edu/newsfeed/2026/november/utep-researcher-leads-first-of-its-kind-study-on-genetic-changes-in-wild-ducks.html",
    )).toBe(true);
  });

  it("admits real dated Texas Lutheran football original reporting", () => {
    expect(isVerifiedTexasInstitutionalDiscovery(
      "Texas Lutheran Football — Official Athletics",
      "https://tlubulldogs.com/news/2026/11/7/football-tlu-holds-on-for-28-20-win-over-centenary-la.aspx",
    )).toBe(true);
  });

  it("never treats a station, Google RSS link or copycat university as equivalent first-party Texas evidence", () => {
    for (const source of ["Google News — UTEP", "NBC DFW", "Some Blog", "UTEP — Official University News "]) {
      expect(isVerifiedTexasInstitutionalDiscovery(source,
        "https://www.utep.edu/newsfeed/2026/november/duck-study.html")).toBe(false);
    }
    for (const url of [
      "https://news.google.com/rss/articles/abc",
      "https://www.utep.edu.example.invalid/newsfeed/2026/november/duck-study.html",
      "http://www.utep.edu/newsfeed/2026/november/duck-study.html",
      "https://www.utep.edu/students/news.html",
      "https://tlubulldogs.com/sports/football/archives",
    ]) {
      expect(isVerifiedTexasInstitutionalDiscovery("UTEP — Official University News", url)).toBe(false);
    }
  });

  it("keeps general Texas-relevance scoring and downstream source gates untouched", () => {
    const source = readFileSync("src/routes/api/public/hooks/ingest-feeds.ts", "utf8");
    expect(source).toContain("isVerifiedTexasInstitutionalDiscovery(configuredSource, item.link)");
    expect(source).toContain("result.texasRelevanceScore >= TEXAS_RELEVANCE_MIN");
    expect(source).not.toContain("TEXAS_RELEVANCE_MIN = 0");
    const producer = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(producer).toContain("newsroomHasPublisherDiversity");
  });
});