import type { ExploreEntity, ExploreJsonObject } from "@/types/explore/public";
import { texasLighthouseCatalog, type TexasLighthouseRecord } from "./catalog.lighthouses";

function lighthouseProfile(lighthouse: TexasLighthouseRecord): ExploreJsonObject {
  return {
    collection: "Texas lighthouses",
    designation: "Lighthouse",
    ownership: lighthouse.ownership,
    operator: lighthouse.operator,
    publicAccess: lighthouse.accessModel === "public-interior" || lighthouse.accessModel === "public-exterior",
    accessModel: lighthouse.accessModel,
    accessNotes: lighthouse.accessNotes,
    towerAccess: lighthouse.towerAccess,
    maritimeContext: {
      coastalRegion: lighthouse.region,
      verificationStatus: "official-source-reviewed",
      lastReviewed: lighthouse.lastReviewed,
    },
  };
}

function lighthouseRegulations(lighthouse: TexasLighthouseRecord): ExploreJsonObject {
  return {
    accessModel: lighthouse.accessModel,
    towerAccess: lighthouse.towerAccess,
    privateProperty: lighthouse.accessModel === "view-only",
    reservationsRecommended: lighthouse.reservationsRecommended,
    accessNotes: lighthouse.accessNotes,
  };
}

function toLighthouseDestination(lighthouse: TexasLighthouseRecord): ExploreEntity {
  return {
    id: lighthouse.id,
    entityType: "lighthouse",
    name: lighthouse.name,
    slug: lighthouse.slug,
    summary: lighthouse.summary,
    city: lighthouse.city,
    county: lighthouse.county,
    region: lighthouse.region,
    latitude: lighthouse.latitude,
    longitude: lighthouse.longitude,
    heroImageUrl: null,
    heroImageAlt: `${lighthouse.name} on the Texas coast`,
    amenities: lighthouse.amenities,
    activities: lighthouse.activities,
    isFamilyFriendly: lighthouse.familyFriendly,
    isPetFriendly: lighthouse.petFriendly,
    isAccessible: lighthouse.accessible,
    feeRequired: lighthouse.admissionRequired,
    alternateNames: lighthouse.alternateNames,
    description: lighthouse.description,
    officialUrl: lighthouse.officialUrl,
    phone: null,
    email: null,
    address: null,
    profile: lighthouseProfile(lighthouse),
    hours: null,
    fees: {
      admissionRequired: lighthouse.admissionRequired,
      reservationsRecommended: lighthouse.reservationsRecommended,
    },
    regulations: lighthouseRegulations(lighthouse),
    seasonalGuidance: {
      confirmBeforeTravel: true,
      weatherDependent: true,
      reservationsRecommended: lighthouse.reservationsRecommended,
      verificationStatus: "official-source-reviewed",
      lastReviewed: lighthouse.lastReviewed,
    },
    categories: lighthouse.categories,
    tags: [...lighthouse.tags, "lighthouse", "texas lighthouse", "maritime heritage"],
    sourceUrl: lighthouse.officialUrl,
    sourceName: lighthouse.sourceName,
    sourceUpdatedAt: lighthouse.lastReviewed,
    updatedAt: `${lighthouse.lastReviewed}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  };
}

export const texasLighthouseDestinations: ExploreEntity[] =
  texasLighthouseCatalog.map(toLighthouseDestination);

const lighthouseBySlug = new Map(
  texasLighthouseDestinations.map((destination) => [destination.slug, destination]),
);

export function getTexasLighthouseDestination(slug: string): ExploreEntity | null {
  return lighthouseBySlug.get(slug) ?? null;
}

export function getTexasLighthouseEnrichment(slug: string): ExploreEntity | null {
  return getTexasLighthouseDestination(slug);
}
