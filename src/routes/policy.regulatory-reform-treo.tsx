import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE8.find((item) => item.slug === "regulatory-reform-treo")!;

export const Route = createFileRoute("/policy/regulatory-reform-treo")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
