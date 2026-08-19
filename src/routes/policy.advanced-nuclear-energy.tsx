import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE5.find((item) => item.slug === "advanced-nuclear-energy")!;

export const Route = createFileRoute("/policy/advanced-nuclear-energy")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
