import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasCasePosition } from "@/data/texas-case-all";
import { TexasCasePositionPage, texasCasePositionHead } from "@/components/texas-case-position-page";
import { isTexasCasePositionIndexable } from "@/lib/case-agency-indexability";

export const Route = createFileRoute("/texas-case/$slug")({
  loader: ({ params }) => {
    const position = getTexasCasePosition(params.slug);
    if (!position) throw notFound();
    return { position };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.position) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const head = texasCasePositionHead(loaderData.position);
    const robots = isTexasCasePositionIndexable(loaderData.position)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      ...head,
      meta: head.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
    };
  },
  component: TexasCasePositionRoute,
});

function TexasCasePositionRoute() {
  const { position } = Route.useLoaderData();
  return <TexasCasePositionPage position={position} />;
}
