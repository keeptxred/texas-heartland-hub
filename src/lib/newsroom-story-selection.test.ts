import { describe, expect, it } from "vitest";
import { rankNewsroomStorySelection, storySelectionSimilarity, type StorySelectionInput } from "./newsroom-story-selection";

const NOW = new Date("2026-08-17T12:00:00.000Z");

function candidate(overrides: Partial<StorySelectionInput> & Pick<StorySelectionInput, "id" | "canonicalSubject">): StorySelectionInput {
  return {
    id: overrides.id,
    canonicalSubject: overrides.canonicalSubject,
    editorialScore: overrides.editorialScore ?? 70,
    sourceCount: overrides.sourceCount ?? 2,
    primarySourceCount: overrides.primarySourceCount ?? 0,
    firstSeenAt: overrides.firstSeenAt ?? "2026-08-17T10:00:00.000Z",
    lastSeenAt: overrides.lastSeenAt ?? "2026-08-17T11:30:00.000Z",
    pillarSlug: overrides.pillarSlug ?? "texas-news",
  };
}

describe("rankNewsroomStorySelection", () => {
  it("ranks the stronger corroborated version of a near-duplicate event above the weaker cluster", () => {
    const strong = candidate({
      id: "strong",
      canonicalSubject: "Texas Supreme Court blocks disputed election rule after emergency appeal",
      editorialScore: 82,
      sourceCount: 4,
      primarySourceCount: 1,
    });
    const weak = candidate({
      id: "weak",
      canonicalSubject: "Texas Supreme Court blocks election rule following emergency appeal",
      editorialScore: 79,
      sourceCount: 1,
      primarySourceCount: 0,
    });

    const ranked = rankNewsroomStorySelection([weak, strong], NOW);
    expect(ranked[0].id).toBe("strong");
    const weakResult = ranked.find((row) => row.id === "weak")!;
    expect(weakResult.redundancyOf).toBe("strong");
    expect(weakResult.redundancyPenalty).toBeGreaterThan(0);
    expect(weakResult.selectionScore).toBeLessThan(ranked[0].selectionScore);
  });

  it("gives an official public-safety emergency an urgent floor without bypassing later gates", () => {
    const routine = candidate({ id: "routine", canonicalSubject: "Texas agency releases annual transportation report", editorialScore: 91, sourceCount: 5, primarySourceCount: 2 });
    const emergency = candidate({ id: "emergency", canonicalSubject: "Flash flood emergency prompts evacuations in Central Texas", editorialScore: 55, sourceCount: 1, primarySourceCount: 1 });

    const ranked = rankNewsroomStorySelection([routine, emergency], NOW);
    expect(ranked[0].id).toBe("emergency");
    expect(ranked[0].breakingOverride).toBe(true);
    expect(ranked[0].selectionTier).toBe("urgent");
    expect(ranked[0].selectionScore).toBeGreaterThanOrEqual(96);
  });

  it("prioritizes fresh, independently corroborated clusters over stale single-source items at similar base score", () => {
    const corroborated = candidate({ id: "corroborated", canonicalSubject: "ERCOT issues new summer reserve outlook for Texas grid", editorialScore: 68, sourceCount: 4, primarySourceCount: 1 });
    const stale = candidate({ id: "stale", canonicalSubject: "Texas museum announces fall exhibit schedule", editorialScore: 70, sourceCount: 1, primarySourceCount: 0, lastSeenAt: "2026-08-16T10:00:00.000Z" });

    const ranked = rankNewsroomStorySelection([stale, corroborated], NOW);
    expect(ranked[0].id).toBe("corroborated");
    expect(ranked[0].selectionScore).toBeGreaterThan(ranked[1].selectionScore);
  });

  it("does not treat stories from different pillars as redundant", () => {
    const politics = candidate({ id: "politics", canonicalSubject: "Dallas officials approve stadium funding agreement", pillarSlug: "politics" });
    const sports = candidate({ id: "sports", canonicalSubject: "Dallas officials approve stadium funding agreement", pillarSlug: "sports" });
    expect(storySelectionSimilarity(politics, sports)).toBe(0);
    const ranked = rankNewsroomStorySelection([politics, sports], NOW);
    expect(ranked.every((row) => row.redundancyPenalty === 0)).toBe(true);
  });

  it("uses deterministic tie breakers so repeated runs return the same ordering", () => {
    const a = candidate({ id: "a", canonicalSubject: "Texas city council adopts revised water plan" });
    const b = candidate({ id: "b", canonicalSubject: "West Texas university opens new engineering center" });
    expect(rankNewsroomStorySelection([b, a], NOW).map((row) => row.id)).toEqual(
      rankNewsroomStorySelection([a, b], NOW).map((row) => row.id),
    );
  });

  it("relieves part of the duplicate penalty when the lower-ranked cluster uniquely adds a primary source", () => {
    const strongSignals = candidate({ id: "signals", canonicalSubject: "Texas commission approves coastal barrier construction contract", editorialScore: 88, sourceCount: 5, primarySourceCount: 0 });
    const official = candidate({ id: "official", canonicalSubject: "Texas commission approves coastal barrier construction contract", editorialScore: 74, sourceCount: 1, primarySourceCount: 1 });
    const ranked = rankNewsroomStorySelection([strongSignals, official], NOW);
    const officialResult = ranked.find((row) => row.id === "official")!;
    expect(officialResult.redundancyPenalty).toBeLessThanOrEqual(14);
    expect(officialResult.redundancyPenalty).toBeGreaterThan(0);
  });
});
