import { classifyContentPillar, type ContentPillarSlug } from "@/lib/content-pillars";

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

export function classifyFeedItem(item: { title: string; description: string | null; source: string }): FeedSection {
  const pillar = classifyContentPillar({
    title: item.title,
    description: item.description,
    category: item.source,
  });
  if (!pillar) return "news";
  return PILLAR_TO_FEED_SECTION[pillar];
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
