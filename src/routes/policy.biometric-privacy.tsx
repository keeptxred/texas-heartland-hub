import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE15 } from "@/data/policy-trackers-wave15";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE15.find((item) => item.slug === "biometric-privacy")!;

export const Route = createFileRoute("/policy/biometric-privacy")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
