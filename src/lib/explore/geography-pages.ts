import type { ExploreEntityCard } from "@/types/explore/public";

export type ExploreGeographyKind = "county" | "region";

export function geographySlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function geographyPath(kind: ExploreGeographyKind, value: string): string {
  return `/explore/${kind}/${geographySlug(value)}`;
}

export function geographySummary(
  kind: ExploreGeographyKind,
  name: string,
  items: readonly ExploreEntityCard[],
): string {
  const types = [...new Set(items.map((item) => item.entityType.replaceAll("_", " ")))]
    .slice(0, 5)
    .join(", ");
  const location = kind === "county" ? `${name} County` : `the ${name} region`;
  return `Explore ${items.length.toLocaleString("en-US")} Texas destinations in ${location}${
    types ? `, including ${types}` : ""
  }. Compare places, visitor details, activities, and nearby stops for a practical Texas trip.`;
}
