import type { PolicyTracker } from "@/data/policy-trackers";
import { POLICY_TRACKER_WAVE18_UPGRADES } from "@/data/policy-tracker-wave18-upgrades";

const water = POLICY_TRACKER_WAVE18_UPGRADES["water"];
if (!water) throw new Error("Missing wave18 water tracker");

const waterReady: PolicyTracker = {
  ...water,
  currentStatus:
    "The central long-term question is whether Texas can build and finance enough dependable water infrastructure while respecting existing water rights, local control, property rights, and regional differences. KTR tracks planned supply separately from permitted, financed, constructed, and operating capacity so project announcements do not substitute for water actually available during drought.",
};

export const POLICY_TRACKER_WAVE18_READY: Record<string, PolicyTracker> = {
  ...POLICY_TRACKER_WAVE18_UPGRADES,
  [waterReady.slug]: waterReady,
};

export const WAVE18_READY_POLICY_TRACKER_SLUGS = Object.keys(POLICY_TRACKER_WAVE18_READY);
