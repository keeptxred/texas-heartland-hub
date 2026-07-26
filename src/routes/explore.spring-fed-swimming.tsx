import { createFileRoute } from "@tanstack/react-router";
import { SpringCollectionLanding } from "@/components/explore/SpringCollectionLanding";
import {
  getMajorSpringCollectionDestinations,
  getMajorSpringDiscoveryCollection,
} from "@/data/explore/collections.major-springs";
import { buildSeo } from "@/lib/seo";

const collectionId = "spring-fed-swimming";
const canonicalPath = "/explore/spring-fed-swimming";

export const Route = createFileRoute("/explore/spring-fed-swimming")({
  loader: () => {
    const collection = getMajorSpringDiscoveryCollection(collectionId);
    if (!collection) throw new Error("Spring-fed swimming collection is unavailable");
    return { collection, items: getMajorSpringCollectionDestinations(collectionId) };
  },
  head: () => {
    const seo = buildSeo({
      title: "Spring-Fed Swimming in Texas | Pools, Springs & Visitor Guides",
      description:
        "Find Texas spring-fed swimming destinations with visitor guides, access rules, reservations, maps, nearby attractions, and official operating information.",
      path: canonicalPath,
      type: "website",
      keywords:
        "spring-fed swimming Texas, Texas swimming holes, natural pools Texas, clear water swimming Texas",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <SpringCollectionLanding {...data} canonicalPath={canonicalPath} />;
}
