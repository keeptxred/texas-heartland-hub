import { createFileRoute, notFound } from "@tanstack/react-router";
import { PillarArticle, buildPillarHead } from "@/components/pillar-article";
import { TEXAS_PILLARS } from "@/data/texas-pillars";

export const Route = createFileRoute("/texas/$slug")({
  loader: ({ params }) => {
    const pillar = TEXAS_PILLARS[params.slug];
    if (!pillar) throw notFound();
    return pillar;
  },
  head: ({ loaderData }) => (loaderData ? buildPillarHead(loaderData) : {}),
  component: PillarRoute,
});

function PillarRoute() {
  const pillar = Route.useLoaderData();
  return <PillarArticle {...pillar} />;
}