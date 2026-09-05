import { describe, expect, it } from "vitest";
import {
  POLICY_TRACKER_WAVE21_UPGRADE,
  WAVE21_INDEXABLE_POLICY_TRACKER_SLUG,
} from "@/data/policy-tracker-wave21-upgrade";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

describe("wave 21 state budget tracker readiness", () => {
  it("keeps the publication target explicit", () => {
    expect(WAVE21_INDEXABLE_POLICY_TRACKER_SLUG).toBe("state-budget");
  });

  it("genuinely clears the unchanged canonical tracker gate", () => {
    const tracker = POLICY_TRACKER_WAVE21_UPGRADE;
    expect(policyTrackerWordCount(tracker)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });
});
