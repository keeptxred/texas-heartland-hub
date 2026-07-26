import type { ExploreEntity } from "@/types/explore/public";

export type CatalogSeed = {
  name: string;
  entityType: string;
  collection: string;
  sourceUrl: string;
  sourceName: string;
  categories: string[];
};

function slugify(value: string): string {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function catalogDestination(seed: CatalogSeed): ExploreEntity {
  const slug = slugify(seed.name);
  return {
    id: `catalog-${slug}`,
    entityType: seed.entityType,
    name: seed.name,
    slug,
    summary: `${seed.name} is part of the ${seed.collection} directory.`,
    description: `Use this Explore Texas page to discover ${seed.name}, plan a visit, and verify current hours, access, fees, reservations, conditions, and regulations with the official source before traveling.`,
    city: null,
    county: null,
    region: null,
    latitude: null,
    longitude: null,
    heroImageUrl: null,
    heroImageAlt: null,
    amenities: [],
    activities: seed.categories,
    isFamilyFriendly: null,
    isPetFriendly: null,
    isAccessible: null,
    feeRequired: null,
    alternateNames: [],
    officialUrl: seed.sourceUrl,
    phone: null,
    email: null,
    address: null,
    profile: { collection: seed.collection },
    hours: null,
    fees: null,
    regulations: null,
    seasonalGuidance: null,
    categories: seed.categories,
    tags: seed.categories,
    sourceUrl: seed.sourceUrl,
    sourceName: seed.sourceName,
    sourceUpdatedAt: null,
    updatedAt: "2026-07-25T00:00:00.000Z",
    observations: [],
    related: [],
    nearby: [],
  };
}
