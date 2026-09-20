import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE9.find((item) => item.slug === "local-preemption-regulatory-consistency")!;

export const Route = createFileRoute("/policy/local-preemption-regulatory-consistency")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
