import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE16 } from "@/data/policy-trackers-wave16";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE16.find((item) => item.slug === "scope-act-online-minors")!;

export const Route = createFileRoute("/policy/scope-act-online-minors")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
