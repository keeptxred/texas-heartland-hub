import type { ExploreEntity, ExploreJsonObject } from "@/types/explore/public";
import {
  privateNaturalLandmarkCatalog,
  type PrivateNaturalLandmarkRecord,
} from "./catalog.private-natural-landmarks";

function landmarkAlternateNames(landmark: PrivateNaturalLandmarkRecord): string[] {
  const aliases = new Set<string>([
    landmark.name,
    `${landmark.city} natural landmark`,
    "Texas private natural landmarks",
  ]);

  if (/ preserve$/i.test(landmark.name)) {
    aliases.add(landmark.name.replace(/ preserve$/i, " Nature Preserve"));
  }

  if (/ river resort$/i.test(landmark.name)) {
    aliases.add(landmark.name.replace(/ river resort$/i, " River Park"));
  }

  aliases.delete(landmark.name);
  return [...aliases];
}

function landmarkProfile(landmark: PrivateNaturalLandmarkRecord): ExploreJsonObject {
  return {
    ownership: landmark.ownershipLabel,
    ownershipClassification: landmark.ownershipClassification,
    operator: landmark.operator,
    accessType: landmark.accessModel,
    visitorAccess: {
      publicAccess: landmark.publicAccess,
      reservationsRequired: landmark.reservationsRequired,
      swimmingStatus: landmark.swimmingStatus,
      overnightAccess: landmark.overnightAccess,
      accessNotes: landmark.accessNotes,
    },
    conservation: {
      notes: landmark.conservationNotes,
      verificationStatus: landmark.verificationStatus,
      lastReviewed: landmark.lastReviewed,
    },
  };
}

function landmarkFees(landmark: PrivateNaturalLandmarkRecord): ExploreJsonObject {
  return {
    admissionRequired: landmark.admissionRequired,
    reservationsRequired: landmark.reservationsRequired,
  };
}

function landmarkRegulations(landmark: PrivateNaturalLandmarkRecord): ExploreJsonObject {
  return {
    swimmingStatus: landmark.swimmingStatus,
    overnightAccess: landmark.overnightAccess,
    accessModel: landmark.accessModel,
    accessNotes: landmark.accessNotes,
  };
}

function landmarkSeasonalGuidance(
  landmark: PrivateNaturalLandmarkRecord,
): ExploreJsonObject {
  return {
    confirmBeforeTravel: true,
    reservationsRequired: landmark.reservationsRequired,
    verificationStatus: landmark.verificationStatus,
    lastReviewed: landmark.lastReviewed,
  };
}

function toPrivateNaturalLandmarkDestination(
  landmark: PrivateNaturalLandmarkRecord,
): ExploreEntity {
  return {
    id: landmark.id,
    entityType: "natural_area",
    name: landmark.name,
    slug: landmark.slug,
    summary: landmark.summary,
    city: landmark.city,
    county: landmark.county,
    region: landmark.region,
    latitude: landmark.latitude,
    longitude: landmark.longitude,
    heroImageUrl: null,
    heroImageAlt: `${landmark.name} near ${landmark.city}, Texas`,
    amenities: landmark.amenities,
    activities: landmark.activities,
    isFamilyFriendly: true,
    isPetFriendly: false,
    isAccessible: false,
    feeRequired: landmark.admissionRequired,
    alternateNames: landmarkAlternateNames(landmark),
    description: `${landmark.summary} ${landmark.conservationNotes}`,
    officialUrl: landmark.officialUrl,
    phone: null,
    email: null,
    address: null,
    profile: landmarkProfile(landmark),
    hours: null,
    fees: landmarkFees(landmark),
    regulations: landmarkRegulations(landmark),
    seasonalGuidance: landmarkSeasonalGuidance(landmark),
    categories: landmark.categories,
    tags: [
      ...landmark.tags,
      "private natural landmark",
      "natural landmark",
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

export const privateNaturalLandmarkDestinations: ExploreEntity[] =
  privateNaturalLandmarkCatalog.map(toPrivateNaturalLandmarkDestination);

const privateNaturalLandmarkDestinationBySlug = new Map(
  privateNaturalLandmarkDestinations.map((destination) => [destination.slug, destination]),
);

export function getPrivateNaturalLandmarkDestination(
  slug: string,
): ExploreEntity | null {
  return privateNaturalLandmarkDestinationBySlug.get(slug) ?? null;
}
