import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE11 } from "@/data/policy-trackers-wave11";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE11.find((item) => item.slug === "constitutional-tax-protections")!;

export const Route = createFileRoute("/policy/constitutional-tax-protections")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
