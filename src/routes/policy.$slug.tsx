import { createFileRoute, notFound } from "@tanstack/react-router";
import { getAnyPolicyTracker } from "@/data/policy-trackers-all";
import { PolicyTrackerPage, policyTrackerHead } from "@/components/policy-tracker-page";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";

export const Route = createFileRoute("/policy/$slug")({
  loader: ({ params }) => {
    const tracker = getAnyPolicyTracker(params.slug);
    if (!tracker) throw notFound();
    return { tracker };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.tracker) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = policyTrackerHead(loaderData.tracker);
    const robots = isPolicyTrackerIndexable(loaderData.tracker)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: PolicyTrackerRoute,
});

function PolicyTrackerRoute() {
  const { tracker } = Route.useLoaderData();
  return <PolicyTrackerPage tracker={tracker} />;
}
