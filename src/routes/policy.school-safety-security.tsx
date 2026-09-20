import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE10 } from "@/data/policy-trackers-wave10";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE10.find((item) => item.slug === "school-safety-security")!;

export const Route = createFileRoute("/policy/school-safety-security")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
