import { isAuthorityTopic } from "@/lib/publication-quality-gate";
import { normalizeClusterText, type StoryCluster } from "@/lib/story-clustering";
import type { StructuredFact, StructuredFactLedger } from "@/lib/structured-fact-provenance";

export type FactVerificationDecision = {
  publish: boolean;
  mode: "verified" | "publish_with_attribution" | "hold_material_conflict" | "hold_no_factual_backbone" | "hold_authority_support";
  reason: string;
  traceableMajorFacts: number;
  corroboratedMajorFacts: number;
  primaryRecordMajorFacts: number;
  materialConflictKeys: string[];
  attributedClaimKeys: string[];
};

const SOFT_CLAIM_RE = /\b(alleg(?:e|ed|es|ation)|claim(?:s|ed)?|according to|argu(?:e|ed|es)|criticiz(?:e|ed|es)|accus(?:e|ed|es)|believ(?:e|ed|es)|expect(?:s|ed)?|estimat(?:e|ed|es)|project(?:s|ed)?|predict(?:s|ed)?|may|might|could|appears?|reportedly|likely|unlikely|suggest(?:s|ed)?|opinion|analysis)\b/i;
const STOP = new Set(["texas", "that", "this", "with", "from", "about", "after", "before", "into", "over", "under", "state", "says", "said"]);

function majorFact(fact: StructuredFact): boolean {
  return fact.type === "action" || fact.type === "number" || fact.type === "date" || fact.type === "next_step";
}

function traceable(fact: StructuredFact): boolean {
  return fact.sourceUrls.length > 0 && fact.sourceFeedItemIds.length > 0;
}

function words(text: string): Set<string> {
  return new Set(
    normalizeClusterText(text)
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !STOP.has(word)),
  );
}

function titleOverlap(fact: StructuredFact, cluster: StoryCluster): number {
  const titleWords = words(cluster.primary.title);
  const factWords = words(fact.text);
  let shared = 0;
  for (const word of factWords) if (titleWords.has(word)) shared += 1;
  return shared;
}

function isMaterialConflict(fact: StructuredFact, cluster: StoryCluster): boolean {
  if (!fact.hasConflict || !majorFact(fact)) return false;
  if (fact.primaryRecordSupport) return false;
  // A contradiction is publication-blocking only when it is central to the
  // headline/event framing. Peripheral disagreements remain usable with
  // explicit attribution in the synthesis prompt.
  return titleOverlap(fact, cluster) >= 2;
}

function isAttributedClaim(fact: StructuredFact): boolean {
  return SOFT_CLAIM_RE.test(fact.text);
}

export function assessFactVerification(
  cluster: StoryCluster,
  ledger: StructuredFactLedger,
): FactVerificationDecision {
  const majors = ledger.facts.filter(majorFact);
  const traceableMajors = majors.filter(traceable);
  const corroboratedMajors = traceableMajors.filter((fact) => fact.corroborationCount >= 2);
  const primaryRecordMajors = traceableMajors.filter((fact) => fact.primaryRecordSupport);
  const materialConflicts = ledger.conflicts.filter((fact) => isMaterialConflict(fact, cluster));
  const attributedClaims = ledger.facts.filter(isAttributedClaim);
  const authorityTopic = isAuthorityTopic(cluster.primary);

  if (materialConflicts.length) {
    return {
      publish: false,
      mode: "hold_material_conflict",
      reason: "central factual conflict is unresolved by a primary record",
      traceableMajorFacts: traceableMajors.length,
      corroboratedMajorFacts: corroboratedMajors.length,
      primaryRecordMajorFacts: primaryRecordMajors.length,
      materialConflictKeys: materialConflicts.map((fact) => fact.factKey),
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
    };
  }

  if (!traceableMajors.length) {
    return {
      publish: false,
      mode: "hold_no_factual_backbone",
      reason: "event has no traceable action, figure, date, or next-step fact",
      traceableMajorFacts: 0,
      corroboratedMajorFacts: 0,
      primaryRecordMajorFacts: 0,
      materialConflictKeys: [],
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
    };
  }

  if (authorityTopic && !corroboratedMajors.length && !primaryRecordMajors.length) {
    return {
      publish: false,
      mode: "hold_authority_support",
      reason: "authority-topic event lacks a corroborated or primary-record major fact",
      traceableMajorFacts: traceableMajors.length,
      corroboratedMajorFacts: 0,
      primaryRecordMajorFacts: 0,
      materialConflictKeys: [],
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
    };
  }

  return {
    publish: true,
    mode: attributedClaims.length || ledger.conflicts.length ? "publish_with_attribution" : "verified",
    reason: attributedClaims.length || ledger.conflicts.length
      ? "factual backbone verified; softer or disputed claims require attribution"
      : "traceable factual backbone verified",
    traceableMajorFacts: traceableMajors.length,
    corroboratedMajorFacts: corroboratedMajors.length,
    primaryRecordMajorFacts: primaryRecordMajors.length,
    materialConflictKeys: [],
    attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
  };
}

export function buildVerificationInstructions(
  decision: FactVerificationDecision,
  ledger: StructuredFactLedger,
): string {
  const attributed = new Set(decision.attributedClaimKeys);
  const softClaims = ledger.facts.filter((fact) => attributed.has(fact.factKey)).slice(0, 10);
  return [
    `FACT VERIFICATION: ${decision.mode}. ${decision.reason}.`,
    `Traceable major facts=${decision.traceableMajorFacts}; corroborated major facts=${decision.corroboratedMajorFacts}; primary-record major facts=${decision.primaryRecordMajorFacts}.`,
    softClaims.length
      ? `ATTRIBUTED CLAIMS ONLY — do not state these as settled facts: ${softClaims.map((fact) => `[${fact.sourceLabels.join("/")}] ${fact.text}`).join(" | ")}`
      : "",
    "Predictions, allegations, estimates, opinions, and interpretations must be attributed to the source or speaker and must not be rewritten as established fact.",
  ].filter(Boolean).join("\n");
}
