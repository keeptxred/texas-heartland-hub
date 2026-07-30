import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";
import { crossCatalogDiscoveryCollections } from "./collections.cross-catalog";
import { privateCulturalLandmarkCollections } from "./collections.private-cultural-landmarks";
import { privateNaturalLandmarkDiscoveryCollections } from "./collections.private-natural-landmarks";

export type ExploreCollectionFamily =
  | "cross-catalog"
  | "private-cultural-landmarks"
  | "private-natural-landmarks";

export type ExploreDiscoveryCollectionRegistryRecord = {
  family: ExploreCollectionFamily;
  id: string;
  slug: string;
  title: string;
  description: string;
  destinationSlugs: readonly string[];
  searchTerms: readonly string[];
};

export type ExploreCollectionRegistryAudit = {
  collectionCount: number;
  duplicateIds: readonly string[];
  duplicateSlugs: readonly string[];
  missingDestinationReferences: readonly {
    collectionId: string;
    destinationSlugs: readonly string[];
  }[];
  valid: boolean;
};

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

export const exploreDiscoveryCollectionRegistry: readonly ExploreDiscoveryCollectionRegistryRecord[] = [
  ...crossCatalogDiscoveryCollections.map((collection) => ({
    family: "cross-catalog" as const,
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    destinationSlugs: collection.destinationSlugs,
    searchTerms: collection.searchTerms,
  })),
  ...privateCulturalLandmarkCollections.map((collection) => ({
    family: "private-cultural-landmarks" as const,
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    destinationSlugs: collection.destinationSlugs,
    searchTerms: [collection.title, collection.slug.replaceAll("-", " ")],
  })),
  ...privateNaturalLandmarkDiscoveryCollections.map((collection) => ({
    family: "private-natural-landmarks" as const,
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    destinationSlugs: collection.destinationSlugs,
    searchTerms: collection.searchTerms,
  })),
].sort((a, b) => a.title.localeCompare(b.title));

const collectionById = new Map(
  exploreDiscoveryCollectionRegistry.map((collection) => [collection.id, collection]),
);

const collectionBySlug = new Map(
  exploreDiscoveryCollectionRegistry.map((collection) => [collection.slug, collection]),
);

export function getExploreDiscoveryCollection(
  idOrSlug: string,
): ExploreDiscoveryCollectionRegistryRecord | null {
  return collectionById.get(idOrSlug) ?? collectionBySlug.get(idOrSlug) ?? null;
}

export function getExploreDiscoveryCollectionDestinations(idOrSlug: string): ExploreEntity[] {
  const collection = getExploreDiscoveryCollection(idOrSlug);
  if (!collection) return [];

  return collection.destinationSlugs.flatMap((slug) => {
    const destination = destinationBySlug.get(slug);
    return destination ? [destination] : [];
  });
}

export function searchExploreDiscoveryCollections(
  query: string,
): ExploreDiscoveryCollectionRegistryRecord[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return exploreDiscoveryCollectionRegistry.filter((collection) => {
    const searchableText = [
      collection.title,
      collection.description,
      collection.slug.replaceAll("-", " "),
      ...collection.searchTerms,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function buildExploreCollectionRegistryAudit(
  collections: readonly ExploreDiscoveryCollectionRegistryRecord[] = exploreDiscoveryCollectionRegistry,
): ExploreCollectionRegistryAudit {
  const duplicateIds = duplicateValues(collections.map((collection) => collection.id));
  const duplicateSlugs = duplicateValues(collections.map((collection) => collection.slug));
  const missingDestinationReferences = collections.flatMap((collection) => {
    const destinationSlugs = collection.destinationSlugs.filter(
      (slug) => !destinationBySlug.has(slug),
    );
    return destinationSlugs.length > 0
      ? [{ collectionId: collection.id, destinationSlugs }]
      : [];
  });

  return {
    collectionCount: collections.length,
    duplicateIds,
    duplicateSlugs,
    missingDestinationReferences,
    valid:
      duplicateIds.length === 0 &&
      duplicateSlugs.length === 0 &&
      missingDestinationReferences.length === 0,
  };
}

export const exploreCollectionRegistryAudit = buildExploreCollectionRegistryAudit();
