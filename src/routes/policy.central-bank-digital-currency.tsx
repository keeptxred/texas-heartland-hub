import { createFileRoute } from "@tanstack/react-router";
import { getWave2PolicyTracker } from "@/data/policy-trackers-wave2";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = getWave2PolicyTracker("central-bank-digital-currency")!;

export const Route = createFileRoute("/policy/central-bank-digital-currency")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
