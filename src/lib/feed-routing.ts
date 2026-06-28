export type FeedSection = "elections" | "laws" | "politics" | "news";

export type FeedRow = {
  id: number;
  title: string;
  source: string;
  link: string;
  description: string | null;
  pub_date: string;
};

const ELECTION_RE = /(election|ballot|\bvote\b|voter|primary|candidate|polling|precinct|runoff|early voting)/i;
const LAW_RE = /(register|rule|regulation|rulemaking|statute|\blaw\b|legal|attorney general|\bbill\b|legislat|senate bill|house bill|\bsb \d|\bhb \d|amendment)/i;
const POLITICS_RE = /(governor|abbott|lt\.? governor|patrick|paxton|agency|commission|appoint|proclamation|disaster declaration|press release|secretary of state)/i;

export function classifyFeedItem(item: { title: string; description: string | null; source: string }): FeedSection {
  const hay = `${item.source} ${item.title} ${item.description ?? ""}`;
  if (ELECTION_RE.test(hay)) return "elections";
  if (LAW_RE.test(hay)) return "laws";
  if (POLITICS_RE.test(hay)) return "politics";
  return "news";
}

export const SECTION_LABELS: Record<FeedSection, string> = {
  elections: "Elections & Voting",
  laws: "Laws & Legislation",
  politics: "Government & Politics",
  news: "Texas News",
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;