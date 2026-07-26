import type { ExploreEntity } from "@/types/explore/public";

export type CavernRegionGroup = {
  region: string;
  items: ExploreEntity[];
};

const PUBLIC_CAVERN_DESTINATION_SLUGS = new Set([
  "longhorn-cavern-state-park",
  "kickapoo-cavern-state-park",
  "devils-sinkhole-state-natural-area",
  "westcave-preserve",
]);

export function isPublicCavernDestination(destination: ExploreEntity): boolean {
  return (
    destination.entityType === "cavern" || PUBLIC_CAVERN_DESTINATION_SLUGS.has(destination.slug)
  );
}

export function sortCaverns(destinations: readonly ExploreEntity[]): ExploreEntity[] {
  return destinations.filter(isPublicCavernDestination).sort((a, b) => {
    const familyPriority =
      Number(b.isFamilyFriendly === true) - Number(a.isFamilyFriendly === true);
    if (familyPriority !== 0) return familyPriority;
    return a.name.localeCompare(b.name);
  });
}

export function groupCavernsByRegion(destinations: readonly ExploreEntity[]): CavernRegionGroup[] {
  const groups = new Map<string, ExploreEntity[]>();

  for (const cavern of sortCaverns(destinations)) {
    const region = cavern.region?.trim() || "Other Texas regions";
    const items = groups.get(region) ?? [];
    items.push(cavern);
    groups.set(region, items);
  }

  return [...groups.entries()]
    .map(([region, items]) => ({ region, items }))
    .sort((a, b) => {
      if (a.items.length !== b.items.length) return b.items.length - a.items.length;
      return a.region.localeCompare(b.region);
    });
}

export function relatedCaverns(
  destination: ExploreEntity,
  destinations: readonly ExploreEntity[],
  limit = 3,
): ExploreEntity[] {
  if (!isPublicCavernDestination(destination) || limit <= 0) return [];

  const candidates = sortCaverns(destinations).filter(
    (candidate) => candidate.slug !== destination.slug,
  );

  return candidates
    .sort((a, b) => {
      const aSameRegion = Number(a.region === destination.region);
      const bSameRegion = Number(b.region === destination.region);
      if (aSameRegion !== bSameRegion) return bSameRegion - aSameRegion;

      const aSameCity = Number(Boolean(a.city) && a.city === destination.city);
      const bSameCity = Number(Boolean(b.city) && b.city === destination.city);
      if (aSameCity !== bSameCity) return bSameCity - aSameCity;

      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
