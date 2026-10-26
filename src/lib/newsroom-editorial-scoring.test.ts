import { describe, expect, it } from "vitest";
import {
  isPrimaryNewsSource,
  rankEditorialCandidates,
  routeEditorialPillar,
  scoreEditorialCluster,
  verifiedEditorialPublisherCounts,
} from "./newsroom-editorial-scoring";

describe("newsroom editorial scoring", () => {
  it("rewards Texas relevance, source quality and independent corroboration", () => {
    const strong = scoreEditorialCluster({
      texasRelevance: 95,
      sourceReputation: 90,
      viralScore: 40,
      trendVelocity: 25,
      sourceCount: 4,
      primarySourceCount: 1,
      ageHours: 2,
    });
    const weak = scoreEditorialCluster({
      texasRelevance: 30,
      sourceReputation: 50,
      viralScore: 0,
      trendVelocity: 0,
      sourceCount: 1,
      primarySourceCount: 0,
      ageHours: 36,
    });
    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.breakdown.corroboration).toBeGreaterThan(weak.breakdown.corroboration);
  });

  it("uses persisted pillar evidence before deterministic fallback routing", () => {
    expect(routeEditorialPillar({
      canonicalSubject: "property tax relief proposal reaches texas senate",
      persistedPillars: ["texas-economy-small-business", "texas-economy-small-business", null],
    })).toBe("texas-economy-small-business");
  });

  it("recognizes Sports as an editorial lane without imposing a quota", () => {
    expect(routeEditorialPillar({
      canonicalSubject: "houston dynamo face la galaxy in mls match",
      persistedPillars: [],
    })).toBe("sports");
  });

  it("routes official college athletics feeds to Sports even when the generic title lacks a league or team token", () => {
    expect(routeEditorialPillar({
      canonicalSubject: "cross country announces 2026 schedule",
      persistedPillars: [null],
      sourceNames: ["Baylor Athletics"],
      sourceUrls: ["https://baylorbears.com/news/2026/8/14/cross-country-announces-2026-schedule"],
    })).toBe("sports");
  });

  it("recognizes direct government and official athletics pages as primary sources but not Google News mirrors", () => {
    expect(isPrimaryNewsSource("Office of the Governor", "https://gov.texas.gov/news/post/example")).toBe(true);
    expect(isPrimaryNewsSource("Baylor Athletics", "https://baylorbears.com/news/2026/8/14/example")).toBe(true);
    expect(isPrimaryNewsSource("Office of the Texas Governor (.gov)", "https://news.google.com/rss/articles/example")).toBe(false);
  });

  it("does not count Google News RSS links as independent publisher corroboration", () => {
    const result = verifiedEditorialPublisherCounts([
      { url: "https://news.google.com/rss/articles/CBMiA", name: "Texas Tribune", flaggedPrimary: false },
      { url: "https://news.google.com/rss/articles/CBMiB", name: "Attorney General (.gov)", flaggedPrimary: true },
      { url: "https://news.google.com/rss/articles/CBMiC", name: "Local TV", flaggedPrimary: false },
    ]);
    expect(result).toEqual({ sourceCount: 0, primarySourceCount: 0 });
  });

  it("counts independent publisher families only once across duplicate feeds", () => {
    const counts = verifiedEditorialPublisherCounts([
      { url: "https://feeds.texastribune.org/link/abc", name: "Texas Tribune", flaggedPrimary: false },
      { url: "https://www.texastribune.org/2026/10/25/news", name: "Texas Tribune", flaggedPrimary: false },
      { url: "https://www.sacurrent.com/news/story", name: "San Antonio Current", flaggedPrimary: false },
      { url: "https://lrl.texas.gov/currentIssues/clips/news", name: "Legislative clipping index", flaggedPrimary: true },
    ]);
    expect(counts).toEqual({ sourceCount: 2, primarySourceCount: 0 });
  });

  it("credits directly linked primary records without inferring authority from misleading labels", () => {
    const verified = verifiedEditorialPublisherCounts([
      { url: "https://www.texasattorneygeneral.gov/news/releases/example", name: "Texas Attorney General", flaggedPrimary: true },
      { url: "https://news.google.com/rss/articles/example", name: "Texas Attorney General", flaggedPrimary: true },
      { url: "https://www.sacurrent.com/news/example", name: "Office of Texas AG", flaggedPrimary: true },
    ]);
    expect(verified).toEqual({ sourceCount: 2, primarySourceCount: 1 });
  });

  it("gives zero extra corroboration credit to the same long headline syndicated to another host", () => {
    const sharedTitle = "As early voting begins in Texas, Gov. Abbott’s challenger Gina Hinojosa sues over Musk emails";
    const sources = [
      { url: "https://www.kut.org/politics/2026-10-19/report", name: "KUT 90.5", title: sharedTitle, flaggedPrimary: false },
      { url: "https://texasstandard.org/stories/report", name: "Texas Standard", title: sharedTitle, flaggedPrimary: false },
    ];
    expect(verifiedEditorialPublisherCounts(sources)).toEqual({ sourceCount: 1, primarySourceCount: 0 });
    expect(verifiedEditorialPublisherCounts([...sources, {
      url: "https://news.bloomberglaw.com/litigation/independent-court-report",
      name: "Bloomberg Law",
      title: "Abbott’s Elon Musk Records Sought in Election Rival’s Suit",
      flaggedPrimary: false,
    }])).toEqual({ sourceCount: 2, primarySourceCount: 0 });
  });

  it("makes corroboration scoring consistent with verified family counts", () => {
    const direct = verifiedEditorialPublisherCounts([
      { url: "https://www.texastribune.org/2026/10/25/example", name: "Texas Tribune", flaggedPrimary: false },
      { url: "https://www.sacurrent.com/news/example", name: "San Antonio Current", flaggedPrimary: false },
    ]);
    const discovery = verifiedEditorialPublisherCounts([
      { url: "https://news.google.com/rss/articles/aaa", name: "Texas Tribune", flaggedPrimary: false },
      { url: "https://news.google.com/rss/articles/bbb", name: "San Antonio Current", flaggedPrimary: false },
    ]);
    const common = { texasRelevance: 75, sourceReputation: 80, viralScore: 20, trendVelocity: 10, ageHours: 4 };
    expect(scoreEditorialCluster({ ...common, ...direct }).breakdown.corroboration).toBe(5);
    expect(scoreEditorialCluster({ ...common, ...discovery }).breakdown.corroboration).toBe(0);
  });

  it("ranks the strongest statewide candidates globally rather than by pillar quotas", () => {
    const ranked = rankEditorialCandidates([
      { id: "elections", editorialScore: 82, firstSeenAt: "2026-08-15T10:00:00Z" },
      { id: "sports", editorialScore: 91, firstSeenAt: "2026-08-15T11:00:00Z" },
      { id: "policy", editorialScore: 87, firstSeenAt: "2026-08-15T09:00:00Z" },
    ]);
    expect(ranked.map((row) => row.id)).toEqual(["sports", "policy", "elections"]);
  });
});
