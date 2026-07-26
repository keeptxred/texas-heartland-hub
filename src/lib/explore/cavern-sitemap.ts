import { exploreDestinations } from "@/data/explore/all-destinations";
import { BASE_URL, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { sortCaverns } from "@/lib/explore/cavern-discovery";

export function getCavernSitemapEntries(now: Date = new Date()): UrlEntry[] {
  const generatedAt = toIsoDate(now);
  const cavernEntries = sortCaverns(exploreDestinations).map((entity) => ({
    loc: `${BASE_URL}/explore/${entity.slug}`,
    lastmod: toIsoDate(entity.sourceUpdatedAt ?? generatedAt),
    image: entity.heroImageUrl ? { loc: entity.heroImageUrl, title: entity.name } : undefined,
  }));

  return [
    {
      loc: `${BASE_URL}/explore/caverns`,
      lastmod: generatedAt,
    },
    ...cavernEntries,
  ];
}
