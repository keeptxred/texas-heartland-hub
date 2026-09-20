export type PoliticalSearchGuideCategory = "races" | "redistricting" | "demographics" | "issues" | "grassroots";

export type PoliticalSearchGuideSource = {
  label: string;
  url: string;
  primary?: boolean;
};

export type PoliticalSearchGuide = {
  slug: string;
  category: PoliticalSearchGuideCategory;
  searchQuery: string;
  title: string;
  dek: string;
  updated: string;
  quickAnswer: string;
  status: string;
  keyFacts: string[];
  context: string[];
  watchFor: string[];
  sources: PoliticalSearchGuideSource[];
  related: { label: string; href: string }[];
};

export const POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS: Record<PoliticalSearchGuideCategory, string> = {
  races: "High-Profile Political Races",
  redistricting: "Redistricting & Electoral Maps",
  demographics: "Changing Demographics & Purple-State Debate",
  issues: "Voter Policy Priorities",
  grassroots: "Activism, PACs & Campaign Activity",
};
