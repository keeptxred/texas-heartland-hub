import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE9.find((item) => item.slug === "minor-gender-transition-medical-law")!;

export const Route = createFileRoute("/policy/minor-gender-transition-medical-law")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
