import { exploreDestinations } from "./all-destinations";

export type MajorSpringDiscoveryCollectionId =
  | "major-texas-springs"
  | "spring-fed-swimming"
  | "hill-country-springs"
  | "spring-conservation-and-education";

export type MajorSpringDiscoveryCollection = {
  id: MajorSpringDiscoveryCollectionId;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: readonly string[];
  searchTerms: readonly string[];
  region: string | null;
  experience: "all" | "swimming" | "conservation-and-education";
};

const statewideSpringSlugs = [
  "balmorhea-state-park",
  "barton-springs-pool",
  "san-marcos-springs-spring-lake",
  "jacobs-well-natural-area",
  "hancock-springs-park",
  "blue-hole-regional-park",
  "krause-springs",
  "las-moras-springs-fort-clark",
] as const;

const springFedSwimmingSlugs = [
  "balmorhea-state-park",
  "barton-springs-pool",
  "hancock-springs-park",
  "blue-hole-regional-park",
  "krause-springs",
  "las-moras-springs-fort-clark",
] as const;

const hillCountrySpringSlugs = [
  "barton-springs-pool",
  "san-marcos-springs-spring-lake",
  "jacobs-well-natural-area",
  "hancock-springs-park",
  "blue-hole-regional-park",
  "krause-springs",
] as const;

const conservationAndEducationSlugs = [
  "balmorhea-state-park",
  "barton-springs-pool",
  "san-marcos-springs-spring-lake",
  "jacobs-well-natural-area",
  "blue-hole-regional-park",
  "las-moras-springs-fort-clark",
] as const;

export const majorSpringDiscoveryCollections: readonly MajorSpringDiscoveryCollection[] = [
  {
    id: "major-texas-springs",
    slug: "major-texas-springs",
    title: "Major Springs Across Texas",
    description:
      "Discover significant Texas spring systems, spring-fed pools, protected headwaters, and natural recreation destinations from West Texas to the Hill Country and South Texas.",
    destinationSlugs: statewideSpringSlugs,
    searchTerms: ["texas springs", "spring-fed destinations", "natural springs", "freshwater springs"],
    region: null,
    experience: "all",
  },
  {
    id: "spring-fed-swimming",
    slug: "spring-fed-swimming",
    title: "Spring-Fed Swimming in Texas",
    description:
      "Find established Texas destinations where visitors can swim in naturally spring-fed water, subject to current operating conditions, admission rules, and seasonal access requirements.",
    destinationSlugs: springFedSwimmingSlugs,
    searchTerms: ["spring-fed swimming", "natural swimming pool", "texas swimming holes", "clear water swimming"],
    region: null,
    experience: "swimming",
  },
  {
    id: "hill-country-springs",
    slug: "hill-country-springs",
    title: "Hill Country Springs",
    description:
      "Explore aquifer-fed pools, creek swimming areas, river headwaters, municipal parks, and privately managed spring destinations across Central Texas and the Hill Country.",
    destinationSlugs: hillCountrySpringSlugs,
    searchTerms: ["hill country springs", "edwards aquifer", "central texas springs", "spring-fed pools"],
    region: "Hill Country",
    experience: "all",
  },
  {
    id: "spring-conservation-and-education",
    slug: "spring-conservation-and-education",
    title: "Spring Conservation and Education",
    description:
      "Visit Texas destinations that interpret sensitive spring ecosystems, protected species, aquifers, historic water resources, and freshwater conservation through public programs and managed access.",
    destinationSlugs: conservationAndEducationSlugs,
    searchTerms: ["spring conservation", "aquifer education", "freshwater ecology", "protected spring habitat"],
    region: null,
    experience: "conservation-and-education",
  },
] as const;

const majorSpringCollectionById = new Map(
  majorSpringDiscoveryCollections.map((collection) => [collection.id, collection]),
);

const majorSpringCollectionBySlug = new Map(
  majorSpringDiscoveryCollections.map((collection) => [collection.slug, collection]),
);

const destinationBySlug = new Map(
  exploreDestinations.map((destination) => [destination.slug, destination]),
);

export function getMajorSpringDiscoveryCollection(
  idOrSlug: string,
): MajorSpringDiscoveryCollection | null {
  return majorSpringCollectionById.get(idOrSlug as MajorSpringDiscoveryCollectionId) ??
    majorSpringCollectionBySlug.get(idOrSlug) ??
    null;
}

export function getMajorSpringCollectionDestinations(idOrSlug: string) {
  const collection = getMajorSpringDiscoveryCollection(idOrSlug);
  if (!collection) return [];

  return collection.destinationSlugs.flatMap((slug) => {
    const destination = destinationBySlug.get(slug);
    return destination ? [destination] : [];
  });
}
