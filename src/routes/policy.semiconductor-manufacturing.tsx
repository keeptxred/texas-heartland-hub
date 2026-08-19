import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE8.find((item) => item.slug === "semiconductor-manufacturing")!;

export const Route = createFileRoute("/policy/semiconductor-manufacturing")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
