import { normalizeClusterText, sourceFamily, type ClusterableFeedItem, type StoryCluster } from "@/lib/story-clustering";

export type StructuredFactType = "action" | "number" | "date" | "quote" | "next_step" | "context";

export type StructuredFact = {
  factKey: string;
  type: StructuredFactType;
  text: string;
  normalizedText: string;
  confidence: number;
  corroborationCount: number;
  primaryRecordSupport: boolean;
  sourceFeedItemIds: number[];
  sourceLabels: string[];
  sourceUrls: string[];
  numericValues: string[];
  conflictGroup?: string;
  hasConflict: boolean;
};

export type StructuredFactLedger = {
  facts: StructuredFact[];
  whatHappened: StructuredFact[];
  keyNumbers: StructuredFact[];
  timeline: StructuredFact[];
  quotations: StructuredFact[];
  whatNext: StructuredFact[];
  conflicts: StructuredFact[];
};

type Candidate = {
  item: ClusterableFeedItem;
  type: StructuredFactType;
  text: string;
  normalizedText: string;
  tokens: Set<string>;
  numericValues: string[];
  primaryRecord: boolean;
};

const MONTHS = "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec";
const ACTION_RE = /\b(announced|approved|adopted|signed|filed|charged|arrested|ordered|ruled|voted|reported|confirmed|issued|released|scheduled|opened|closed|increased|decreased|won|lost|killed|injured|died|declared|launched|recalled|settled|passed|rejected|blocked|allowed|required|rescinded|appointed|resigned|paus(?:e|ed|es|ing)|halt(?:ed|s|ing)?|stopp(?:ed|ing)|stops?|suspend(?:ed|s|ing)?|resum(?:e|ed|es|ing))\b/i;
const NEXT_RE = /\b(will|scheduled|expected|plans? to|set to|deadline|next hearing|next vote|takes effect|effective on|beginning on|starts? on|ends? on|must file|must respond)\b/i;
const NUMBER_RE = /(?:\$\s*)?\b\d[\d,.]*(?:\s*(?:%|percent|million|billion|thousand|mw|megawatts?|acres?|miles?|days?|hours?|years?|votes?|people|students?|homes?|jobs?))?\b/gi;
const DATE_RE = new RegExp(`\\b(?:${MONTHS})\\.?\\s+\\d{1,2}(?:,\\s*\\d{4})?\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b`, "i");
const QUOTE_RE = /[“"][^”"]{12,240}[”"]/;
const STOP = new Set(["that","this","with","from","have","has","had","were","was","will","would","could","should","into","about","after","before","their","there","they","them","then","than","when","where","which","while","texas","said","says","also","over","under","more","most","some","such","only","each","other","been","being","through","during"]);

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 28 && sentence.length <= 520);
}

