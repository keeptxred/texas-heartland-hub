import { createFileRoute } from "@tanstack/react-router";
import { SpringCollectionLanding } from "@/components/explore/SpringCollectionLanding";
import { getMajorSpringCollectionDestinations, getMajorSpringDiscoveryCollection } from "@/data/explore/collections.major-springs";
import { buildSeo } from "@/lib/seo";

const collectionId = "spring-conservation-and-education";
const canonicalPath = "/explore/spring-conservation-and-education";

export const Route = createFileRoute("/explore/spring-conservation-and-education")({
  loader: () => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);
    if (!collection) throw new Error("Spring conservation collection is unavailable");
    return { collection, items: getMajorSpringCollectionDestinations(collectionId) };
  },
  head: () => {
    const seo = buildSeo({
      title: "Texas Spring Conservation & Education | Visitor Guides",
      description: "Visit Texas destinations interpreting spring ecosystems, aquifers, protected species, historic water resources, and freshwater conservation.",
      path: canonicalPath,
      type: "website",
      keywords: "Texas spring conservation, aquifer education Texas, freshwater ecology Texas, protected springs Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <SpringCollectionLanding {...data} canonicalPath={canonicalPath} />;
}
