import { exploreDestinations } from "./all-destinations";

export type PrivateNaturalLandmarkDiscoveryCollectionId =
  | "private-natural-landmarks"
  | "hill-country-private-preserves"
  | "guided-conservation-experiences"
  | "private-river-recreation";

export type PrivateNaturalLandmarkDiscoveryCollection = {
  id: PrivateNaturalLandmarkDiscoveryCollectionId;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: readonly string[];
  searchTerms: readonly string[];
  region: string | null;
  experience: "all" | "guided-conservation" | "river-recreation";
};

const statewidePrivateNaturalLandmarkSlugs = [
  "westcave-preserve",
  "chalk-bluff-river-resort",
  "selah-bamberger-ranch-preserve",
] as const;

const hillCountryPrivatePreserveSlugs = [
  "westcave-preserve",
  "selah-bamberger-ranch-preserve",
] as const;

const guidedConservationSlugs = [
  "westcave-preserve",
  "selah-bamberger-ranch-preserve",
] as const;

const privateRiverRecreationSlugs = ["chalk-bluff-river-resort"] as const;

export const privateNaturalLandmarkDiscoveryCollections: readonly PrivateNaturalLandmarkDiscoveryCollection[] = [
  {
    id: "private-natural-landmarks",
    slug: "private-natural-landmarks",
    title: "Private Natural Landmarks in Texas",
    description:
      "Discover privately managed preserves, restored ranch landscapes, river bluffs, and conservation destinations that provide authorized public visitor access.",
    destinationSlugs: statewidePrivateNaturalLandmarkSlugs,
    searchTerms: [
      "private natural landmarks",
      "private nature preserves",
      "Texas conservation destinations",
      "managed public access",
    ],
    region: null,
    experience: "all",
  },
  {
    id: "hill-country-private-preserves",
    slug: "hill-country-private-preserves",
    title: "Hill Country Private Preserves",
    description:
      "Explore privately protected Hill Country landscapes offering scheduled guided hikes, conservation programs, habitat restoration tours, and environmental education.",
    destinationSlugs: hillCountryPrivatePreserveSlugs,
    searchTerms: [
      "Hill Country nature preserves",
      "private preserve tours",
      "Texas habitat restoration",
      "guided conservation tours",
    ],
    region: "Hill Country",
    experience: "guided-conservation",
  },
  {
    id: "guided-conservation-experiences",
    slug: "guided-conservation-experiences",
    title: "Guided Conservation Experiences",
    description:
      "Visit sensitive privately protected landscapes through reservation-based tours, scheduled programs, workshops, and conservation-focused educational experiences.",
    destinationSlugs: guidedConservationSlugs,
    searchTerms: [
      "guided nature tours",
      "conservation education",
      "reservation nature preserve",
      "land stewardship tours",
    ],
    region: null,
    experience: "guided-conservation",
  },
  {
    id: "private-river-recreation",
    slug: "private-river-recreation",
    title: "Private River Recreation",
    description:
      "Find privately operated Texas river destinations providing paid day-use access, swimming, paddling, camping, and overnight accommodations.",
    destinationSlugs: privateRiverRecreationSlugs,
    searchTerms: [
      "private river parks",
      "Texas river swimming",
      "river camping",
      "private river access",
    ],
    region: null,
    experience: "river-recreation",
  },
] as const;

const collectionById = new Map(
  privateNaturalLandmarkDiscoveryCollections.map((collection) => [collection.id, collection]),
);

const collectionBySlug = new Map(
  privateNaturalLandmarkDiscoveryCollections.map((collection) => [collection.slug, collection]),
);

const destinationBySlug = new Map(
  exploreDestinations.map((destination) => [destination.slug, destination]),
);

export function getPrivateNaturalLandmarkDiscoveryCollection(
  idOrSlug: string,
): PrivateNaturalLandmarkDiscoveryCollection | null {
  return collectionById.get(idOrSlug as PrivateNaturalLandmarkDiscoveryCollectionId) ??
    collectionBySlug.get(idOrSlug) ??
    null;
}

export function getPrivateNaturalLandmarkCollectionDestinations(idOrSlug: string) {
  const collection = getPrivateNaturalLandmarkDiscoveryCollection(idOrSlug);
  if (!collection) return [];

  return collection.destinationSlugs.flatMap((slug) => {
    const destination = destinationBySlug.get(slug);
    return destination ? [destination] : [];
  });
}