function words(text: string): Set<string> {
  const out = new Set<string>();
  for (const word of normalizeClusterText(text).split(/\s+/)) {
    if (word.length < 4 || STOP.has(word)) continue;
    out.add(word);
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const word of a) if (b.has(word)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function isPrimaryRecord(item: ClusterableFeedItem): boolean {
  const family = sourceFamily(item);
  const text = `${item.source} ${item.title} ${item.link}`;
  return (
    /(?:^|\.)gov(?:\/|$)/i.test(family) ||
    /\b(texas education agency|office of the governor|texas secretary of state|texas attorney general|texas supreme court|ercot|police department|sheriff'?s office|city of |county of |school district|university|official statement|press release)\b/i.test(text)
  );
}

function numericValues(text: string): string[] {
  return [...text.matchAll(NUMBER_RE)].map((match) => match[0].replace(/\s+/g, " ").trim().toLowerCase()).slice(0, 8);
}

function classify(sentence: string): StructuredFactType[] {
  const types: StructuredFactType[] = [];
  if (ACTION_RE.test(sentence)) types.push("action");
  if (numericValues(sentence).length) types.push("number");
  if (DATE_RE.test(sentence)) types.push("date");
  if (QUOTE_RE.test(sentence)) types.push("quote");
  if (NEXT_RE.test(sentence)) types.push("next_step");
  return types;
}

function pushCandidates(out: Candidate[], item: ClusterableFeedItem, text: string, types: StructuredFactType[], primaryRecord: boolean): void {
  const normalizedText = normalizeClusterText(text);
  const tokenSet = words(text);
  const numbers = numericValues(text);
  for (const type of types) {
    out.push({
      item,
      type,
      text,
      normalizedText,
      tokens: tokenSet,
      numericValues: numbers,
      primaryRecord,
    });
  }
}

function candidateRows(cluster: StoryCluster): Candidate[] {
  const out: Candidate[] = [];
  for (const item of [cluster.primary, ...cluster.members]) {
    const text = (item.extracted_body ?? item.description ?? "").trim();
    const primaryRecord = isPrimaryRecord(item);

    // Headlines are editorial assertions attached to the same traceable source URL.
    // Including evidence-bearing headlines lets independently reported breaking events
    // corroborate one another even when the article sentences use different wording.
    const title = item.title.trim();
    const titleTypes = classify(title);
    if (titleTypes.length) pushCandidates(out, item, title, titleTypes, primaryRecord);

    const sentences = splitSentences(text).slice(0, 90);
    let contextualAdded = 0;
    for (const sentence of sentences) {
      let types = classify(sentence);
      if (!types.length) {
        if (contextualAdded >= 2 || words(sentence).size < 6) continue;
        contextualAdded += 1;
        types = ["context"];
      }
      pushCandidates(out, item, sentence, types, primaryRecord);
    }
  }
  return out;
}

function hash(value: string): string {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

function sameClaim(a: Candidate, b: Candidate): boolean {
  if (a.type !== b.type) return false;
  const threshold = a.type === "quote" ? 0.82 : a.type === "number" || a.type === "date" ? 0.62 : 0.56;
  return jaccard(a.tokens, b.tokens) >= threshold;
}

function preferredRepresentative(candidates: Candidate[]): Candidate {
  return [...candidates].sort((a, b) => {
    if (a.primaryRecord !== b.primaryRecord) return a.primaryRecord ? -1 : 1;
    return a.text.length - b.text.length;
  })[0];
}

function buildGroups(candidates: Candidate[]): Candidate[][] {
  const groups: Candidate[][] = [];
  for (const candidate of candidates) {
    const group = groups.find((rows) => rows.some((row) => sameClaim(row, candidate)));
    if (group) group.push(candidate);
    else groups.push([candidate]);
  }
  return groups;
}

function numericConflictKey(group: Candidate[]): string | undefined {
  if (!group.some((row) => row.type === "number")) return undefined;
  const bySource = group
    .map((row) => row.numericValues.join("|"))
    .filter(Boolean);
  if (new Set(bySource).size < 2) return undefined;
  const representative = preferredRepresentative(group);
  return `numeric-conflict:${hash([...representative.tokens].sort().slice(0, 12).join(" "))}`;
}

function conflictingNumberGroups(groups: Candidate[][]): Map<number, string> {
  const conflicts = new Map<number, string>();
  for (let i = 0; i < groups.length; i += 1) {
    const a = groups[i];
    const internalKey = numericConflictKey(a);
    if (internalKey) conflicts.set(i, internalKey);
    if (!a.some((row) => row.type === "number")) continue;
    const aRep = preferredRepresentative(a);
    const aValues = new Set(a.flatMap((row) => row.numericValues));
    for (let j = i + 1; j < groups.length; j += 1) {
      const b = groups[j];
      if (!b.some((row) => row.type === "number")) continue;
      const bRep = preferredRepresentative(b);
      if (jaccard(aRep.tokens, bRep.tokens) < 0.48) continue;
      const bValues = new Set(b.flatMap((row) => row.numericValues));
      if ([...aValues].some((value) => bValues.has(value))) continue;
      const key = `numeric-conflict:${hash([...aRep.tokens].sort().slice(0, 12).join(" "))}`;
      conflicts.set(i, key);
      conflicts.set(j, key);
    }
  }
  return conflicts;
}

export function buildStructuredFactLedger(cluster: StoryCluster): StructuredFactLedger {
  const groups = buildGroups(candidateRows(cluster));
  const conflictsByGroup = conflictingNumberGroups(groups);
  const facts = groups.map((group, index): StructuredFact => {
    const representative = preferredRepresentative(group);
    const feedIds = [...new Set(group.map((row) => row.item.id).filter((id): id is number => typeof id === "number"))];
    const sourceLabels = [...new Set(group.map((row) => row.item.source))];
    const sourceUrls = [...new Set(group.map((row) => row.item.link))];
    const families = new Set(group.map((row) => sourceFamily(row.item)).filter(Boolean));
    const independentCount = Math.max(1, families.size);
    const primaryRecordSupport = group.some((row) => row.primaryRecord);
    const conflictGroup = conflictsByGroup.get(index);
    const confidence = Math.min(0.98, 0.52 + Math.min(3, independentCount - 1) * 0.14 + (primaryRecordSupport ? 0.12 : 0));
    return {
      factKey: `${representative.type}:${hash(representative.normalizedText)}`,
      type: representative.type,
      text: representative.text,
      normalizedText: representative.normalizedText,
      confidence,
      corroborationCount: independentCount,
      primaryRecordSupport,
      sourceFeedItemIds: feedIds,
      sourceLabels,
      sourceUrls,
      numericValues: [...new Set(group.flatMap((row) => row.numericValues))],
      conflictGroup,
      hasConflict: Boolean(conflictGroup),
    };
  });

  const ranked = [...facts].sort((a, b) => {
    if (a.hasConflict !== b.hasConflict) return a.hasConflict ? 1 : -1;
    if (a.corroborationCount !== b.corroborationCount) return b.corroborationCount - a.corroborationCount;
    if (a.primaryRecordSupport !== b.primaryRecordSupport) return a.primaryRecordSupport ? -1 : 1;
    return b.confidence - a.confidence;
  });

  return {
    facts: ranked,
    whatHappened: ranked.filter((fact) => fact.type === "action" || fact.type === "context").slice(0, 8),
    keyNumbers: ranked.filter((fact) => fact.type === "number").slice(0, 8),
    timeline: ranked.filter((fact) => fact.type === "date").slice(0, 6),
    quotations: ranked.filter((fact) => fact.type === "quote").slice(0, 5),
    whatNext: ranked.filter((fact) => fact.type === "next_step").slice(0, 6),
    conflicts: ranked.filter((fact) => fact.hasConflict).slice(0, 8),
  };
}

function factLine(fact: StructuredFact): string {
  const support = [`sources=${fact.corroborationCount}`];
  if (fact.primaryRecordSupport) support.push("primary-record=yes");
  if (fact.hasConflict) support.push(`CONFLICT=${fact.conflictGroup}`);
  return `- ${fact.text} [${support.join("; ")}; source labels: ${fact.sourceLabels.join(" | ")}]`;
}

export function buildStructuredFactPacket(ledger: StructuredFactLedger): string {
  const sections: Array<[string, StructuredFact[]]> = [
    ["WHAT HAPPENED", ledger.whatHappened],
    ["KEY NUMBERS", ledger.keyNumbers],
    ["TIMELINE / DATES", ledger.timeline],
    ["QUOTATIONS", ledger.quotations],
    ["WHAT HAPPENS NEXT", ledger.whatNext],
    ["SOURCE CONFLICTS — ATTRIBUTE, DO NOT SILENTLY RECONCILE", ledger.conflicts],
  ];
  return sections
    .filter(([, facts]) => facts.length)
    .map(([heading, facts]) => `${heading}\n${facts.map(factLine).join("\n")}`)
    .join("\n\n");
}

export async function persistStructuredFacts(db: any, clusterId: string | null, ledger: StructuredFactLedger): Promise<void> {
  if (!clusterId || !ledger.facts.length) return;
  try {
    const now = new Date().toISOString();
    for (const fact of ledger.facts) {
      const payload = {
        cluster_id: clusterId,
        fact_key: fact.factKey,
        fact_type: fact.type,
        fact_text: fact.text,
        normalized_text: fact.normalizedText,
        confidence: fact.confidence,
        corroboration_count: fact.corroborationCount,
        primary_record_support: fact.primaryRecordSupport,
        source_feed_item_ids: fact.sourceFeedItemIds,
        source_labels: fact.sourceLabels,
        source_urls: fact.sourceUrls,
        numeric_values: fact.numericValues,
        conflict_group: fact.conflictGroup ?? null,
        has_conflict: fact.hasConflict,
        last_seen_at: now,
      };
      const { error } = await db.from("news_event_facts").upsert(payload, { onConflict: "cluster_id,fact_key" });
      if (error) throw error;
    }
  } catch (error) {
    console.warn("[multi-source] structured fact persistence skipped", error instanceof Error ? error.message : String(error));
  }
}
