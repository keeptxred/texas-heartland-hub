import { resolveContentPillarSlug, type ContentPillarSlug } from "@/lib/content-pillars";

export type FeedSection =
  | "elections"
  | "laws"
  | "politics"
  | "border"
  | "energy"
  | "economy"
  | "agriculture"
  | "veterans"
  | "law-enforcement"
  | "news";

export type FeedRow = {
  id: number;
  title: string;
  source: string;
  link: string;
  description: string | null;
  pub_date: string;
  pillar_slug?: ContentPillarSlug | null;
};

const PILLAR_TO_FEED_SECTION: Record<ContentPillarSlug, Exclude<FeedSection, "news">> = {
  "texas-politics-government": "politics",
  "texas-elections": "elections",
  "texas-border-immigration": "border",
  "texas-energy-oil": "energy",
  "texas-economy-small-business": "economy",
  "texas-agriculture-rural": "agriculture",
  "texas-veterans-military": "veterans",
  "texas-law-enforcement-public-safety": "law-enforcement",
  "texas-laws-legislature": "laws",
};

export function feedSectionForPillar(pillar: ContentPillarSlug): Exclude<FeedSection, "news"> {
  return PILLAR_TO_FEED_SECTION[pillar];
}

export function classifyFeedItem(item: {
  title: string;
  description: string | null;
  source: string;
  pillar_slug?: unknown;
}): FeedSection {
  const pillar = resolveContentPillarSlug(item.pillar_slug, {
    title: item.title,
    description: item.description,
    category: item.source,
  });
  if (!pillar) return "news";
  return feedSectionForPillar(pillar);
}

export const SECTION_LABELS: Record<FeedSection, string> = {
  elections: "Elections & Voting",
  laws: "Laws & Legislature",
  politics: "Politics & Government",
  border: "Border & Immigration",
  energy: "Energy & Oil",
  economy: "Economy & Small Business",
  agriculture: "Agriculture & Rural Texas",
  veterans: "Veterans & Military",
  "law-enforcement": "Law Enforcement & Public Safety",
  news: "Texas News",
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
