import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasDataSet } from "@/data/texas-data-catalog";
import { getAccountabilityDataSet } from "@/data/accountability-data-catalog";
import { TexasDataPage, texasDataHead } from "@/components/texas-data-page";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";

export const Route = createFileRoute("/data/$slug")({
  loader: ({ params }) => {
    const dataset = getTexasDataSet(params.slug) ?? getAccountabilityDataSet(params.slug);
    if (!dataset) throw notFound();
    return { dataset };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.dataset) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = texasDataHead(loaderData.dataset);
    const robots = isDataDetailIndexable(loaderData.dataset)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: TexasDataRoute,
});

function TexasDataRoute() {
  const { dataset } = Route.useLoaderData();
  return <TexasDataPage dataset={dataset} />;
}
