import { createFileRoute, notFound } from "@tanstack/react-router";
import { GeographyLanding } from "@/components/explore/GeographyLanding";
import { geographyPath, geographySummary } from "@/lib/explore/geography-pages";
import { buildSeo } from "@/lib/seo";
import { getExploreGeography } from "@/services/explore/public.functions";

export const Route = createFileRoute("/explore/region/$region")({
  loader: async ({ params }) => {
    const data = await getExploreGeography({ data: { kind: "region", slug: params.region } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = buildSeo({
      title: `${loaderData.name} Texas Travel Guide & Things to Do`,
      description: geographySummary("region", loaderData.name, loaderData.items),
      path: geographyPath("region", loaderData.name),
      type: "website",
      keywords: `${loaderData.name} Texas travel, things to do in ${loaderData.name}, ${loaderData.name} attractions`,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: () => <GeographyLanding data={Route.useLoaderData()} />,
});
