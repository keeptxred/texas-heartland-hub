import type { ExploreEntity, ExploreJsonObject } from "@/types/explore/public";
import {
  privateCulturalLandmarkCatalog,
  type PrivateCulturalLandmarkRecord,
} from "./catalog.private-cultural-landmarks";

function culturalLandmarkAlternateNames(
  landmark: PrivateCulturalLandmarkRecord,
): string[] {
  const aliases = new Set<string>([
    `${landmark.city} cultural landmark`,
    "Texas private cultural landmarks",
  ]);

  if (landmark.slug === "cadillac-ranch") {
    aliases.add("Ant Farm Cadillac Ranch");
    aliases.add("Route 66 Cadillac Ranch");
  }

  if (landmark.slug === "newmans-castle") {
    aliases.add("Newman Castle");
    aliases.add("Bellville Castle");
  }

  aliases.delete(landmark.name);
  return [...aliases];
}

function culturalLandmarkProfile(
  landmark: PrivateCulturalLandmarkRecord,
): ExploreJsonObject {
  return {
    ownership: landmark.ownershipLabel,
    ownershipClassification: landmark.ownershipClassification,
    operator: landmark.operator,
    accessType: landmark.accessModel,
    visitorAccess: {
      publicAccess: landmark.publicAccess,
      admissionRequired: landmark.admissionRequired,
      reservationsRequired: landmark.reservationsRequired,
      guidedTourAvailable: landmark.guidedTourAvailable,
      overnightAccess: landmark.overnightAccess,
      accessNotes: landmark.accessNotes,
    },
    culturalContext: {
      significance: landmark.culturalSignificance,
      verificationStatus: landmark.verificationStatus,
      lastReviewed: landmark.lastReviewed,
    },
  };
}

function culturalLandmarkFees(
  landmark: PrivateCulturalLandmarkRecord,
): ExploreJsonObject {
  return {
    admissionRequired: landmark.admissionRequired,
    reservationsRequired: landmark.reservationsRequired,
  };
}

function culturalLandmarkRegulations(
  landmark: PrivateCulturalLandmarkRecord,
): ExploreJsonObject {
  return {
    accessModel: landmark.accessModel,
    reservationsRequired: landmark.reservationsRequired,
    guidedTourAvailable: landmark.guidedTourAvailable,
    overnightAccess: landmark.overnightAccess,
    accessNotes: landmark.accessNotes,
  };
}

function culturalLandmarkSeasonalGuidance(
  landmark: PrivateCulturalLandmarkRecord,
): ExploreJsonObject {
  return {
    confirmBeforeTravel: landmark.reservationsRequired,
    reservationsRequired: landmark.reservationsRequired,
    verificationStatus: landmark.verificationStatus,
    lastReviewed: landmark.lastReviewed,
  };
}

function toPrivateCulturalLandmarkDestination(
  landmark: PrivateCulturalLandmarkRecord,
): ExploreEntity {
  return {
    id: landmark.id,
    entityType: "historic_site",
    name: landmark.name,
    slug: landmark.slug,
    summary: landmark.summary,
    city: landmark.city,
    county: landmark.county,
    region: landmark.region,
    latitude: landmark.latitude,
    longitude: landmark.longitude,
    heroImageUrl: null,
    heroImageAlt: `${landmark.name} in ${landmark.city}, Texas`,
    amenities: landmark.amenities,
    activities: landmark.activities,
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: false,
    feeRequired: landmark.admissionRequired,
    alternateNames: culturalLandmarkAlternateNames(landmark),
    description: `${landmark.summary} ${landmark.culturalSignificance}`,
    officialUrl: landmark.officialUrl,
    phone: null,
    email: null,
    address: null,
    profile: culturalLandmarkProfile(landmark),
    hours: null,
    fees: culturalLandmarkFees(landmark),
    regulations: culturalLandmarkRegulations(landmark),
    seasonalGuidance: culturalLandmarkSeasonalGuidance(landmark),
    categories: landmark.categories,
    tags: [
      ...landmark.tags,
      "private cultural landmark",
      "cultural landmark",
      "managed public access",
    ],
    sourceUrl: landmark.officialUrl,
    sourceName: landmark.sourceName,
    sourceUpdatedAt: landmark.lastReviewed,
    updatedAt: `${landmark.lastReviewed}T00:00:00.000Z`,
    observations: [],
    related: [],
    nearby: [],
  };
}

export const privateCulturalLandmarkDestinations: ExploreEntity[] =
  privateCulturalLandmarkCatalog.map(toPrivateCulturalLandmarkDestination);

const privateCulturalLandmarkDestinationBySlug = new Map(
  privateCulturalLandmarkDestinations.map((destination) => [destination.slug, destination]),
);

export function getPrivateCulturalLandmarkDestination(
  slug: string,
): ExploreEntity | null {
  return privateCulturalLandmarkDestinationBySlug.get(slug) ?? null;
}
