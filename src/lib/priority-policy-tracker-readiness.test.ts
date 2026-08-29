import { describe, expect, it } from "vitest";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-upgrades";
import { WAVE2_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave2-upgrades";
import { WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave3-upgrades";
import { WAVE4_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave4-upgrades";
import { WAVE5_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave5-upgrades";
import { WAVE6_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave6-upgrades";
import { WAVE7_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave7-upgrades";
import { WAVE8_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave8-upgrades";
import { WAVE9_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave9-upgrades";
import { WAVE10_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave10-upgrades";
import { WAVE11_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave11-upgrades";
import {
  MIN_POLICY_TRACKER_WORDS,
  isPolicyTrackerIndexable,
  policyTrackerWordCount,
} from "@/lib/policy-tracker-indexability";

const UPGRADED_EXPECTED = [
  "property-taxes",
  "border-security",
  "energy-ercot",
  "gun-rights",
  "life-abortion",
] as const;

const WAVE2_EXPECTED = ["parental-rights", "election-integrity", "bitcoin-reserve", "central-bank-digital-currency"] as const;
const WAVE3_EXPECTED = ["medical-freedom", "esg-energy-boycotts", "agriculture-family-farms"] as const;
const WAVE4_EXPECTED = ["religious-liberty", "state-federal-power", "right-to-work"] as const;
const WAVE5_EXPECTED = ["womens-sports", "campus-free-speech", "advanced-nuclear-energy"] as const;
const WAVE6_EXPECTED = ["higher-education-dei", "foreign-adversary-property", "china-investment-restrictions"] as const;
const WAVE7_EXPECTED = ["e-verify-employment", "public-sector-labor", "occupational-licensing-mobility"] as const;
const WAVE8_EXPECTED = ["regulatory-reform-treo", "career-technical-workforce", "semiconductor-manufacturing"] as const;
const WAVE9_EXPECTED = ["local-preemption-regulatory-consistency", "minor-gender-transition-medical-law"] as const;
const WAVE10_EXPECTED = ["school-library-materials", "school-safety-security", "violent-offense-bail"] as const;
const WAVE11_EXPECTED = ["data-centers-large-loads", "constitutional-tax-protections", "critical-minerals-rare-earths"] as const;

const EXPECTED_INDEXABLE = [
  ...UPGRADED_EXPECTED,
  ...WAVE2_EXPECTED,
  ...WAVE3_EXPECTED,
  ...WAVE4_EXPECTED,
  ...WAVE5_EXPECTED,
  ...WAVE6_EXPECTED,
  ...WAVE7_EXPECTED,
  ...WAVE8_EXPECTED,
  ...WAVE9_EXPECTED,
  ...WAVE10_EXPECTED,
  ...WAVE11_EXPECTED,
  "social-media-viewpoint-moderation",
] as const;

describe("priority policy tracker readiness", () => {
  it("keeps the upgrade manifests explicit", () => {
    expect([...PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...UPGRADED_EXPECTED].sort());
    expect([...WAVE2_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE2_EXPECTED].sort());
    expect([...WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE3_EXPECTED].sort());
    expect([...WAVE4_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE4_EXPECTED].sort());
    expect([...WAVE5_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE5_EXPECTED].sort());
    expect([...WAVE6_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE6_EXPECTED].sort());
    expect([...WAVE7_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE7_EXPECTED].sort());
    expect([...WAVE8_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE8_EXPECTED].sort());
    expect([...WAVE9_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE9_EXPECTED].sort());
    expect([...WAVE10_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE10_EXPECTED].sort());
    expect([...WAVE11_INDEXABLE_POLICY_TRACKER_SLUGS].sort()).toEqual([...WAVE11_EXPECTED].sort());
  });

  it.each(EXPECTED_INDEXABLE)("%s genuinely clears the canonical tracker gate", (slug) => {
    const tracker = ALL_POLICY_TRACKERS.find((item) => item.slug === slug);
    expect(tracker).toBeDefined();
    expect(policyTrackerWordCount(tracker!)).toBeGreaterThanOrEqual(MIN_POLICY_TRACKER_WORDS);
    expect(tracker!.sources.filter((source) => source.primary).length).toBeGreaterThanOrEqual(3);
    expect(tracker!.keyFacts.length).toBeGreaterThanOrEqual(4);
    expect(tracker!.context.length).toBeGreaterThanOrEqual(2);
    expect(tracker!.watchFor.length).toBeGreaterThanOrEqual(4);
    expect(isPolicyTrackerIndexable(tracker)).toBe(true);
  });

  it("makes only the intentionally expanded policy cohort indexable", () => {
    const ready = ALL_POLICY_TRACKERS.filter(isPolicyTrackerIndexable).map((tracker) => tracker.slug).sort();
    expect(ready).toEqual([...EXPECTED_INDEXABLE].sort());
  });
});
