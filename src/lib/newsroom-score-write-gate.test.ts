import { describe, expect, it } from "vitest";
import { shouldPersistNewsroomScore } from "./newsroom-score-write-gate";

const initial = {
  score: 80,
  status: "READY",
  breakdown: {
    texasRelevance: 33.2,
    corroboration: 10,
    viralSignal: 6,
    recency: 4.9,
    selectionRank: 8,
    selectionReasons: ["fresh development +4"],
    selectionScore: 80,
    sourceQuality: 14,
    breakingOverride: false,
  },
};

describe("periodic newsroom score write gate", () => {
  it("does not rewrite every cluster when only relative rank and recency drift", () => {
    const next = { ...initial, score: 79, breakdown: { ...initial.breakdown,
      recency: 4.8, selectionRank: 42, selectionScore: 79,
      selectionReasons: ["fresh development +2"],
    } };
    expect(shouldPersistNewsroomScore(initial, next)).toBe(false);
  });

  it("writes changes to verified inputs and new primary evidence", () => {
    const next = { ...initial, breakdown: { ...initial.breakdown, corroboration: 15 } };
    expect(shouldPersistNewsroomScore(initial, next)).toBe(true);
  });

  it("persists a larger score shift or a change in an urgent/high tier", () => {
    expect(shouldPersistNewsroomScore(initial, { ...initial, score: 76 })).toBe(true);
    expect(shouldPersistNewsroomScore(initial, { ...initial, score: 91 })).toBe(true);
  });

  it("preserves changes to status and breaking/public-safety priority", () => {
    expect(shouldPersistNewsroomScore(initial, { ...initial, status: "ARCHIVED" })).toBe(true);
    expect(shouldPersistNewsroomScore(initial, { ...initial, breakdown: { ...initial.breakdown, breakingOverride: true } })).toBe(true);
  });

  it("always persists first-time entries", () => {
    expect(shouldPersistNewsroomScore(null, initial)).toBe(true);
  });
});
