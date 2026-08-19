import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasCaseFacts } from "@/data/texas-case-facts";
import { TexasCaseFactsPage, texasCaseFactsHead } from "@/components/texas-case-facts-page";

export const Route = createFileRoute("/texas-case/facts/$slug")({
  loader: ({ params }) => {
    const facts = getTexasCaseFacts(params.slug);
    if (!facts) throw notFound();
    return { facts };
  },
  head: ({ loaderData }) => loaderData?.facts ? texasCaseFactsHead(loaderData.facts) : {},
  component: TexasCaseFactsRoute,
});

function TexasCaseFactsRoute() {
  const { facts } = Route.useLoaderData();
  return <TexasCaseFactsPage facts={facts} />;
}
