import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE14 } from "@/data/policy-trackers-wave14";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE14.find((item) => item.slug === "consumer-data-privacy")!;

export const Route = createFileRoute("/policy/consumer-data-privacy")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
