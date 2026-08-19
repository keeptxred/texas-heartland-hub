import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE6.find((item) => item.slug === "china-investment-restrictions")!;

export const Route = createFileRoute("/policy/china-investment-restrictions")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
