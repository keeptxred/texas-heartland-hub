import { describe, expect, it } from "vitest";
import {
  POLICY_TRACKER_WAVE16_UPGRADES,
  WAVE16_INDEXABLE_POLICY_TRACKER_SLUGS,
} from "@/data/policy-tracker-wave16-upgrades";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

const EXPECTED = [
  "scope-act-online-minors",
  "texas-cyber-command",
] as const;

describe("wave 16 policy tracker readiness", () => {
  it("keeps the publication cohort explicit and leaves under-sourced genetic privacy quarantined", () => {
    expect([...WAVE16_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...EXPECTED].sort());
    expect(WAVE16_INDEXABLE_POLICY_TRACKER_SLUGS).not.toContain("genetic-data-privacy");
  });

  it.each(EXPECTED)("%s genuinely clears the unchanged canonical tracker gate", (slug) => {
    const tracker = POLICY_TRACKER_WAVE16_UPGRADES[slug];
    expect(tracker).toBeDefined();
    expect(policyTrackerWordCount(tracker)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });
});
