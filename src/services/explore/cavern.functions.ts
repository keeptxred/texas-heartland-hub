import { createServerFn } from "@tanstack/react-start";
import { exploreDestinations } from "@/data/explore/all-destinations";
import type { ExploreEntity, ExploreEntityCard } from "@/types/explore/public";

function toEntityCard(entity: ExploreEntity): ExploreEntityCard {
  return {
    id: entity.id,
    entityType: entity.entityType,
    name: entity.name,
    slug: entity.slug,
    summary: entity.summary,
    city: entity.city,
    county: entity.county,
    region: entity.region,
    latitude: entity.latitude,
    longitude: entity.longitude,
    heroImageUrl: entity.heroImageUrl,
    heroImageAlt: entity.heroImageAlt,
    amenities: entity.amenities,
    activities: entity.activities,
    isFamilyFriendly: entity.isFamilyFriendly,
    isPetFriendly: entity.isPetFriendly,
    isAccessible: entity.isAccessible,
    feeRequired: entity.feeRequired,
  };
}

export const getFeaturedCaverns = createServerFn({ method: "GET" }).handler(async () => {
  const caverns = exploreDestinations
    .filter((destination) => destination.entityType === "cavern")
    .sort((a, b) => {
      const familyPriority = Number(b.isFamilyFriendly === true) - Number(a.isFamilyFriendly === true);
      if (familyPriority !== 0) return familyPriority;
      return a.name.localeCompare(b.name);
    });

  return {
    items: caverns.slice(0, 6).map(toEntityCard),
    total: caverns.length,
  };
});
