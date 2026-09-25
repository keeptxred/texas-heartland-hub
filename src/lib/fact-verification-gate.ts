import {
  electionSchedulePrimaryRecordNote,
  electionSchedulePrimaryRecordNoteForCluster,
  isElectionScheduleFactText,
  verifiedElectionSchedulePrimaryRecordForCluster,
  type VerifiedElectionSchedulePrimaryRecord,
} from "@/lib/election-schedule-primary-record";
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
  primaryRecordNotes?: string[];
  primaryRecordSources?: Array<{ label: string; url: string }>;
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

function electionScheduleSupportedFact(
  fact: StructuredFact,
  cluster: StoryCluster,
  record: VerifiedElectionSchedulePrimaryRecord | null,
): boolean {
  if (!record || !traceable(fact) || !majorFact(fact)) return false;
  // Only date/timeline facts receive direct external primary-record support.
  // Numeric facts can contain voter counts, money, polling, or other figures
  // that an election calendar cannot resolve.
  if (fact.type !== "date" && fact.type !== "next_step") return false;
  if (!isElectionScheduleFactText(fact.text)) return false;
  return Boolean(electionSchedulePrimaryRecordNote(record, `${cluster.primary.title} ${fact.text}`));
}

function electionConflictResolution(
  fact: StructuredFact,
  cluster: StoryCluster,
  record: VerifiedElectionSchedulePrimaryRecord | null,
): string | null {
  if (!record || !fact.hasConflict || !majorFact(fact)) return null;
  if (fact.type !== "date" && fact.type !== "next_step") return null;
  if (!isElectionScheduleFactText(fact.text) || titleOverlap(fact, cluster) < 2) return null;
  return electionSchedulePrimaryRecordNote(record, `${cluster.primary.title} ${fact.text}`);
}

