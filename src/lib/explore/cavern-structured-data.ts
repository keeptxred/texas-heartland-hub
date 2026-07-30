import type { ExploreEntity } from "@/types/explore/public";

const BASE_URL = "https://keeptxred.com";

type RelatedCavern = Pick<ExploreEntity, "name" | "slug">;

export function buildCavernBreadcrumbSchema(entity: ExploreEntity) {
  if (entity.entityType !== "cavern") return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Explore Texas",
        item: `${BASE_URL}/explore`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Texas caverns and caves",
        item: `${BASE_URL}/explore/caverns`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entity.name,
        item: `${BASE_URL}/explore/${entity.slug}`,
      },
    ],
  };
}

export function buildRelatedCavernItemListSchema(
  entity: ExploreEntity,
  relatedCaverns: readonly RelatedCavern[],
) {
  if (entity.entityType !== "cavern" || relatedCaverns.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Caverns related to ${entity.name}`,
    numberOfItems: relatedCaverns.length,
    itemListElement: relatedCaverns.map((cavern, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cavern.name,
      url: `${BASE_URL}/explore/${cavern.slug}`,
    })),
  };
}
