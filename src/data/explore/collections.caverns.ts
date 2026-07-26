import { exploreDestinations } from "./all-destinations";

export type CavernDiscoveryCollectionId =
  | "texas-caverns"
  | "hill-country-caverns"
  | "family-cavern-adventures"
  | "texas-state-park-caverns";

export type CavernDiscoveryCollection = {
  id: CavernDiscoveryCollectionId;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: readonly string[];
  searchTerms: readonly string[];
  region: string | null;
  audience: "all-visitors" | "families";
  ownershipScope: "all" | "commercial" | "public-state-managed";
};

const commercialCavernSlugs = [
  "natural-bridge-caverns",
  "inner-space-cavern",
  "caverns-of-sonora",
  "cave-without-a-name",
  "cascade-caverns",
  "wonder-world-cave-adventure-park",
] as const;

const tpwdCavernSlugs = [
  "longhorn-cavern-state-park",
  "kickapoo-cavern-state-park",
  "gorman-cave",
  "devils-sinkhole-state-natural-area",
] as const;

const guidedPreserveCavernSlugs = ["westcave-preserve"] as const;

const hillCountryCavernSlugs = [
  "natural-bridge-caverns",
  "inner-space-cavern",
  "cave-without-a-name",
  "cascade-caverns",
  "wonder-world-cave-adventure-park",
  "longhorn-cavern-state-park",
] as const;

export const cavernDiscoveryCollections: readonly CavernDiscoveryCollection[] = [
  {
    id: "texas-caverns",
    slug: "texas-caverns",
    title: "Caverns and Caves Across Texas",
    description:
      "Discover guided show caves, crystal-filled caverns, fault caves, and state-park underground tours across Texas.",
    destinationSlugs: [...commercialCavernSlugs, ...tpwdCavernSlugs, ...guidedPreserveCavernSlugs],
    searchTerms: ["cavern", "cave", "guided cave tour", "underground tour"],
    region: null,
    audience: "all-visitors",
    ownershipScope: "all",
  },
  {
    id: "hill-country-caverns",
    slug: "hill-country-caverns",
    title: "Hill Country Caverns",
    description:
      "Explore limestone caverns and guided underground attractions throughout the Texas Hill Country.",
    destinationSlugs: hillCountryCavernSlugs,
    searchTerms: ["hill country", "limestone cavern", "show cave", "guided cave tour"],
    region: "Hill Country",
    audience: "all-visitors",
    ownershipScope: "all",
  },
  {
    id: "family-cavern-adventures",
    slug: "family-cavern-adventures",
    title: "Family Cavern Adventures",
    description:
      "Plan a family underground adventure with guided tours, geology interpretation, and visitor facilities at established Texas cavern destinations.",
    destinationSlugs: commercialCavernSlugs,
    searchTerms: ["family attraction", "family adventure", "guided cavern tours", "geology"],
    region: null,
    audience: "families",
    ownershipScope: "commercial",
  },
  {
    id: "texas-state-park-caverns",
    slug: "texas-state-park-caverns",
    title: "Texas State Park Caverns",
    description:
      "Visit Texas Parks and Wildlife Department destinations that protect significant cavern resources and offer managed public experiences.",
    destinationSlugs: tpwdCavernSlugs,
    searchTerms: ["state park", "cavern", "texas parks and wildlife department"],
    region: null,
    audience: "all-visitors",
    ownershipScope: "public-state-managed",
  },
] as const;

const cavernCollectionById = new Map(
  cavernDiscoveryCollections.map((collection) => [collection.id, collection]),
);

const cavernCollectionBySlug = new Map(
  cavernDiscoveryCollections.map((collection) => [collection.slug, collection]),
);

const destinationBySlug = new Map(
  exploreDestinations.map((destination) => [destination.slug, destination]),
);

export function getCavernDiscoveryCollection(idOrSlug: string): CavernDiscoveryCollection | null {
  return (
    cavernCollectionById.get(idOrSlug as CavernDiscoveryCollectionId) ??
    cavernCollectionBySlug.get(idOrSlug) ??
    null
  );
}

export function getCavernCollectionDestinations(idOrSlug: string) {
  const collection = getCavernDiscoveryCollection(idOrSlug);
  if (!collection) return [];

  return collection.destinationSlugs.flatMap((slug) => {
    const destination = destinationBySlug.get(slug);
    return destination ? [destination] : [];
  });
}
