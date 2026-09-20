import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE3.find((item) => item.slug === "esg-energy-boycotts")!;

export const Route = createFileRoute("/policy/esg-energy-boycotts")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
