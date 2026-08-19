import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE13 } from "@/data/policy-trackers-wave13";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE13.find((item) => item.slug === "charter-schools")!;

export const Route = createFileRoute("/policy/charter-schools")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
