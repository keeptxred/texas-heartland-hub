import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPoliticalSearchGuide } from "@/data/political-search-guides";
import { PoliticalSearchGuidePage, politicalSearchGuideHead } from "@/components/political-search-guide-page";

export const Route = createFileRoute("/texas-political-reference/$slug")({
  loader: ({ params }) => {
    const guide = getPoliticalSearchGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => loaderData?.guide ? politicalSearchGuideHead(loaderData.guide) : {},
  component: PoliticalReferenceDetailRoute,
});

function PoliticalReferenceDetailRoute() {
  const { guide } = Route.useLoaderData();
  return <PoliticalSearchGuidePage guide={guide} />;
}
