import type { ExploreEntity, ExploreEntityCard } from "@/types/explore/public";
import { federalHikingTrailSeeds } from "./catalog.hiking-federal";
import { cooperLakeHikingUnits } from "./catalog.hiking-state-park-units";

export const federalHikingParentSlugs = [
  "amistad-national-recreation-area",
  "jocelyn-nungaray-national-wildlife-refuge",
  "angelina-national-forest",
  "aransas-national-wildlife-refuge",
  "balcones-canyonlands-national-wildlife-refuge",
  "big-thicket-national-preserve",
  "big-bend-national-park",
  "chamizal-national-memorial",
  "caddo-national-grassland",
  "davy-crockett-national-forest",
  "guadalupe-mountains-national-park",
  "hagerman-national-wildlife-refuge",
  "lake-meredith-national-recreation-area",
  "lyndon-b-johnson-national-historical-park",
  "lyndon-b-johnson-national-grassland",
  "padre-island-national-seashore",
  "sabine-national-forest",
  "sam-houston-national-forest",
  "san-bernard-national-wildlife-refuge",
  "santa-ana-national-wildlife-refuge",
  "trinity-river-national-wildlife-refuge",
] as const;

export const stateParkHikingSlugs = [
  "abilene-state-park",
  "atlanta-state-park",
  "balmorhea-state-park",
  "bastrop-state-park",
  "bentsen-rio-grande-valley-state-park",
  "big-bend-ranch-state-park",
  "blanco-state-park",
  "bonham-state-park",
  "brazos-bend-state-park",
  "buescher-state-park",
  "caddo-lake-state-park",
  "caprock-canyons-state-park",
  "cedar-hill-state-park",
  "choke-canyon-state-park",
  "cleburne-state-park",
  "colorado-bend-state-park",
  "cooper-lake-doctors-creek-unit",
  "cooper-lake-south-sulphur-unit",
  "copper-breaks-state-park",
  "daingerfield-state-park",
  "davis-mountains-state-park",
  "dinosaur-valley-state-park",
  "eisenhower-state-park",
  "enchanted-rock-state-natural-area",
  "estero-llano-grande-state-park",
  "falcon-state-park",
  "fort-boggy-state-park",
  "fort-parker-state-park",
  "fort-richardson-state-park",
  "franklin-mountains-state-park",
  "galveston-island-state-park",
  "garner-state-park",
  "goliad-state-park",
  "goose-island-state-park",
  "government-canyon-state-natural-area",
  "guadalupe-river-state-park",
  "hill-country-state-natural-area",
  "honey-creek-state-natural-area",
  "hueco-tanks-state-park",
  "huntsville-state-park",
  "inks-lake-state-park",
  "kickapoo-cavern-state-park",
  "lake-arrowhead-state-park",
  "lake-bob-sandlin-state-park",
  "lake-casa-blanca-international-state-park",
  "lake-colorado-city-state-park",
  "lake-corpus-christi-state-park",
  "lake-livingston-state-park",
  "lake-mineral-wells-state-park",
  "lake-somerville-birch-creek-unit",
  "lake-somerville-nails-creek-unit",
  "lake-tawakoni-state-park",
  "lake-whitney-state-park",
  "lockhart-state-park",
  "longhorn-cavern-state-park",
  "lost-maples-state-natural-area",
  "martin-creek-lake-state-park",
  "martin-dies-jr-state-park",
  "meridian-state-park",
  "mission-tejas-state-park",
  "monahans-sandhills-state-park",
  "mother-neff-state-park",
  "mustang-island-state-park",
  "old-tunnel-state-park",
  "palmetto-state-park",
  "palo-duro-canyon-state-park",
  "palo-pinto-mountains-state-park",
  "pedernales-falls-state-park",
  "ray-roberts-lake-isle-du-bois-unit",
  "ray-roberts-lake-johnson-branch-unit",
  "resaca-de-la-palma-state-park",
  "san-angelo-state-park",
  "sea-rim-state-park",
  "seminole-canyon-state-park",
  "sheldon-lake-state-park",
  "south-llano-river-state-park",
  "stephen-f-austin-state-park",
  "tyler-state-park",
  "village-creek-state-park",
] as const;

