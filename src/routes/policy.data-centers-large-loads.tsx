import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE11 } from "@/data/policy-trackers-wave11";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE11.find((item) => item.slug === "data-centers-large-loads")!;

export const Route = createFileRoute("/policy/data-centers-large-loads")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
