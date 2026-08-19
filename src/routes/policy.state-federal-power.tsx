import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE4.find((item) => item.slug === "state-federal-power")!;

export const Route = createFileRoute("/policy/state-federal-power")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
