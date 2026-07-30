import { exploreDestinations } from "@/data/explore/all-destinations";
import type { ExploreEntity } from "@/types/explore/public";

export type CavernSeoOverride = {
  title: string;
  description: string;
  keywords: string;
};

function profileSection(entity: ExploreEntity, key: string): Record<string, unknown> {
  const value = (entity.profile as Record<string, unknown>)[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function compact(parts: Array<string | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(" ");
}

export function buildCavernSeo(entity: ExploreEntity): CavernSeoOverride | null {
  if (entity.entityType !== "cavern") return null;

  const tour = profileSection(entity, "tour_information");
  const access = profileSection(entity, "visitor_access");
  const location = compact([entity.city ? `near ${entity.city}, Texas.` : "in Texas."]);
  const reservationText =
    tour.reservations_recommended === true
      ? "Review tour times and reserve tickets before visiting."
      : "Review current tour times, ticket details, and visitor requirements.";
  const accessibilityText = access.accessibility
    ? "Check accessibility information and nearby attractions."
    : "Check visitor guidance and nearby attractions.";

  return {
    title: `${entity.name} Cave Tours, Tickets & Visitor Guide`,
    description: compact([
      `Plan a visit to ${entity.name} ${location}`,
      reservationText,
      accessibilityText,
    ]),
    keywords: [
      entity.name,
      `${entity.name} tickets`,
      `${entity.name} tours`,
      `${entity.name} cave tour`,
      entity.city ? `caves near ${entity.city}` : null,
      entity.region ? `${entity.region} caverns` : null,
      "Texas cavern tours",
      "Texas caves",
      "guided cave tours",
      "cavern tickets",
    ]
      .filter((keyword): keyword is string => Boolean(keyword))
      .join(", "),
  };
}

export function getCavernSeoOverride(path: string): CavernSeoOverride | null {
  const normalizedPath = path.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const slug = normalizedPath.match(/^\/explore\/([^/]+)$/)?.[1];
  if (!slug || slug === "caverns") return null;

  const entity = exploreDestinations.find(
    (destination) => destination.slug === decodeURIComponent(slug) && destination.entityType === "cavern",
  );

  return entity ? buildCavernSeo(entity) : null;
}
