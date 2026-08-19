import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE6.find((item) => item.slug === "higher-education-dei")!;

export const Route = createFileRoute("/policy/higher-education-dei")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
