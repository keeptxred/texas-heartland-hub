import type { ExploreEntity, ExploreJson } from "@/types/explore/public";
import {
  majorSpringCatalog,
  type MajorSpringCatalogRecord,
} from "./catalog.major-springs";

type ExploreJsonObject = { [key: string]: ExploreJson };

export type MajorSpringDestinationEnrichment = {
  destinationSlug: string;
  alternateNames: string[];
  description: string;
  profile: ExploreJsonObject;
  fees: ExploreJsonObject;
  regulations: ExploreJsonObject;
  seasonalGuidance: ExploreJsonObject;
  categories: string[];
  tags: string[];
  sourceUrl: string;
  sourceName: string;
  sourceUpdatedAt: string;
};

function springAlternateNames(spring: MajorSpringCatalogRecord): string[] {
  return [...new Set([
    spring.name,
    spring.name.replace(/ Pool$/i, " Springs"),
    spring.name.replace(/ Natural Area$/i, " Spring"),
    `${spring.city} springs`,
    "Texas springs",
    "spring-fed destinations",
  ])].filter((name) => name !== spring.name);
}

function springProfile(spring: MajorSpringCatalogRecord): ExploreJsonObject {
  return {
    ownership: spring.ownership,
    operator: spring.managingOrganization,
    accessType: spring.accessStatus,
    springExperience: {
      swimmingStatus: spring.swimmingStatus,
      publicAccess: spring.publicAccess,
      accessNotes: spring.accessNotes,
      ecologicalNotes: spring.ecologicalNotes,
    },
  };
}

function springFees(spring: MajorSpringCatalogRecord): ExploreJsonObject {
  return {
    admissionRequired: spring.feeRequired,
    reservationsRecommended: spring.reservationsRecommended,
  };
}

function springRegulations(spring: MajorSpringCatalogRecord): ExploreJsonObject {
  return {
    swimmingStatus: spring.swimmingStatus,
    accessNotes: spring.accessNotes,
  };
}

function springSeasonalGuidance(spring: MajorSpringCatalogRecord): ExploreJsonObject {
  return {
    reservationsRecommended: spring.reservationsRecommended,
    accessStatus: spring.accessStatus,
    verificationStatus: spring.verificationStatus,
    lastReviewed: spring.lastReviewed,
  };
}

function toSpringDestination(spring: MajorSpringCatalogRecord): ExploreEntity {
  return {
    id: spring.id,
    entityType: "natural_area",
    name: spring.name,
    slug: spring.slug,
    summary: spring.summary,
    city: spring.city,
    county: spring.county,
    region: spring.region,
    latitude: spring.latitude,
    longitude: spring.longitude,
    heroImageUrl: null,
    heroImageAlt: `${spring.name} in ${spring.city}, Texas`,
    amenities: spring.amenities,
    activities: spring.activities,
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: false,
    feeRequired: spring.feeRequired,
    alternateNames: springAlternateNames(spring),
    description: `${spring.summary} ${spring.ecologicalNotes}`,
    officialUrl: spring.officialUrl,
    phone: null,
    email: null,
    address: null,
    profile: springProfile(spring),
    hours: null,
    fees: springFees(spring),
    regulations: springRegulations(spring),
    seasonalGuidance: springSeasonalGuidance(spring),
    categories: spring.categories,
    tags: [...spring.tags, "spring", "springs", "spring-fed", "freshwater"],
    sourceUrl: spring.officialUrl,
    sourceName: spring.sourceName,
    sourceUpdatedAt: spring.lastReviewed,
    updatedAt: `${spring.lastReviewed}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  };
}

export const majorSpringDestinations: ExploreEntity[] = majorSpringCatalog
  .filter((spring) => spring.integrationMode === "create")
  .map(toSpringDestination);

const majorSpringEnrichmentByDestinationSlug = new Map(
  majorSpringCatalog
    .filter(
      (spring): spring is MajorSpringCatalogRecord & { existingDestinationSlug: string } =>
        spring.integrationMode === "enrich-existing" && spring.existingDestinationSlug !== null,
    )
    .map((spring) => [
      spring.existingDestinationSlug,
      {
        destinationSlug: spring.existingDestinationSlug,
        alternateNames: [spring.name, spring.slug, ...springAlternateNames(spring)],
        description: `${spring.summary} ${spring.ecologicalNotes}`,
        profile: springProfile(spring),
        fees: springFees(spring),
        regulations: springRegulations(spring),
        seasonalGuidance: springSeasonalGuidance(spring),
        categories: spring.categories,
        tags: [...spring.tags, "spring", "springs", "spring-fed", "freshwater"],
        sourceUrl: spring.officialUrl,
        sourceName: spring.sourceName,
        sourceUpdatedAt: spring.lastReviewed,
      } satisfies MajorSpringDestinationEnrichment,
    ]),
);

export function getMajorSpringDestinationEnrichment(
  destinationSlug: string,
): MajorSpringDestinationEnrichment | null {
  return majorSpringEnrichmentByDestinationSlug.get(destinationSlug) ?? null;
}
