import { createFileRoute, notFound } from "@tanstack/react-router";
import { GeographyLanding } from "@/components/explore/GeographyLanding";
import { geographyPath, geographySummary } from "@/lib/explore/geography-pages";
import { buildSeo } from "@/lib/seo";
import { getExploreGeography } from "@/services/explore/public.functions";

export const Route = createFileRoute("/explore/county/$county")({
  loader: async ({ params }) => {
    const data = await getExploreGeography({ data: { kind: "county", slug: params.county } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = buildSeo({
      title: `${loaderData.name} County Texas Attractions & Things to Do`,
      description: geographySummary("county", loaderData.name, loaderData.items),
      path: geographyPath("county", loaderData.name),
      type: "website",
      keywords: `${loaderData.name} County attractions, things to do in ${loaderData.name} County Texas, ${loaderData.name} County parks`,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: () => <GeographyLanding data={Route.useLoaderData()} />,
});
