import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE5.find((item) => item.slug === "womens-sports")!;

export const Route = createFileRoute("/policy/womens-sports")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
