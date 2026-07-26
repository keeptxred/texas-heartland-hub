import { createServerFn } from "@tanstack/react-start";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { commercialCavernCatalog } from "@/data/explore/catalog.caverns";
import { validateCommercialCavernCatalog } from "@/data/explore/catalog.caverns.validation";
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

function sortedCaverns(): ExploreEntity[] {
  return exploreDestinations
    .filter((destination) => destination.entityType === "cavern")
    .sort((a, b) => {
      const familyPriority = Number(b.isFamilyFriendly === true) - Number(a.isFamilyFriendly === true);
      if (familyPriority !== 0) return familyPriority;
      return a.name.localeCompare(b.name);
    });
}

export const getFeaturedCaverns = createServerFn({ method: "GET" }).handler(async () => {
  const caverns = sortedCaverns();
  return {
    items: caverns.slice(0, 6).map(toEntityCard),
    total: caverns.length,
  };
});

export const getCavernLanding = createServerFn({ method: "GET" }).handler(async () => {
  const caverns = sortedCaverns();
  const regions = [...new Set(caverns.map((cavern) => cavern.region).filter(Boolean))].sort();

  return {
    items: caverns.map(toEntityCard),
    total: caverns.length,
    regions,
    reservationRecommendedCount: caverns.filter((cavern) => {
      const profile = cavern.profile as Record<string, unknown>;
      const tour = profile.tour_information as Record<string, unknown> | undefined;
      return tour?.reservations_recommended === true;
    }).length,
  };
});
