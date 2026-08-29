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
import { POLICY_TRACKERS_WAVE11 } from "@/data/policy-trackers-wave11";
import { POLICY_TRACKERS_WAVE12 } from "@/data/policy-trackers-wave12";
import { POLICY_TRACKERS_WAVE13 } from "@/data/policy-trackers-wave13";
import { POLICY_TRACKERS_WAVE14 } from "@/data/policy-trackers-wave14";
import { POLICY_TRACKERS_WAVE15 } from "@/data/policy-trackers-wave15";
import { POLICY_TRACKERS_WAVE16 } from "@/data/policy-trackers-wave16";
import { POLICY_TRACKERS_WAVE17 } from "@/data/policy-trackers-wave17";
import { POLICY_TRACKER_UPGRADES } from "@/data/policy-tracker-upgrades";
import { POLICY_TRACKER_WAVE2_UPGRADES } from "@/data/policy-tracker-wave2-upgrades";
import { POLICY_TRACKER_WAVE3_UPGRADES } from "@/data/policy-tracker-wave3-upgrades";
import { POLICY_TRACKER_WAVE4_UPGRADES } from "@/data/policy-tracker-wave4-upgrades";
import { POLICY_TRACKER_WAVE5_UPGRADES } from "@/data/policy-tracker-wave5-upgrades";
import { POLICY_TRACKER_WAVE6_UPGRADES } from "@/data/policy-tracker-wave6-upgrades";
import { POLICY_TRACKER_WAVE7_UPGRADES } from "@/data/policy-tracker-wave7-upgrades";
import { POLICY_TRACKER_WAVE8_UPGRADES } from "@/data/policy-tracker-wave8-upgrades";
import { POLICY_TRACKER_WAVE9_UPGRADES } from "@/data/policy-tracker-wave9-upgrades";
import { POLICY_TRACKER_WAVE10_UPGRADES } from "@/data/policy-tracker-wave10-upgrades";
import { POLICY_TRACKER_WAVE11_UPGRADES } from "@/data/policy-tracker-wave11-upgrades";
import { POLICY_TRACKER_WAVE12_UPGRADES } from "@/data/policy-tracker-wave12-upgrades";
import { POLICY_TRACKER_WAVE13_UPGRADES } from "@/data/policy-tracker-wave13-upgrades";
import { POLICY_TRACKER_WAVE14_UPGRADES } from "@/data/policy-tracker-wave14-upgrades";
import { POLICY_TRACKER_WAVE15_UPGRADES } from "@/data/policy-tracker-wave15-upgrades";
import { POLICY_TRACKER_WAVE16_UPGRADES } from "@/data/policy-tracker-wave16-upgrades";

const BASE_POLICY_TRACKERS = [
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
  ...POLICY_TRACKERS_WAVE11,
  ...POLICY_TRACKERS_WAVE12,
  ...POLICY_TRACKERS_WAVE13,
  ...POLICY_TRACKERS_WAVE14,
  ...POLICY_TRACKERS_WAVE15,
  ...POLICY_TRACKERS_WAVE16,
  ...POLICY_TRACKERS_WAVE17,
];

export const ALL_POLICY_TRACKERS = BASE_POLICY_TRACKERS.map(
  (tracker) => POLICY_TRACKER_WAVE16_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE15_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE14_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE13_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE12_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE11_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE10_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE9_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE8_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE7_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE6_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE5_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE4_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE3_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_WAVE2_UPGRADES[tracker.slug]
    ?? POLICY_TRACKER_UPGRADES[tracker.slug]
    ?? tracker,
);

export const ALL_POLICY_TRACKER_SLUGS = ALL_POLICY_TRACKERS.map((tracker) => tracker.slug);

export function getAnyPolicyTracker(slug: string) {
  return ALL_POLICY_TRACKERS.find((tracker) => tracker.slug === slug);
}
