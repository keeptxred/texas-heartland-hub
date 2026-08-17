import { describe, expect, it } from "vitest";
import { evaluateNewsroomShadowProduction } from "./newsroom-shadow-production";

function baseInput() {
  const candidates = Array.from({ length: 20 }, (_, index) => ({
    id: `c${index + 1}`,
    clusterId: `k${index + 1}`,
    editorialScore: 80 - index,
    recommendedFormat: "SINGLE",
    status: "PENDING",
    createdAt: "2026-08-17T10:00:00Z",
  }));
  const clusters = candidates.map((candidate, index) => ({
    id: candidate.clusterId,
    canonicalSubject: `Texas story ${index + 1}`,
    pillarSlug: "texas-news",
    sourceCount: 1,
    primarySourceCount: 1,
    firstSeenAt: "2026-08-17T09:00:00Z",
  }));
  return {
    candidates,
    clusters,
    memberships: clusters.map((cluster) => ({
      clusterId: cluster.id,
      relationshipType: "same-event",
      isPrimarySource: true,
    })),
    packets: clusters.map((cluster) => ({ clusterId: cluster.id })),
  };
}

describe("Phase 13 current shadow validation cohort", () => {
  it("uses the latest three completed drafts for launch validation while retaining historical totals", () => {
    const base = baseInput();
    const oldRejected = Array.from({ length: 5 }, (_, index) => ({
      id: `old-${index}`,
      candidateId: `c${index + 1}`,
      clusterId: `k${index + 1}`,
      mode: "shadow",
      status: "REJECTED",
      mainWordCount: 600,
      validationReasons: ["legacy_canary_failure"],
      publishedArticleId: null,
      createdAt: `2026-08-17T0${index}:00:00Z`,
    }));
    const currentGenerated = Array.from({ length: 3 }, (_, index) => ({
      id: `current-${index}`,
      candidateId: `c${index + 10}`,
      clusterId: `k${index + 10}`,
      mode: "shadow",
      status: "GENERATED",
      mainWordCount: 1400 + index,
      validationReasons: [],
      publishedArticleId: null,
      createdAt: `2026-08-17T1${index}:00:00Z`,
    }));

    const result = evaluateNewsroomShadowProduction({
      ...base,
      drafts: [...oldRejected, ...currentGenerated],
    });

    expect(result.draftStats.total).toBe(8);
    expect(result.draftStats.validationPassRate).toBe(37.5);
    expect(result.readiness.find((check) => check.key === "shadow_sample")?.passed).toBe(true);
    expect(result.readiness.find((check) => check.key === "draft_validation")?.passed).toBe(true);
    expect(result.readiness.find((check) => check.key === "draft_validation")?.detail).toContain("100% of the latest 3");
    expect(result.readyForControlledLaunch).toBe(true);
  });

  it("holds launch when the latest three drafts fall below the 80 percent threshold", () => {
    const base = baseInput();
    const drafts = [
      { id: "d1", status: "GENERATED", createdAt: "2026-08-17T12:00:00Z" },
      { id: "d2", status: "GENERATED", createdAt: "2026-08-17T11:00:00Z" },
      { id: "d3", status: "REJECTED", createdAt: "2026-08-17T10:00:00Z" },
    ].map((draft, index) => ({
      ...draft,
      candidateId: `c${index + 1}`,
      clusterId: `k${index + 1}`,
      mode: "shadow",
      mainWordCount: 1300,
      validationReasons: draft.status === "GENERATED" ? [] : ["failed"],
      publishedArticleId: null,
    }));

    const result = evaluateNewsroomShadowProduction({ ...base, drafts });
    expect(result.readiness.find((check) => check.key === "draft_validation")?.passed).toBe(false);
    expect(result.readyForControlledLaunch).toBe(false);
  });
});
