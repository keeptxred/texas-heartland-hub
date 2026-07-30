import { createFileRoute } from "@tanstack/react-router";
import { SpringCollectionLanding } from "@/components/explore/SpringCollectionLanding";
import {
  getMajorSpringCollectionDestinations,
  getMajorSpringDiscoveryCollection,
} from "@/data/explore/collections.major-springs";
import { buildSeo } from "@/lib/seo";

const collectionId = "major-texas-springs";
const canonicalPath = "/explore/major-springs";

export const Route = createFileRoute("/explore/major-springs")({
  loader: () => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);
    if (!collection) throw new Error("Major Texas springs collection is unavailable");
    return { collection, items: getMajorSpringCollectionDestinations(collectionId) };
  },
  head: () => {
    const seo = buildSeo({
      title: "Major Texas Springs | Swimming, Parks & Visitor Guides",
      description:
        "Explore major Texas springs, spring-fed pools, protected headwaters, swimming destinations, parks, maps, access guidance, and official visitor resources.",
      path: canonicalPath,
      type: "website",
      keywords:
        "major Texas springs, natural springs Texas, spring-fed swimming Texas, Texas swimming holes, Texas springs map",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <SpringCollectionLanding {...data} canonicalPath={canonicalPath} />;
}
