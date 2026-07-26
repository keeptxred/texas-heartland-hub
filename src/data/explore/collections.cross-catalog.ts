import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";

export type CrossCatalogDiscoveryCollectionId =
  | "texas-natural-wonders"
  | "guided-texas-wonders"
  | "spring-fed-escapes"
  | "unusual-texas-landmarks"
  | "overnight-nature-and-culture";

export type CrossCatalogDiscoveryCollection = {
  id: CrossCatalogDiscoveryCollectionId;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: readonly string[];
  searchTerms: readonly string[];
  experienceTypes: readonly string[];
  regions: readonly string[];
};

export type CrossCatalogCollectionDiagnostic = {
  collectionId: CrossCatalogDiscoveryCollectionId;
  missingDestinationSlugs: readonly string[];
  duplicateDestinationSlugs: readonly string[];
};

export const crossCatalogDiscoveryCollections: readonly CrossCatalogDiscoveryCollection[] = [
  {
    id: "texas-natural-wonders",
    slug: "texas-natural-wonders",
    title: "Texas Natural Wonders",
    description:
      "Explore underground caverns, spring-fed swimming destinations, protected canyons, restored ranch landscapes, and dramatic river bluffs across Texas.",
    destinationSlugs: [
      "natural-bridge-caverns",
      "caverns-of-sonora",
      "barton-springs-pool",
      "balmorhea-state-park",
      "westcave-preserve",
      "selah-bamberger-ranch-preserve",
      "chalk-bluff-river-resort",
    ],
    searchTerms: [
      "Texas natural wonders",
      "Texas caverns and springs",
      "Texas scenic nature destinations",
      "unique outdoor places in Texas",
    ],
    experienceTypes: ["caverns", "springs", "nature preserves", "river recreation"],
    regions: ["Hill Country", "West Texas", "South Texas"],
  },
  {
    id: "guided-texas-wonders",
    slug: "guided-texas-wonders",
    title: "Guided Texas Wonders",
    description:
      "Discover sensitive caves, conservation preserves, environmental education sites, and architectural attractions through guided tours or scheduled visitor programs.",
    destinationSlugs: [
      "natural-bridge-caverns",
      "inner-space-cavern",
      "caverns-of-sonora",
      "westcave-preserve",
      "selah-bamberger-ranch-preserve",
      "san-marcos-springs-spring-lake",
      "newmans-castle",
    ],
    searchTerms: [
      "guided Texas attractions",
      "Texas nature tours",
      "guided cavern tours",
      "reservation attractions Texas",
    ],
    experienceTypes: ["guided tours", "scheduled programs", "environmental education"],
    regions: ["Hill Country", "Central Texas", "Gulf Coast", "West Texas"],
  },
  {
    id: "spring-fed-escapes",
    slug: "spring-fed-escapes",
    title: "Spring-Fed Texas Escapes",
    description:
      "Find clear spring-fed pools, river swimming destinations, historic spring parks, and protected spring landscapes for cooling off or exploring Texas water ecology.",
    destinationSlugs: [
      "balmorhea-state-park",
      "barton-springs-pool",
      "hancock-springs-park",
      "blue-hole-regional-park",
      "krause-springs",
      "las-moras-springs-fort-clark",
      "chalk-bluff-river-resort",
    ],
    searchTerms: [
      "Texas spring swimming",
      "spring-fed pools Texas",
      "clear water Texas destinations",
      "Texas summer swimming escapes",
    ],
    experienceTypes: ["swimming", "springs", "river recreation"],
    regions: ["Hill Country", "West Texas", "Central Texas", "South Texas"],
  },
  {
    id: "unusual-texas-landmarks",
    slug: "unusual-texas-landmarks",
    title: "Unusual Texas Landmarks",
    description:
      "Visit participatory roadside art, a privately built castle, underground attractions, and distinctive natural sites that reflect Texas creativity and character.",
    destinationSlugs: [
      "cadillac-ranch",
      "newmans-castle",
      "wonder-world-cave-adventure-park",
      "cave-without-a-name",
      "westcave-preserve",
    ],
    searchTerms: [
      "weird Texas attractions",
      "unusual Texas landmarks",
      "Texas roadside attractions",
      "unique places to visit in Texas",
    ],
    experienceTypes: ["public art", "architecture", "caverns", "nature preserves"],
    regions: ["Panhandle", "Gulf Coast", "Hill Country", "Central Texas"],
  },
  {
    id: "overnight-nature-and-culture",
    slug: "overnight-nature-and-culture",
    title: "Overnight Nature and Culture Escapes",
    description:
      "Plan overnight stays at privately operated river, spring, cave, and cultural destinations offering camping, cabins, rooms, or destination lodging.",
    destinationSlugs: [
      "chalk-bluff-river-resort",
      "krause-springs",
      "newmans-castle",
      "caverns-of-sonora",
      "cascade-caverns",
    ],
    searchTerms: [
      "Texas overnight attractions",
      "camping near Texas natural attractions",
      "Texas nature getaway",
      "unique overnight stays Texas",
    ],
    experienceTypes: ["camping", "cabins", "overnight stays", "destination lodging"],
    regions: ["Hill Country", "South Texas", "Gulf Coast", "West Texas"],
  },
] as const;

const collectionById = new Map(
  crossCatalogDiscoveryCollections.map((collection) => [collection.id, collection]),
);

const collectionBySlug = new Map(
  crossCatalogDiscoveryCollections.map((collection) => [collection.slug, collection]),
);

const destinationBySlug = new Map(
  exploreDestinations.map((destination) => [destination.slug, destination]),
);

function duplicateValues(values: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort((a, b) => a.localeCompare(b));
}

export function getCrossCatalogDiscoveryCollection(
  idOrSlug: string,
): CrossCatalogDiscoveryCollection | null {
  return collectionById.get(idOrSlug as CrossCatalogDiscoveryCollectionId) ??
    collectionBySlug.get(idOrSlug) ??
    null;
}

export function getCrossCatalogCollectionDestinations(idOrSlug: string): ExploreEntity[] {
  const collection = getCrossCatalogDiscoveryCollection(idOrSlug);
  if (!collection) return [];

  return collection.destinationSlugs.flatMap((slug) => {
    const destination = destinationBySlug.get(slug);
    return destination ? [destination] : [];
  });
}

export function getCrossCatalogCollectionDiagnostic(
  idOrSlug: string,
): CrossCatalogCollectionDiagnostic | null {
  const collection = getCrossCatalogDiscoveryCollection(idOrSlug);
  if (!collection) return null;

  return {
    collectionId: collection.id,
    missingDestinationSlugs: collection.destinationSlugs
      .filter((slug) => !destinationBySlug.has(slug))
      .sort((a, b) => a.localeCompare(b)),
    duplicateDestinationSlugs: duplicateValues(collection.destinationSlugs),
  };
}

export const crossCatalogCollectionDiagnostics: readonly CrossCatalogCollectionDiagnostic[] =
  crossCatalogDiscoveryCollections.map((collection) => {
    const diagnostic = getCrossCatalogCollectionDiagnostic(collection.id);
    if (!diagnostic) {
      throw new Error(`Missing cross-catalog collection diagnostic: ${collection.id}`);
    }
    return diagnostic;
  });
