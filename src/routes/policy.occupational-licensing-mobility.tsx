import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE7 } from "@/data/policy-trackers-wave7";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE7.find((item) => item.slug === "occupational-licensing-mobility")!;

export const Route = createFileRoute("/policy/occupational-licensing-mobility")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
