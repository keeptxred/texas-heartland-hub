import { createFileRoute } from "@tanstack/react-router";
import { getWave2PolicyTracker } from "@/data/policy-trackers-wave2";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = getWave2PolicyTracker("parental-rights")!;

export const Route = createFileRoute("/policy/parental-rights")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