export function assessFactVerification(
  cluster: StoryCluster,
  ledger: StructuredFactLedger,
): FactVerificationDecision {
  const majors = ledger.facts.filter(majorFact);
  const traceableMajors = majors.filter(traceable);
  const corroboratedMajors = traceableMajors.filter((fact) => fact.corroborationCount >= 2);
  const primaryRecordMajors = traceableMajors.filter((fact) => fact.primaryRecordSupport);
  const electionRecord = verifiedElectionSchedulePrimaryRecordForCluster(cluster);
  const electionSupportedMajors = traceableMajors.filter((fact) =>
    electionScheduleSupportedFact(fact, cluster, electionRecord)
  );

  const primaryRecordNotes = new Map<string, string>();
  const resolvedNormalizedTexts = new Set<string>();
  for (const fact of ledger.conflicts) {
    const resolution = electionConflictResolution(fact, cluster, electionRecord);
    if (!resolution) continue;
    primaryRecordNotes.set(fact.factKey, resolution);
    resolvedNormalizedTexts.add(fact.normalizedText);
  }

  // The fact extractor emits both a date fact and a numeric twin for a sentence
  // such as "Election Day is Nov. 3, 2026." If the date fact is resolved by the
  // official calendar, resolve only that exact sentence's numeric twin as well.
  // This intentionally does NOT resolve unrelated voter counts, poll numbers,
  // money, or other figures in an election story.
  for (const fact of ledger.conflicts) {
    if (
      fact.type === "number" &&
      resolvedNormalizedTexts.has(fact.normalizedText) &&
      isElectionScheduleFactText(fact.text)
    ) {
      const note = electionRecord
        ? electionSchedulePrimaryRecordNote(electionRecord, `${cluster.primary.title} ${fact.text}`)
        : null;
      if (note) primaryRecordNotes.set(fact.factKey, note);
    }
  }

  const materialConflicts = ledger.conflicts.filter(
    (fact) => isMaterialConflict(fact, cluster) && !primaryRecordNotes.has(fact.factKey),
  );
  const attributedClaims = ledger.facts.filter(isAttributedClaim);
  const authorityTopic = isAuthorityTopic(cluster.primary);

  const primarySupportedFactKeys = new Set([
    ...primaryRecordMajors.map((fact) => fact.factKey),
    ...electionSupportedMajors.map((fact) => fact.factKey),
    ...primaryRecordNotes.keys(),
  ]);
  const effectivePrimaryRecordMajorFacts = primarySupportedFactKeys.size;

  if (electionRecord && electionSupportedMajors.length) {
    const storyNote = electionSchedulePrimaryRecordNoteForCluster(cluster);
    if (storyNote) primaryRecordNotes.set("__election_schedule_story__", storyNote);
  }

  const resolvedNotes = [...new Set(primaryRecordNotes.values())];
  const primaryRecordSources = electionRecord && (electionSupportedMajors.length || resolvedNotes.length)
    ? [{ label: `${electionRecord.sourceName} — primary record`, url: electionRecord.sourceUrl }]
    : [];

  if (materialConflicts.length) {
    return {
      publish: false,
      mode: "hold_material_conflict",
      reason: "central factual conflict is unresolved by a primary record",
      traceableMajorFacts: traceableMajors.length,
      corroboratedMajorFacts: corroboratedMajors.length,
      primaryRecordMajorFacts: effectivePrimaryRecordMajorFacts,
      materialConflictKeys: materialConflicts.map((fact) => fact.factKey),
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
      primaryRecordNotes: resolvedNotes,
      primaryRecordSources,
    };
  }

  if (!traceableMajors.length) {
    return {
      publish: false,
      mode: "hold_no_factual_backbone",
      reason: "event has no traceable action, figure, date, or next-step fact",
      traceableMajorFacts: 0,
      corroboratedMajorFacts: 0,
      primaryRecordMajorFacts: effectivePrimaryRecordMajorFacts,
      materialConflictKeys: [],
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
      primaryRecordNotes: resolvedNotes,
      primaryRecordSources,
    };
  }

  if (authorityTopic && !corroboratedMajors.length && !effectivePrimaryRecordMajorFacts) {
    return {
      publish: false,
      mode: "hold_authority_support",
      reason: "authority-topic event lacks a corroborated or primary-record major fact",
      traceableMajorFacts: traceableMajors.length,
      corroboratedMajorFacts: 0,
      primaryRecordMajorFacts: 0,
      materialConflictKeys: [],
      attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
      primaryRecordNotes: resolvedNotes,
      primaryRecordSources,
    };
  }

  const usedElectionPrimaryRecord = primaryRecordSources.length > 0;
  return {
    publish: true,
    mode: attributedClaims.length || ledger.conflicts.length ? "publish_with_attribution" : "verified",
    reason: usedElectionPrimaryRecord
      ? ledger.conflicts.length
        ? "factual backbone verified; central election-schedule conflict resolved by a verified primary record"
        : "factual backbone verified with a verified Texas Secretary of State primary record"
      : attributedClaims.length || ledger.conflicts.length
        ? "factual backbone verified; softer or disputed claims require attribution"
        : "traceable factual backbone verified",
    traceableMajorFacts: traceableMajors.length,
    corroboratedMajorFacts: corroboratedMajors.length,
    primaryRecordMajorFacts: effectivePrimaryRecordMajorFacts,
    materialConflictKeys: [],
    attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
    primaryRecordNotes: resolvedNotes,
    primaryRecordSources,
  };
}

export function buildVerificationInstructions(
  decision: FactVerificationDecision,
  ledger: StructuredFactLedger,
): string {
  const attributed = new Set(decision.attributedClaimKeys);
  const softClaims = ledger.facts.filter((fact) => attributed.has(fact.factKey)).slice(0, 10);
  const primaryRecordNotes = decision.primaryRecordNotes ?? [];
  return [
    `FACT VERIFICATION: ${decision.mode}. ${decision.reason}.`,
    `Traceable major facts=${decision.traceableMajorFacts}; corroborated major facts=${decision.corroboratedMajorFacts}; primary-record major facts=${decision.primaryRecordMajorFacts}.`,
    primaryRecordNotes.length
      ? `PRIMARY RECORD — use these official facts over conflicting or inconsistent secondary-source text: ${primaryRecordNotes.join(" | ")}`
      : "",
    softClaims.length
      ? `ATTRIBUTED CLAIMS ONLY — do not state these as settled facts: ${softClaims.map((fact) => `[${fact.sourceLabels.join("/")}] ${fact.text}`).join(" | ")}`
      : "",
    "Predictions, allegations, estimates, opinions, and interpretations must be attributed to the source or speaker and must not be rewritten as established fact.",
  ].filter(Boolean).join("\n");
}