export type StaticExploreRelationship = {
  id: string;
  sourceSlug: string;
  relationshipType: "belongs_to" | "contains";
  targetSlug: string;
  inverseRelationshipType: "belongs_to" | "contains";
  strength: "primary";
  status: "verified";
  sourceUrl: string;
  verifiedAt: string;
};

export const hikingRelationships: readonly StaticExploreRelationship[] = [
  ...federalHikingTrailSeeds.map((trail) => ({
    childSlug: trail.slug,
    parentSlug: trail.parentSlug,
    sourceUrl: trail.sourceUrl,
  })),
  ...cooperLakeHikingUnits.map((unit) => ({
    childSlug: unit.slug,
    parentSlug: "cooper-lake-state-park",
    sourceUrl: "https://tpwd.texas.gov/state-parks/cooper-lake",
  })),
].flatMap((trail) => [
  {
    id: `${trail.childSlug}--belongs-to--${trail.parentSlug}`,
    sourceSlug: trail.childSlug,
    relationshipType: "belongs_to" as const,
    targetSlug: trail.parentSlug,
    inverseRelationshipType: "contains" as const,
    strength: "primary" as const,
    status: "verified" as const,
    sourceUrl: trail.sourceUrl,
    verifiedAt: "2026-07-26",
  },
  {
    id: `${trail.parentSlug}--contains--${trail.childSlug}`,
    sourceSlug: trail.parentSlug,
    relationshipType: "contains" as const,
    targetSlug: trail.childSlug,
    inverseRelationshipType: "belongs_to" as const,
    strength: "primary" as const,
    status: "verified" as const,
    sourceUrl: trail.sourceUrl,
    verifiedAt: "2026-07-26",
  },
]);

function toCard(entity: ExploreEntity): ExploreEntityCard {
  const {
    id,
    entityType,
    name,
    slug,
    summary,
    city,
    county,
    region,
    latitude,
    longitude,
    heroImageUrl,
    heroImageAlt,
    amenities,
    activities,
    isFamilyFriendly,
    isPetFriendly,
    isAccessible,
    feeRequired,
  } = entity;

  return {
    id,
    entityType,
    name,
    slug,
    summary,
    city,
    county,
    region,
    latitude,
    longitude,
    heroImageUrl,
    heroImageAlt,
    amenities,
    activities,
    isFamilyFriendly,
    isPetFriendly,
    isAccessible,
    feeRequired,
  };
}

export function applyHikingRelationships(destinations: readonly ExploreEntity[]): ExploreEntity[] {
  const bySlug = new Map(destinations.map((destination) => [destination.slug, destination]));
  const targetsBySource = new Map<string, ExploreEntityCard[]>();

  for (const relationship of hikingRelationships) {
    const target = bySlug.get(relationship.targetSlug);
    if (!target) continue;
    const targets = targetsBySource.get(relationship.sourceSlug) ?? [];
    targets.push(toCard(target));
    targetsBySource.set(relationship.sourceSlug, targets);
  }

  const hikingParents = new Set<string>([...federalHikingParentSlugs, ...stateParkHikingSlugs]);

  return destinations.map((destination) => {
    const isHikingParent = hikingParents.has(destination.slug);

    return {
      ...destination,
      activities: isHikingParent
        ? [...new Set([...destination.activities, "hiking"])]
        : destination.activities,
      categories: isHikingParent
        ? [...new Set([...destination.categories, "hiking area"])]
        : destination.categories,
      tags: isHikingParent
        ? [...new Set([...destination.tags, "hiking", "trails"])]
        : destination.tags,
      profile: {
        ...destination.profile,
        ...(isHikingParent
          ? {
              hikingDiscovery: {
                isHikingDestination: true,
                accessScope: "Use designated public trails and visitor-use areas",
                verifyCurrentConditions: true,
                lastReviewed: "2026-07-26",
              },
            }
          : {}),
      },
      related: [...destination.related, ...(targetsBySource.get(destination.slug) ?? [])].filter(
        (related, index, items) =>
          items.findIndex((candidate) => candidate.slug === related.slug) === index,
      ),
    };
  });
}
