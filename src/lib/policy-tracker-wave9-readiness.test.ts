import { describe, expect, it } from "vitest";
import {
  POLICY_TRACKER_WAVE9_UPGRADES,
  WAVE9_INDEXABLE_POLICY_TRACKER_SLUGS,
} from "@/data/policy-tracker-wave9-upgrades";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

const EXPECTED = [
  "local-preemption-regulatory-consistency",
  "minor-gender-transition-medical-law",
] as const;

describe("wave 9 policy tracker readiness", () => {
  it("keeps the publication cohort explicit", () => {
    expect([...WAVE9_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...EXPECTED].sort());
  });

  it.each(EXPECTED)("%s genuinely clears the unchanged canonical tracker gate", (slug) => {
    const tracker = POLICY_TRACKER_WAVE9_UPGRADES[slug];
    expect(tracker).toBeDefined();
    expect(policyTrackerWordCount(tracker)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });
});
