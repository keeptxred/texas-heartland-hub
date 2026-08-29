import { describe, expect, it } from "vitest";
import {
  GENETIC_DATA_PRIVACY_INDEXABLE_SLUG,
  GENETIC_DATA_PRIVACY_UPGRADE,
} from "@/data/policy-tracker-genetic-privacy-upgrade";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

describe("genetic data privacy tracker readiness", () => {
  it("keeps the promotion target explicit", () => {
    expect(GENETIC_DATA_PRIVACY_INDEXABLE_SLUG).toBe("genetic-data-privacy");
  });

  it("genuinely clears the unchanged canonical tracker gate", () => {
    const tracker = GENETIC_DATA_PRIVACY_UPGRADE;
    expect(policyTrackerWordCount(tracker)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });
});
