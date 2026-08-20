import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPoliticalSearchGuide } from "@/data/political-search-guides";
import { PoliticalSearchGuidePage, politicalSearchGuideHead } from "@/components/political-search-guide-page";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";

export const Route = createFileRoute("/texas-political-reference/$slug")({
  loader: ({ params }) => {
    const guide = getPoliticalSearchGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.guide) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = politicalSearchGuideHead(loaderData.guide);
    const robots = isPoliticalReferenceIndexable(loaderData.guide)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: PoliticalReferenceDetailRoute,
});

function PoliticalReferenceDetailRoute() {
  const { guide } = Route.useLoaderData();
  return <PoliticalSearchGuidePage guide={guide} />;
}
