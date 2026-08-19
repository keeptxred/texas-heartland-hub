import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTexasCasePosition } from "@/data/texas-case-all";
import { TexasCasePositionPage, texasCasePositionHead } from "@/components/texas-case-position-page";

export const Route = createFileRoute("/texas-case/$slug")({
  loader: ({ params }) => {
    const position = getTexasCasePosition(params.slug);
    if (!position) throw notFound();
    return { position };
  },
  head: ({ loaderData }) => loaderData?.position ? texasCasePositionHead(loaderData.position) : {},
  component: TexasCasePositionRoute,
});

function TexasCasePositionRoute() {
  const { position } = Route.useLoaderData();
  return <TexasCasePositionPage position={position} />;
}
