import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPolicyTracker } from "@/data/policy-trackers";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";

export const Route = createFileRoute("/policy/$slug")({
  loader: ({ params }) => {
    const tracker = getPolicyTracker(params.slug);
    if (!tracker) throw notFound();
    return { tracker };
  },
  head: ({ loaderData }) => loaderData?.tracker ? policyTrackerHead(loaderData.tracker) : {},
  component: PolicyTrackerRoute,
});

function PolicyTrackerRoute() {
  const { tracker } = Route.useLoaderData();
  return <PolicyTrackerPage tracker={tracker} />;
}
