import type { FactVerificationDecision } from "@/lib/fact-verification-gate";
import type { StoryAnglePlan } from "@/lib/story-angle-selector";
import type { StoryCluster } from "@/lib/story-clustering";
import type { StructuredFact, StructuredFactLedger } from "@/lib/structured-fact-provenance";

export type FinalQualityDraft = {
  title: string;
  dek: string;
  body: string;
  sourceUrls: string[];
  sectionCount: number;
  wordCount: number;
  minWords: number;
};

export type FinalQualityDecision = {
  publish: boolean;
  mode:
    | "verified"
    | "hold_source_provenance"
    | "hold_word_floor"
    | "hold_structure"
    | "hold_angle_drift"
    | "hold_fact_coverage"
    | "hold_unattributed_claim"
    | "hold_conflict_lead";
  reason: string;
  sourceCoverage: number;
  verifiedFactCoverage: number;
  checkedFactKeys: string[];
  missingFactKeys: string[];
  unattributedClaimKeys: string[];
  headlineConflictKeys: string[];
};

const STOP = new Set([
  "that", "this", "with", "from", "have", "has", "had", "were", "was", "will", "would", "could", "should",
  "into", "about", "after", "before", "their", "there", "they", "them", "then", "than", "when", "where", "which",
  "while", "texas", "said", "says", "also", "over", "under", "more", "most", "some", "such", "only", "each", "other",
  "been", "being", "through", "during", "story", "source", "sources", "according",
]);
const ATTRIBUTION_RE = /\b(according to|said|says|reported|reports|stated|states|announced|wrote|writes|argued|claims?|alleged|estimated|projected|predicted|officials?|agency|court|department|office|campaign|spokesperson)\b/i;
const SOFT_CLAIM_RE = /\b(alleg(?:e|ed|es|ation)|claim(?:s|ed)?|argu(?:e|ed|es)|criticiz(?:e|ed|es)|accus(?:e|ed|es)|believ(?:e|ed|es)|expect(?:s|ed)?|estimat(?:e|ed|es)|project(?:s|ed)?|predict(?:s|ed)?|may|might|could|appears?|reportedly|likely|unlikely|suggest(?:s|ed)?|opinion|analysis)\b/i;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9%$]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(text: string): Set<string> {
  const out = new Set<string>();
  for (const token of normalize(text).split(" ")) {
    if (token.length < 4 || STOP.has(token)) continue;
    out.add(token);
  }
  return out;
}

function overlap(a: string, b: string): number {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / Math.min(left.size, right.size);
}

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function factAppears(fact: StructuredFact, text: string): boolean {
  const hay = normalize(text);
  if (!hay) return false;
  const factText = normalize(fact.text);
  if (factText.length >= 24 && hay.includes(factText)) return true;
  if (overlap(fact.text, text) >= 0.42) return true;
  if (fact.numericValues.length) {
    const numbersPresent = fact.numericValues.filter((value) => hay.includes(normalize(value))).length;
    if (numbersPresent > 0 && overlap(fact.text, text) >= 0.24) return true;
  }
  return false;
}

function factSentence(fact: StructuredFact, text: string): string | null {
  return sentences(text).find((sentence) => factAppears(fact, sentence)) ?? null;
}

function isMajor(fact: StructuredFact): boolean {
  return fact.type === "action" || fact.type === "number" || fact.type === "date" || fact.type === "next_step";
}

function rankedVerifiedFacts(ledger: StructuredFactLedger): StructuredFact[] {
  return ledger.facts
    .filter((fact) => isMajor(fact) && fact.sourceUrls.length > 0 && (!fact.hasConflict || fact.primaryRecordSupport))
    .sort((a, b) => {
      const score = (fact: StructuredFact) =>
        (fact.type === "action" ? 35 : fact.type === "number" ? 28 : fact.type === "next_step" ? 22 : 18)
        + Math.min(3, fact.corroborationCount) * 12
        + (fact.primaryRecordSupport ? 18 : 0)
        + Math.round(fact.confidence * 10);
      return score(b) - score(a);
    });
}

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls.map((url) => url.trim()).filter(Boolean))];
}

function softFactsByKey(ledger: StructuredFactLedger, keys: string[]): StructuredFact[] {
  const wanted = new Set(keys);
  return ledger.facts.filter((fact) => wanted.has(fact.factKey) || SOFT_CLAIM_RE.test(fact.text));
}

