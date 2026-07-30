import { createFileRoute } from "@tanstack/react-router";
import { SpringCollectionLanding } from "@/components/explore/SpringCollectionLanding";
import { getMajorSpringCollectionDestinations, getMajorSpringDiscoveryCollection } from "@/data/explore/collections.major-springs";
import { buildSeo } from "@/lib/seo";

const collectionId = "hill-country-springs";
const canonicalPath = "/explore/hill-country-springs";

export const Route = createFileRoute("/explore/hill-country-springs")({
  loader: () => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);
    if (!collection) throw new Error("Hill Country springs collection is unavailable");
    return { collection, items: getMajorSpringCollectionDestinations(collectionId) };
  },
  head: () => {
    const seo = buildSeo({
      title: "Hill Country Springs | Swimming, Parks & Visitor Guides",
      description: "Explore Hill Country springs, spring-fed pools, swimming areas, protected headwaters, maps, access guidance, and official visitor resources.",
      path: canonicalPath,
      type: "website",
      keywords: "Hill Country springs, Central Texas springs, Edwards Aquifer springs, spring-fed pools Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <SpringCollectionLanding {...data} canonicalPath={canonicalPath} />;
}
