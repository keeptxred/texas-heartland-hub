import { createFileRoute } from "@tanstack/react-router";
import { getWave2PolicyTracker } from "@/data/policy-trackers-wave2";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = getWave2PolicyTracker("bitcoin-reserve")!;

export const Route = createFileRoute("/policy/bitcoin-reserve")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
