import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasDataSet } from "@/data/texas-data-catalog";
import { getAccountabilityDataSet } from "@/data/accountability-data-catalog";
import { TexasDataPage, texasDataHead } from "@/components/texas-data-page";

export const Route = createFileRoute("/data/$slug")({
  loader: ({ params }) => {
    const dataset = getTexasDataSet(params.slug) ?? getAccountabilityDataSet(params.slug);
    if (!dataset) throw notFound();
    return { dataset };
  },
  head: ({ loaderData }) => loaderData?.dataset ? texasDataHead(loaderData.dataset) : {},
  component: TexasDataRoute,
});

function TexasDataRoute() {
  const { dataset } = Route.useLoaderData();
  return <TexasDataPage dataset={dataset} />;
}
