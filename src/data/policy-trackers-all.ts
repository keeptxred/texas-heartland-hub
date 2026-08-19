import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE2 } from "@/data/policy-trackers-wave2";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";
import { POLICY_TRACKERS_WAVE7 } from "@/data/policy-trackers-wave7";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";
import { POLICY_TRACKERS_WAVE10 } from "@/data/policy-trackers-wave10";

export const ALL_POLICY_TRACKERS = [
  ...POLICY_TRACKERS,
  ...POLICY_TRACKERS_WAVE2,
  ...POLICY_TRACKERS_WAVE3,
  ...POLICY_TRACKERS_WAVE4,
  ...POLICY_TRACKERS_WAVE5,
  ...POLICY_TRACKERS_WAVE6,
  ...POLICY_TRACKERS_WAVE7,
  ...POLICY_TRACKERS_WAVE8,
  ...POLICY_TRACKERS_WAVE9,
  ...POLICY_TRACKERS_WAVE10,
];

export const ALL_POLICY_TRACKER_SLUGS = ALL_POLICY_TRACKERS.map((tracker) => tracker.slug);

export function getAnyPolicyTracker(slug: string) {
  return ALL_POLICY_TRACKERS.find((tracker) => tracker.slug === slug);
}
