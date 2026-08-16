import { describe, expect, it } from "vitest";
import { rankEditorialCandidates, routeEditorialPillar, scoreEditorialCluster } from "./newsroom-editorial-scoring";

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

  it("ranks the strongest statewide candidates globally rather than by pillar quotas", () => {
    const ranked = rankEditorialCandidates([
      { id: "elections", editorialScore: 82, firstSeenAt: "2026-08-15T10:00:00Z" },
      { id: "sports", editorialScore: 91, firstSeenAt: "2026-08-15T11:00:00Z" },
      { id: "policy", editorialScore: 87, firstSeenAt: "2026-08-15T09:00:00Z" },
    ]);
    expect(ranked.map((row) => row.id)).toEqual(["sports", "policy", "elections"]);
  });
});
