import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE3.find((item) => item.slug === "agriculture-family-farms")!;

export const Route = createFileRoute("/policy/agriculture-family-farms")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
