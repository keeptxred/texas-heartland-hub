import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE4.find((item) => item.slug === "right-to-work")!;

export const Route = createFileRoute("/policy/right-to-work")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
