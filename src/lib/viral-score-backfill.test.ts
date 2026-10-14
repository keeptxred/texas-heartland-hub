import { describe, expect, it } from "vitest";
import { isFreshForAutoPublication, mergeScoringRows } from "@/lib/viral-score-backfill";

describe("KeepTXRed feed scoring backfill", () => {
  it("reserves capacity for late-arriving stories without duplicating recent rows", () => {
    const recent = [{ id: 1, source: "recent" }, { id: 2, source: "recent" }];
    const unscored = [{ id: 2, source: "backfill" }, { id: 3, source: "Comptroller" }];
    expect(mergeScoringRows(recent, unscored)).toEqual([
      { id: 1, source: "recent" },
      { id: 2, source: "recent" },
      { id: 3, source: "Comptroller" },
    ]);
  });
  it("enforces the existing total scoring budget", () => {
    const recent = Array.from({ length: 230 }, (_, id) => ({ id }));
    const unscored = Array.from({ length: 90 }, (_, i) => ({ id: i + 230 }));
    const scored = mergeScoringRows(recent, unscored);
    expect(scored).toHaveLength(300);
    expect(scored[299].id).toBe(299);
    expect(scored.some((row) => row.id === 319)).toBe(false);
  });
  it("does not lose older stories when no recent feed items exist", () => {
    expect(mergeScoringRows([], [{ id: 42 }])).toEqual([{ id: 42 }]);
  });
});

describe("backfill auto-publication freshness", () => {
  const now = Date.parse("2026-10-14T15:00:00Z");
  it("allows fresh, valid news only", () => {
    expect(isFreshForAutoPublication("2026-10-13T15:00:00Z", now)).toBe(true);
    expect(isFreshForAutoPublication("2026-10-11T15:00:00Z", now)).toBe(true);
  });
  it("does not auto-publish historical or invalid dates", () => {
    expect(isFreshForAutoPublication("2026-10-08T15:00:00Z", now)).toBe(false);
    expect(isFreshForAutoPublication(null, now)).toBe(false);
    expect(isFreshForAutoPublication("not a date", now)).toBe(false);
    expect(isFreshForAutoPublication("2026-10-16T15:00:00Z", now)).toBe(false);
  });
});
