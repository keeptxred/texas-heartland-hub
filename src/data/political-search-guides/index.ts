import { POLITICAL_RACE_SEARCH_GUIDES } from "./races";
import { POLITICAL_REDISTRICTING_SEARCH_GUIDES } from "./redistricting";
import { POLITICAL_DEMOGRAPHIC_SEARCH_GUIDES } from "./demographics";
import { POLITICAL_ISSUE_SEARCH_GUIDES } from "./issues";
import { POLITICAL_GRASSROOTS_SEARCH_GUIDES } from "./grassroots";
import type { PoliticalSearchGuide, PoliticalSearchGuideCategory } from "./types";

export * from "./types";

export const POLITICAL_SEARCH_GUIDES: PoliticalSearchGuide[] = [
  ...POLITICAL_RACE_SEARCH_GUIDES,
  ...POLITICAL_REDISTRICTING_SEARCH_GUIDES,
  ...POLITICAL_DEMOGRAPHIC_SEARCH_GUIDES,
  ...POLITICAL_ISSUE_SEARCH_GUIDES,
  ...POLITICAL_GRASSROOTS_SEARCH_GUIDES,
];

export function getPoliticalSearchGuide(slug: string): PoliticalSearchGuide | undefined {
  return POLITICAL_SEARCH_GUIDES.find((guide) => guide.slug === slug);
}

export function getPoliticalSearchGuidesByCategory(category: PoliticalSearchGuideCategory): PoliticalSearchGuide[] {
  return POLITICAL_SEARCH_GUIDES.filter((guide) => guide.category === category);
}

export const POLITICAL_SEARCH_GUIDE_SLUGS = POLITICAL_SEARCH_GUIDES.map((guide) => guide.slug);
