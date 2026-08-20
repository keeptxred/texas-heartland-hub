import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasCaseFacts } from "@/data/texas-case-facts";
import { TexasCaseFactsPage, texasCaseFactsHead } from "@/components/texas-case-facts-page";
import { isTexasCaseFactsIndexable } from "@/lib/case-agency-indexability";

export const Route = createFileRoute("/texas-case/facts/$slug")({
  loader: ({ params }) => {
    const facts = getTexasCaseFacts(params.slug);
    if (!facts) throw notFound();
    return { facts };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.facts) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = texasCaseFactsHead(loaderData.facts);
    const robots = isTexasCaseFactsIndexable(loaderData.facts)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: TexasCaseFactsRoute,
});

function TexasCaseFactsRoute() {
  const { facts } = Route.useLoaderData();
  return <TexasCaseFactsPage facts={facts} />;
}
