import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";

export type GovernmentGraphNode = {
  id: string;
  label: string;
  href: string;
  kind: "policy" | "government" | "law" | "data" | "legislature" | "election" | "editorial" | "reference";
  keywords: string[];
};

const CORE_NODES: GovernmentGraphNode[] = [
  { id: "texas-government", label: "Texas Government", href: "/texas-government", kind: "government", keywords: ["governor", "attorney general", "comptroller", "agency", "state government", "executive", "commission", "board"] },
  { id: "texas-agencies", label: "Texas Agency Authority", href: "/texas-government/agencies", kind: "government", keywords: ["agency", "department", "commission", "regulator", "authority", "oversight", "program"] },
  { id: "texas-legislature", label: "Texas Legislature", href: "/texas-legislature", kind: "legislature", keywords: ["legislature", "lawmakers", "house", "senate", "committee", "session", "legislation", "bill", "vote"] },
  { id: "texas-bills", label: "Texas Bills", href: "/bills", kind: "legislature", keywords: ["bill", "bills", "legislation", "filed", "committee", "passed", "signed", "veto"] },
  { id: "texas-laws", label: "Texas Laws", href: "/laws", kind: "law", keywords: ["law", "laws", "statute", "code", "legal", "court", "effective date"] },
  { id: "law-library", label: "Texas Law Library", href: "/laws/topics", kind: "law", keywords: ["law explained", "legal framework", "statute", "rights", "tax code", "penal code", "election code", "education code", "government code"] },
  { id: "data-center", label: "Texas Data Center", href: "/data", kind: "data", keywords: ["data", "statistics", "dataset", "trend", "rate", "spending", "results", "population", "demographic"] },
  { id: "representatives", label: "Texas Representatives", href: "/representatives", kind: "government", keywords: ["representative", "senator", "legislator", "lawmaker", "district", "officeholder"] },
  { id: "election-central", label: "2026 Election Central", href: "/elections/2026", kind: "election", keywords: ["election", "candidate", "primary", "runoff", "poll", "ballot", "vote", "voter", "campaign"] },
  { id: "texas-case", label: "The Texas Case", href: "/texas-case", kind: "editorial", keywords: ["why", "case for", "should", "conservative", "principle", "editorial", "position"] },
  { id: "political-reference", label: "Texas Political Reference", href: "/texas-political-reference", kind: "reference", keywords: ["race", "redistricting", "demographic", "polling", "PAC", "campaign finance", "voter trend", "grassroots"] },
];

const POLICY_NODES: GovernmentGraphNode[] = POLICY_TRACKERS.map((tracker) => ({
  id: `policy:${tracker.slug}`,
  label: tracker.shortTitle,
  href: `/policy/${tracker.slug}`,
  kind: "policy" as const,
  keywords: tracker.keywords,
}));

const STOPWORDS = new Set(["texas", "explained", "data", "law", "laws", "and", "the", "for", "with", "from", "into", "state", "official"]);
function inferredKeywords(...values: string[]): string[] {
  const phrases = values.flatMap((value) => value.toLowerCase().split(/[^a-z0-9-]+/g));
  return [...new Set(phrases.filter((word) => word.length >= 4 && !STOPWORDS.has(word)))].slice(0, 18);
}

const LAW_NODES: GovernmentGraphNode[] = LAW_TOPICS.map((topic) => ({
  id: `law:${topic.slug}`,
  label: topic.title,
  href: `/laws/topic/${topic.slug}`,
  kind: "law" as const,
  keywords: inferredKeywords(topic.slug.replace(/-/g, " "), topic.title, topic.dek, ...topic.keyRules),
}));

const DATA_NODES: GovernmentGraphNode[] = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS]
  .filter(isDataDetailIndexable)
  .map((dataset) => ({
    id: `data:${dataset.slug}`,
    label: dataset.title,
    href: `/data/${dataset.slug}`,
    kind: "data" as const,
    keywords: inferredKeywords(dataset.slug.replace(/-/g, " "), dataset.title, dataset.dek, ...dataset.whatAvailable),
  }));

const AGENCY_NODES: GovernmentGraphNode[] = AGENCY_AUTHORITY_PROFILES.map((agency) => ({
  id: `agency:${agency.slug}`,
  label: agency.shortName,
  href: `/texas-government/agencies/${agency.slug}`,
  kind: "government" as const,
  keywords: agency.keywords,
}));

export const GOVERNMENT_GRAPH_NODES: GovernmentGraphNode[] = [
  ...POLICY_NODES,
  ...LAW_NODES,
  ...DATA_NODES,
  ...AGENCY_NODES,
  ...CORE_NODES,
];

function scoreNode(text: string, node: GovernmentGraphNode): number {
  const haystack = text.toLowerCase();
  let score = 0;
  for (const keyword of node.keywords) {
    const needle = keyword.toLowerCase();
    if (!needle || !haystack.includes(needle)) continue;
    score += needle.includes(" ") ? 4 : 2;
    if (haystack.includes(` ${needle} `)) score += 1;
  }
  return score;
}

export function getGovernmentGraphLinks(text: string, limit = 6, excludeHrefs: string[] = []): GovernmentGraphNode[] {
  const excluded = new Set(excludeHrefs);
  const ranked = GOVERNMENT_GRAPH_NODES
    .filter((node) => !excluded.has(node.href))
    .map((node) => ({ node, score: scoreNode(text, node) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label))
    .map(({ node }) => node);

  const unique: GovernmentGraphNode[] = [];
  const seen = new Set<string>();
  for (const node of ranked) {
    if (seen.has(node.href)) continue;
    seen.add(node.href);
    unique.push(node);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function getPolicyGraphLinks(text: string, limit = 4): GovernmentGraphNode[] {
  return getGovernmentGraphLinks(text, limit).filter((node) => node.kind === "policy").slice(0, limit);
}
