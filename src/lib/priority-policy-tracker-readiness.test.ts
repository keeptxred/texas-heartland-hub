import { describe, expect, it } from "vitest";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-upgrades";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

const EXPECTED = [
  "property-taxes",
  "border-security",
  "energy-ercot",
  "gun-rights",
  "life-abortion",
] as const;

describe("priority policy tracker readiness", () => {
  it("keeps the upgrade manifest explicit", () => {
    expect([...PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...EXPECTED].sort());
  });

  it.each(EXPECTED)("%s genuinely clears the canonical tracker gate", (slug) => {
    const tracker = ALL_POLICY_TRACKERS.find((item) => item.slug === slug);
    expect(tracker).toBeDefined();
    expect(policyTrackerWordCount(tracker!)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker!.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker!.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker!.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker!.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });

  it("makes only the intentionally upgraded policy cohort indexable", () => {
    const ready = ALL_POLICY_TRACKERS
      .filter(isPolicyTrackerIndexable)
      .map((tracker) => tracker.slug)
      .sort();
    expect(ready).toEqual([...EXPECTED].sort());
  });
});
