import { createFileRoute, notFound } from "@tanstack/react-router";
import { CornerstoneGuidePage, cornerstoneGuideHead } from "@/components/cornerstone-guide-page";
import { ALL_GUIDES } from "@/data/all-guides";
import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }): CornerstoneGuide => {
    const guide = ALL_GUIDES[params.slug];
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => loaderData
    ? cornerstoneGuideHead(loaderData)
    : { meta: [{ title: "Guide not found — Keep TX Red" }, { name: "robots", content: "noindex,follow" }] },
  component: GuideRoute,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Guide Not Found</h1>
      <p className="mt-3 text-muted-foreground">That Keep TX Red guide is not available.</p>
      <a href="/topics" className="mt-6 inline-block text-primary underline">Browse content pillars</a>
    </div>
  ),
});

function GuideRoute() {
  return <CornerstoneGuidePage guide={Route.useLoaderData()} />;
}
