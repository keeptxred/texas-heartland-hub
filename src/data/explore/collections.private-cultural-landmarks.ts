import type { ExploreEntity } from "@/types/explore/public";
import { privateCulturalLandmarkDestinations } from "./catalog.private-cultural-landmarks.entities";

export type PrivateCulturalLandmarkCollection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: string[];
  destinations: ExploreEntity[];
};

function destinationsForSlugs(slugs: readonly string[]): ExploreEntity[] {
  const bySlug = new Map(
    privateCulturalLandmarkDestinations.map((destination) => [destination.slug, destination]),
  );

  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((destination): destination is ExploreEntity => Boolean(destination));
}

function createCollection(
  id: string,
  slug: string,
  title: string,
  description: string,
  destinationSlugs: string[],
): PrivateCulturalLandmarkCollection {
  return {
    id,
    slug,
    title,
    description,
    destinationSlugs,
    destinations: destinationsForSlugs(destinationSlugs),
  };
}

export const privateCulturalLandmarkCollections: readonly PrivateCulturalLandmarkCollection[] = [
  createCollection(
    "private-cultural-landmarks",
    "private-cultural-landmarks",
    "Private Cultural Landmarks in Texas",
    "Privately owned Texas art, architecture, and cultural attractions with verified visitor access.",
    privateCulturalLandmarkDestinations.map(({ slug }) => slug),
  ),
  createCollection(
    "texas-roadside-art-and-architecture",
    "texas-roadside-art-and-architecture",
    "Texas Roadside Art and Architecture",
    "Distinctive private cultural landmarks shaped by roadside art, individual architecture, and Texas travel culture.",
    ["cadillac-ranch", "newmans-castle"],
  ),
  createCollection(
    "free-private-cultural-landmarks",
    "free-private-cultural-landmarks",
    "Free Private Cultural Landmarks",
    "Privately owned cultural destinations that authorize public visits without admission or advance reservations.",
    privateCulturalLandmarkDestinations
      .filter((destination) => destination.feeRequired === false)
      .map(({ slug }) => slug),
  ),
  createCollection(
    "reservation-cultural-experiences",
    "reservation-cultural-experiences",
    "Reservation-Based Cultural Experiences",
    "Private Texas cultural attractions where advance booking protects the property and organizes visitor access.",
    privateCulturalLandmarkDestinations
      .filter((destination) => destination.profile?.visitorAccess &&
        (destination.profile.visitorAccess as Record<string, unknown>).reservationsRequired === true)
      .map(({ slug }) => slug),
  ),
] as const;

const collectionById = new Map(
  privateCulturalLandmarkCollections.map((collection) => [collection.id, collection]),
);

const collectionBySlug = new Map(
  privateCulturalLandmarkCollections.map((collection) => [collection.slug, collection]),
);

export function getPrivateCulturalLandmarkCollectionById(
  id: string,
): PrivateCulturalLandmarkCollection | null {
  return collectionById.get(id) ?? null;
}

export function getPrivateCulturalLandmarkCollectionBySlug(
  slug: string,
): PrivateCulturalLandmarkCollection | null {
  return collectionBySlug.get(slug) ?? null;
}
