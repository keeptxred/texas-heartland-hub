import { createFileRoute, notFound } from "@tanstack/react-router";
import { CountyAuthorityPage } from "@/components/explore/CountyAuthorityPage";
import { geographyPath } from "@/lib/explore/geography-pages";
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
      title: `${loaderData.name} County, Texas: Taxes, Schools, Elections & Attractions`,
      description: `Explore ${loaderData.name} County, Texas, including property taxes, school districts, legislative representation, cities, parks, attractions, election information, and local news.`,
      path: geographyPath("county", loaderData.name),
      type: "website",
      keywords: `${loaderData.name} County Texas, ${loaderData.name} County property taxes, ${loaderData.name} County schools, ${loaderData.name} County representatives, ${loaderData.name} County elections, ${loaderData.name} County attractions`,
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: () => <CountyAuthorityPage data={Route.useLoaderData()} />,
});
