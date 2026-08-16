export type ClusterableFeedItem = {
  id?: number;
  title: string;
  link: string;
  source: string;
  description?: string | null;
  pub_date?: string | null;
  extracted_body?: string | null;
  internal_slug?: string | null;
  event_cluster_id?: string | null;
  event_cluster_score?: number | null;
};

export type ClusterCandidate = ClusterableFeedItem & {
  combinationScore: number;
  overlapTerms: string[];
};

export type StoryCluster = {
  primary: ClusterableFeedItem;
  members: ClusterCandidate[];
  score: number;
  sourceCount: number;
  strongMerge: boolean;
};

const STOP = new Set([
  "the","a","an","and","or","but","for","to","of","in","on","at","by","with","from","as","is","are","was","were","be","been","being","this","that","these","those","it","its","texas","tx","new","says","said","after","before","over","more","about","into","amid","during","will","would","could","should","today","friday","monday","tuesday","wednesday","thursday","saturday","sunday",
]);

const IMPORTANT = [
  /\b(abbott|ercot|trump|buc-?ee'?s|comptroller|uil|spurs|mavericks|cowboys|texans|rangers|astros|stars|longhorns|aggies|texas tech)\b/gi,
  /\b(data center|data centers|tax[- ]free|sales tax|heat index|wet bulb|moratorium|water supply|power grid|counterfeit|trademark|immigration|ice detention|border|parkland|graduation)\b/gi,
  /\b(houston|dallas|fort worth|san antonio|austin|laredo|amarillo|killeen|temple|waco|hereford|galveston|lubbock|midland)\b/gi,
];

const TOPIC_BRIDGES: Array<{ tag: string; patterns: RegExp[] }> = [
  {
    tag: "data-center-grid",
    patterns: [
      /\bdata cent(er|ers)\b/i,
      /\bercot\b/i,
      /\bgrid connection/i,
      /\bpower demand\b/i,
      /\blarge load\b/i,
      /\bdata center moratorium\b/i,
    ],
  },
  {
    tag: "back-to-school-heat",
    patterns: [
      /\btax[- ]free\b/i,
      /\bsales[- ]tax holiday\b/i,
      /\bback[- ]to[- ]school\b/i,
      /\bschool supplies\b/i,
      /\buil\b/i,
      /\bwet bulb\b/i,
      /\bfall practice/i,
      /\bfootball practice/i,
      /\bheat index\b/i,
    ],
  },
  {
    tag: "water-infrastructure",
    patterns: [/\bwater supply\b/i, /\bwater agreement/i, /\bwater needs\b/i, /\breservoir\b/i, /\bgroundwater\b/i],
  },
  {
    tag: "buc-ees-trademark",
    patterns: [/\bbuc-?ee'?s\b/i, /\bbeaver'?s mini mart\b/i, /\bbeavermart/i, /\btrademark suit\b/i, /\bbeaver logo\b/i],
  },
  {
    tag: "border-enforcement",
    patterns: [/\bcbp\b/i, /\bcustoms\b/i, /\bice detention\b/i, /\bborder\b/i, /\bcounterfeit goods\b/i],
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9' -]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeClusterText(text: string): string {
  return normalize(text);
}

function textFor(item: ClusterableFeedItem): string {
  return normalize(`${item.title} ${item.description ?? ""}`);
}

function topicTags(item: ClusterableFeedItem): Set<string> {
  const text = textFor(item);
  const tags = new Set<string>();
  for (const bridge of TOPIC_BRIDGES) {
    if (bridge.patterns.some((pattern) => pattern.test(text))) tags.add(bridge.tag);
  }
  return tags;
}

function tokens(item: ClusterableFeedItem): Set<string> {
  const raw = textFor(item);
  const out = new Set<string>();
  for (const token of raw.split(/\s+/)) {
    if (token.length < 4 || STOP.has(token)) continue;
    out.add(token);
  }
  for (const re of IMPORTANT) {
    re.lastIndex = 0;
    for (const m of raw.matchAll(re)) out.add(m[0].toLowerCase());
  }
  return out;
}

function host(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function sourceFamily(item: ClusterableFeedItem): string {
  const source = normalize(item.source).replace(/[^a-z0-9]+/g, " ").trim();
  const domain = host(item.link);
  if (/google news/.test(source) && domain) return domain;
  return domain || source;
}

function meaningfulWords(item: ClusterableFeedItem): Set<string> {
  const raw = normalize(`${item.description ?? ""} ${item.extracted_body ?? ""}`);
  const out = new Set<string>();
  for (const word of raw.split(/\s+/)) {
    if (word.length < 4 || STOP.has(word)) continue;
    out.add(word);
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / (a.size + b.size - shared);
}

export function likelySameLineage(a: ClusterableFeedItem, b: ClusterableFeedItem): boolean {
  if (sourceFamily(a) && sourceFamily(a) === sourceFamily(b)) return true;
  const titleA = normalize(a.title);
  const titleB = normalize(b.title);
  if (titleA && titleA === titleB) return true;

  const wordsA = meaningfulWords(a);
  const wordsB = meaningfulWords(b);
  if (Math.min(wordsA.size, wordsB.size) < 18) return false;
  return jaccard(wordsA, wordsB) >= 0.82;
}

function hoursApart(a?: string | null, b?: string | null): number {
  const ta = Date.parse(a ?? "");
  const tb = Date.parse(b ?? "");
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 24;
  return Math.abs(ta - tb) / 3_600_000;
}

/**
 * Event types with a high false-positive cost require stronger evidence before
 * several reports are treated as one event. Sports and scheduled government
 * actions are a little safer because team/agency + action + date are strong
 * anchors. The broad candidate search remains permissive; this threshold is
 * the publication-time merge gate.
 */
export function strongMergeThreshold(item: ClusterableFeedItem): number {
  const text = textFor(item);
  if (/\b(shooting|killed|dead|death|arrest|charged|indicted|crash|collision|missing)\b/i.test(text)) return 75;
  if (/\b(lawsuit|court|judge|ruling|appeal|injunction|supreme court)\b/i.test(text)) return 72;
  if (/\b(tornado|hurricane|wildfire|flood|warning|watch|storm)\b/i.test(text)) return 72;
  if (/\b(cowboys|texans|rangers|astros|spurs|mavericks|stars|longhorns|aggies|game|season|score)\b/i.test(text)) return 62;
  if (/\b(governor|senate|house|agency|commission|council|school district|tea)\b/i.test(text)) return 64;
  return 65;
}

export function combinationScore(primary: ClusterableFeedItem, candidate: ClusterableFeedItem): { score: number; overlapTerms: string[] } {
  if (primary.link === candidate.link) return { score: 0, overlapTerms: [] };
  const a = tokens(primary);
  const b = tokens(candidate);
  const overlap = [...a].filter((t) => b.has(t));
  let score = 0;

  const titleA = tokens({ ...primary, description: "" });
  const titleB = tokens({ ...candidate, description: "" });
  const titleOverlap = [...titleA].filter((t) => titleB.has(t));
  score += Math.min(40, titleOverlap.length * 10);
  score += Math.min(25, overlap.length * 5);

  const importantOverlap = overlap.filter((t) => {
    if (t.includes(" ")) return true;
    return IMPORTANT.some((re) => {
      re.lastIndex = 0;
      return re.test(t);
    });
  });
  score += Math.min(20, importantOverlap.length * 10);

  const primaryTopics = topicTags(primary);
  const candidateTopics = topicTags(candidate);
  const sharedTopics = [...primaryTopics].filter((tag) => candidateTopics.has(tag));
  if (sharedTopics.length) score += Math.min(35, sharedTopics.length * 35);

  const apart = hoursApart(primary.pub_date, candidate.pub_date);
  if (apart <= 12) score += 15;
  else if (apart <= 36) score += 10;
  else if (apart <= 72) score += 5;
  else score -= 15;

  if (sourceFamily(primary) && sourceFamily(primary) !== sourceFamily(candidate)) score += 15;
  else score -= 20;

  const primaryText = textFor(primary);
  const candidateText = textFor(candidate);
  const locations = ["houston","dallas","fort worth","san antonio","austin","laredo","amarillo","killeen","temple","waco","hereford","galveston","lubbock","midland"];
  if (locations.some((loc) => primaryText.includes(loc) && candidateText.includes(loc))) score += 10;

  return {
    score: Math.max(0, Math.min(100, score)),
    overlapTerms: [...overlap, ...sharedTopics.map((tag) => `topic:${tag}`)].slice(0, 12),
  };
}

export function buildStoryCluster(primary: ClusterableFeedItem, recent: ClusterableFeedItem[], maxMembers = 5): StoryCluster {
  const ranked = recent
    .filter((row) => row.link !== primary.link)
    .map((row) => ({ ...row, ...combinationScore(primary, row) }))
    .filter((row) => row.score >= 45)
    .sort((a, b) => b.score - a.score);

  const members: ClusterCandidate[] = [];
  const families = new Set<string>([sourceFamily(primary)]);
  for (const row of ranked) {
    const family = sourceFamily(row);
    if (families.has(family)) continue;
    if ([primary, ...members].some((selected) => likelySameLineage(selected, row))) continue;
    members.push({ ...row, combinationScore: row.score, overlapTerms: row.overlapTerms });
    families.add(family);
    if (members.length >= Math.max(1, maxMembers - 1)) break;
  }

  const score = members.length ? Math.max(...members.map((m) => m.combinationScore)) : 0;
  const threshold = strongMergeThreshold(primary);
  return {
    primary,
    members,
    score,
    sourceCount: 1 + members.length,
    strongMerge: members.some((m) => m.combinationScore >= threshold),
  };
}

export function buildSourcePacket(cluster: StoryCluster): string {
  const rows = [cluster.primary, ...cluster.members];
  return rows
    .map((row, index) => {
      const body = (row.extracted_body ?? row.description ?? "").trim().slice(0, 6500);
      return [
        `SOURCE ${index + 1}: ${row.source}`,
        `HEADLINE: ${row.title}`,
        `URL: ${row.link}`,
        `DATE: ${row.pub_date ?? "unknown"}`,
        `SOURCE MATERIAL: ${body}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}

export function clusterSourceList(cluster: StoryCluster): Array<{ label: string; url: string }> {
  return [cluster.primary, ...cluster.members].map((row) => ({ label: row.source, url: row.link }));
}
