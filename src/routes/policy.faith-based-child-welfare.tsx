import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE12 } from "@/data/policy-trackers-wave12";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE12.find((item) => item.slug === "faith-based-child-welfare")!;

export const Route = createFileRoute("/policy/faith-based-child-welfare")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