export function assessMultiSourceFinalQuality(input: {
  draft: FinalQualityDraft;
  cluster: StoryCluster;
  ledger: StructuredFactLedger;
  verification: FactVerificationDecision;
  anglePlan: StoryAnglePlan | null;
}): FinalQualityDecision {
  const { draft, cluster, ledger, verification, anglePlan } = input;
  const expectedUrls = uniqueUrls([cluster.primary, ...cluster.members].map((row) => row.link));
  const draftUrls = uniqueUrls(draft.sourceUrls);
  const represented = expectedUrls.filter((url) => draftUrls.includes(url)).length;
  const sourceCoverage = expectedUrls.length ? represented / expectedUrls.length : 0;
  const base = {
    sourceCoverage,
    verifiedFactCoverage: 0,
    checkedFactKeys: [] as string[],
    missingFactKeys: [] as string[],
    unattributedClaimKeys: [] as string[],
    headlineConflictKeys: [] as string[],
  };

  if (cluster.sourceCount < 2 || expectedUrls.length < 2 || draftUrls.length < 2 || sourceCoverage < 0.8) {
    return {
      ...base,
      publish: false,
      mode: "hold_source_provenance",
      reason: `Multi-source draft provenance is incomplete (${represented}/${expectedUrls.length} preserved source URLs represented).`,
    };
  }

  if (draft.wordCount < draft.minWords) {
    return {
      ...base,
      publish: false,
      mode: "hold_word_floor",
      reason: `Draft is below the tiered publication floor (${draft.wordCount}/${draft.minWords} words).`,
    };
  }

  if (!draft.title.trim() || draft.dek.trim().length < 45 || draft.sectionCount < 3) {
    return {
      ...base,
      publish: false,
      mode: "hold_structure",
      reason: "Draft is missing a usable title, explanatory dek, or minimum article structure.",
    };
  }

  const conflictedHeadlineFacts = ledger.conflicts.filter((fact) => !fact.primaryRecordSupport && factAppears(fact, `${draft.title} ${draft.dek}`));
  if (conflictedHeadlineFacts.length) {
    return {
      ...base,
      publish: false,
      mode: "hold_conflict_lead",
      reason: "Headline or dek is driven by an unresolved source conflict.",
      headlineConflictKeys: conflictedHeadlineFacts.map((fact) => fact.factKey),
    };
  }

  if (anglePlan && overlap(anglePlan.leadFact, `${draft.title} ${draft.dek} ${draft.body.slice(0, 900)}`) < 0.24) {
    return {
      ...base,
      publish: false,
      mode: "hold_angle_drift",
      reason: "Generated draft drifted away from the verified story angle selected from the fact ledger.",
    };
  }

  const checkedFacts = rankedVerifiedFacts(ledger).slice(0, 6);
  const foundFacts = checkedFacts.filter((fact) => factAppears(fact, draft.body));
  const requiredFacts = checkedFacts.length <= 2 ? checkedFacts.length : Math.max(2, Math.ceil(checkedFacts.length * 0.5));
  const verifiedFactCoverage = checkedFacts.length ? foundFacts.length / checkedFacts.length : 0;
  const missingFactKeys = checkedFacts.filter((fact) => !foundFacts.includes(fact)).map((fact) => fact.factKey);
  const factBase = {
    ...base,
    verifiedFactCoverage,
    checkedFactKeys: checkedFacts.map((fact) => fact.factKey),
    missingFactKeys,
  };
  if (!checkedFacts.length || foundFacts.length < requiredFacts) {
    return {
      ...factBase,
      publish: false,
      mode: "hold_fact_coverage",
      reason: `Draft uses too little of the verified factual backbone (${foundFacts.length}/${checkedFacts.length} high-value facts represented).`,
    };
  }

  const unattributed = softFactsByKey(ledger, verification.attributedClaimKeys).filter((fact) => {
    const sentence = factSentence(fact, draft.body);
    return sentence ? !ATTRIBUTION_RE.test(sentence) : false;
  });
  if (unattributed.length) {
    return {
      ...factBase,
      publish: false,
      mode: "hold_unattributed_claim",
      reason: "Draft converts a claim, estimate, prediction, allegation, or interpretation into unattributed narrative fact.",
      unattributedClaimKeys: unattributed.map((fact) => fact.factKey),
    };
  }

  return {
    ...factBase,
    publish: true,
    mode: "verified",
    reason: `Draft passed final multi-source quality review with ${Math.round(sourceCoverage * 100)}% source provenance coverage and ${Math.round(verifiedFactCoverage * 100)}% high-value fact coverage.`,
  };
}
