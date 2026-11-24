import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { isAgencyAuthorityIndexable } from "@/lib/agency-authority-indexability";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";
import { isRetiredElectionCentralPath } from "@/lib/retired-election-central";

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

const POLICY_NODES: GovernmentGraphNode[] = POLICY_TRACKERS
  .filter(isPolicyTrackerIndexable)
  .map((tracker) => ({
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

const LAW_NODES: GovernmentGraphNode[] = LAW_TOPICS
  .filter(isLawTopicIndexable)
  .map((topic) => ({
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

const AGENCY_NODES: GovernmentGraphNode[] = AGENCY_AUTHORITY_PROFILES
  .filter(isAgencyAuthorityIndexable)
  .map((agency) => ({
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
    if (!needle || !(` ${haystack.replace(/[^a-z0-9]+/g, " ")} `).includes(` ${needle.replace(/[^a-z0-9]+/g, " ").trim()} `)) continue;
    score += needle.includes(" ") ? 4 : 2;
    if (haystack.includes(` ${needle} `)) score += 1;
  }
  return score;
}

export function getGovernmentGraphLinks(text: string, limit = 6, excludeHrefs: string[] = []): GovernmentGraphNode[] {
  const excluded = new Set(excludeHrefs);
  const ranked = GOVERNMENT_GRAPH_NODES
    // Feature-toggle-safe: the legacy 2026 Election Central routes are HTTP
    // 410 while public Election Central is retired. Preserve the graph node
    // for a future election cycle, but never inject a dead article link.
    .filter((node) => !excluded.has(node.href) && !isRetiredElectionCentralPath(node.href))
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


/**
 * A civic search query can be broad; a news article is not a search query.
 * Only explicitly named Texas legal/policy topics in the headline/dek earn an
 * article-context link. Never use the generated body, category, or inferred
 * law-description keywords as evidence. Empty results are intentional.
 */
const NEWS_TOPIC_LINKS: readonly { href: string; topic: RegExp }[] = [
  { href: "/laws/topic/abortion-law", topic: /\b(?:abortion law|abortion ban|abortion restrictions|abortion-inducing drugs|human life protection act)\b/i },
  { href: "/laws/topic/driving-traffic-insurance-law", topic: /\b(?:driver'?s licenses?|driving licenses?|traffic laws?|auto insurance requirements|driver license regulations)\b/i },
  { href: "/laws/topic/open-records-public-information", topic: /\b(?:texas public information act|texas open records|texas public records requests?)\b/i },
  { href: "/laws/topic/property-tax-law", topic: /\b(?:property taxes?|homestead exemptions?|property appraisal)\b/i },
  { href: "/laws/topic/election-law", topic: /\b(?:texas election law|texas election code|texas voter registration|texas mail ballots?)\b/i },
  { href: "/laws/topic/gun-carry-law", topic: /\b(?:constitutional carry|permitless carry|texas gun laws?|texas firearm laws?)\b/i },
  { href: "/texas-legislature", topic: /\b(?:texas legislature|texas house of representatives|texas senate)\b/i },
  { href: "/policy/transportation", topic: /\b(?:txdot|texas highway funding|texas transportation commission)\b/i },
];
export function getNewsContextGraphLinks(text: string, limit = 3): GovernmentGraphNode[] {
  if (!/\b(?:texas|txdot|ercot)\b/i.test(text)) return [];
  const allowed = new Set(NEWS_TOPIC_LINKS.filter(({ topic }) => topic.test(text)).map(({ href }) => href));
  return GOVERNMENT_GRAPH_NODES.filter((node) => allowed.has(node.href)
    && !isRetiredElectionCentralPath(node.href)).slice(0, Math.max(0, Math.min(3, limit)));
}
