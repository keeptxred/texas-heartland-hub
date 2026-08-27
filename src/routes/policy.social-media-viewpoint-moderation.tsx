import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS_WAVE17 } from "@/data/policy-trackers-wave17";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

const tracker = POLICY_TRACKERS_WAVE17.find((item) => item.slug === "social-media-viewpoint-moderation")!;

export const Route = createFileRoute("/policy/social-media-viewpoint-moderation")({
  head: () => policyTrackerHead(tracker),
  component: () => <PolicyTrackerPage tracker={tracker} />,
});
