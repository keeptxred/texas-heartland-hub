import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE3[0];

export const Route = createFileRoute("/policy/medical-freedom")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
