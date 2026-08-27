import { describe, expect, it } from "vitest";
import {
  POLICY_TRACKER_WAVE3_UPGRADES,
  WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS,
} from "@/data/policy-tracker-wave3-upgrades";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

const EXPECTED = [
  "medical-freedom",
  "esg-energy-boycotts",
  "agriculture-family-farms",
] as const;

describe("wave 3 policy tracker readiness", () => {
  it("keeps the publication cohort explicit", () => {
    expect([...WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...EXPECTED].sort());
  });

  it.each(EXPECTED)("%s genuinely clears the unchanged canonical tracker gate", (slug) => {
    const tracker = POLICY_TRACKER_WAVE3_UPGRADES[slug];
    expect(tracker).toBeDefined();
    expect(policyTrackerWordCount(tracker)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });
});
