import { createServerFn } from "@tanstack/react-start";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { commercialCavernCatalog } from "@/data/explore/catalog.caverns";
import { validateCommercialCavernCatalog } from "@/data/explore/catalog.caverns.validation";
import { groupCavernsByRegion, sortCaverns } from "@/lib/explore/cavern-discovery";
import type { ExploreEntity, ExploreEntityCard } from "@/types/explore/public";

validateCommercialCavernCatalog(commercialCavernCatalog);

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
  const caverns = sortCaverns(exploreDestinations);
  return {
    items: caverns.slice(0, 6).map(toEntityCard),
    total: caverns.length,
  };
});

export const getCavernLanding = createServerFn({ method: "GET" }).handler(async () => {
  const caverns = sortCaverns(exploreDestinations);
  const regionalGroups = groupCavernsByRegion(caverns).map((group) => ({
    region: group.region,
    items: group.items.map(toEntityCard),
  }));

  return {
    items: caverns.map(toEntityCard),
    total: caverns.length,
    regions: regionalGroups.map((group) => group.region),
    regionalGroups,
    reservationRecommendedCount: caverns.filter((cavern) => {
      const profile = cavern.profile as Record<string, unknown>;
      const tour = profile.tour_information as Record<string, unknown> | undefined;
      return tour?.reservations_recommended === true;
    }).length,
  };
});
