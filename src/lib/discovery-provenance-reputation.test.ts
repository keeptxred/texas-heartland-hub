import { describe, expect, it } from "vitest";
import { applyTrustedDiscoveryReviewFloor } from "@/lib/discovery-provenance-reputation";

const FLOOR = 55;

describe("trusted discovery review floor", () => {
  it("preserves a publisher that already clears review", () => {
    expect(applyTrustedDiscoveryReviewFloor(
      { score: 65, reason: "Established local outlet" },
      { score: 75, reason: "Configured Texas discovery feed" },
      FLOOR,
    )).toEqual({ score: 65, reason: "Established local outlet" });
  });

  it("lifts an unclassified publisher only to the review floor", () => {
    const result = applyTrustedDiscoveryReviewFloor(
      { score: 45, reason: "Unclassified source" },
      { score: 75, reason: "Configured Texas discovery feed" },
      FLOOR,
    );
    expect(result.score).toBe(FLOOR);
    expect(result.reason).toContain("review-floor visibility from trusted discovery provenance");
  });

  it("does not lift an unknown publisher without trusted discovery provenance", () => {
    expect(applyTrustedDiscoveryReviewFloor(
      { score: 45, reason: "Unclassified source" },
      null,
      FLOOR,
    ).score).toBe(45);

    expect(applyTrustedDiscoveryReviewFloor(
      { score: 45, reason: "Unclassified source" },
      { score: 45, reason: "Unclassified discovery source" },
      FLOOR,
    ).score).toBe(45);
  });

  it("can never grant more than review-floor reputation to a weak publisher", () => {
    const result = applyTrustedDiscoveryReviewFloor(
      { score: 30, reason: "Unknown source" },
      { score: 95, reason: "Official primary discovery source" },
      FLOOR,
    );
    expect(result.score).toBe(FLOOR);
    expect(result.score).toBeLessThan(65);
  });
});
