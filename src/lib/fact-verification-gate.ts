import cycleJson from "@/data/elections/2026/cycle.json";
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
};

type ElectionCycleAuthority = {
  year: number;
  active?: boolean;
  verificationStatus?: string | null;
  milestones?: {
    registrationDeadline?: string | null;
    earlyVotingStart?: string | null;
    earlyVotingEnd?: string | null;
    absenteeBallotRequestDeadline?: string | null;
    absenteeBallotReturnDeadline?: string | null;
    generalElectionDate?: string | null;
  } | null;
  source?: {
    sourceName?: string | null;
    sourceType?: string | null;
    sourceUrl?: string | null;
  } | null;
};

const SOFT_CLAIM_RE = /\b(alleg(?:e|ed|es|ation)|claim(?:s|ed)?|according to|argu(?:e|ed|es)|criticiz(?:e|ed|es)|accus(?:e|ed|es)|believ(?:e|ed|es)|expect(?:s|ed)?|estimat(?:e|ed|es)|project(?:s|ed)?|predict(?:s|ed)?|may|might|could|appears?|reportedly|likely|unlikely|suggest(?:s|ed)?|opinion|analysis)\b/i;
const STOP = new Set(["texas", "that", "this", "with", "from", "about", "after", "before", "into", "over", "under", "state", "says", "said"]);
const TEXAS_CONTEXT_RE = /\b(texas|texans|statewide)\b/i;
const ELECTION_SCHEDULE_STORY_RE = /\b(voter registration|registration deadline|register(?:ed|ing)? to vote|last day to register|election day|election date|general election|uniform election date|early voting|ballot by mail|mail ballot deadline)\b/i;
const ELECTION_SCHEDULE_FACT_RE = /\b(register(?:ed|ing|ation)?|registration|deadline|election day|election date|general election|early voting|ballot by mail|mail ballot)\b/i;
const ELECTION_CYCLES = cycleJson as ElectionCycleAuthority[];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

function formatIsoDate(value?: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = MONTH_NAMES[Number(match[2]) - 1];
  if (!month) return null;
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

function storyText(cluster: StoryCluster): string {
  return `${cluster.primary.title ?? ""} ${cluster.primary.description ?? ""} ${cluster.primary.extracted_body ?? ""}`.trim();
}

function electionCycleFor(cluster: StoryCluster): ElectionCycleAuthority | null {
  const text = storyText(cluster);
  if (!TEXAS_CONTEXT_RE.test(text) || !ELECTION_SCHEDULE_STORY_RE.test(text)) return null;
  const year = Number(text.match(/\b(20\d{2})\b/)?.[1] ?? 0);
  return ELECTION_CYCLES.find((cycle) =>
    cycle.active !== false &&
    cycle.verificationStatus === "verified" &&
    cycle.source?.sourceType === "official" &&
    Boolean(cycle.source?.sourceUrl) &&
    (!year || cycle.year === year)
  ) ?? null;
}

function electionPrimaryRecordResolution(fact: StructuredFact, cluster: StoryCluster): string | null {
  if (!fact.hasConflict || !majorFact(fact) || !ELECTION_SCHEDULE_FACT_RE.test(fact.text)) return null;
  if (titleOverlap(fact, cluster) < 2) return null;
  const cycle = electionCycleFor(cluster);
  if (!cycle?.milestones || !cycle.source?.sourceUrl) return null;

  const context = `${cluster.primary.title} ${fact.text}`;
  const parts: string[] = [];
  if (/\b(register|registration)\b/i.test(context)) {
    const registration = formatIsoDate(cycle.milestones.registrationDeadline);
    const election = formatIsoDate(cycle.milestones.generalElectionDate);
    if (registration) parts.push(`voter registration deadline=${registration}`);
    if (election) parts.push(`general election date=${election}`);
  } else if (/\bearly voting\b/i.test(context)) {
    const start = formatIsoDate(cycle.milestones.earlyVotingStart);
    const end = formatIsoDate(cycle.milestones.earlyVotingEnd);
    if (start) parts.push(`early voting starts=${start}`);
    if (end) parts.push(`early voting ends=${end}`);
  } else if (/\b(ballot by mail|mail ballot)\b/i.test(context)) {
    const request = formatIsoDate(cycle.milestones.absenteeBallotRequestDeadline);
    const returned = formatIsoDate(cycle.milestones.absenteeBallotReturnDeadline);
    if (request) parts.push(`ballot-by-mail request deadline=${request}`);
    if (returned) parts.push(`ballot return deadline=${returned}`);
  } else if (/\b(election day|election date|general election)\b/i.test(context)) {
    const election = formatIsoDate(cycle.milestones.generalElectionDate);
    if (election) parts.push(`general election date=${election}`);
  }

  if (!parts.length) return null;
  return `${cycle.source.sourceName ?? "Texas Secretary of State"} primary record resolves this election-schedule conflict: ${parts.join("; ")}. Source: ${cycle.source.sourceUrl}`;
}

export function assessFactVerification(
  cluster: StoryCluster,
  ledger: StructuredFactLedger,
): FactVerificationDecision {
  const majors = ledger.facts.filter(majorFact);
  const traceableMajors = majors.filter(traceable);
  const corroboratedMajors = traceableMajors.filter((fact) => fact.corroborationCount >= 2);
  const primaryRecordMajors = traceableMajors.filter((fact) => fact.primaryRecordSupport);
  const primaryRecordNotes = new Map<string, string>();
  for (const fact of ledger.conflicts) {
    const resolution = electionPrimaryRecordResolution(fact, cluster);
    if (resolution) primaryRecordNotes.set(fact.factKey, resolution);
  }
  const materialConflicts = ledger.conflicts.filter(
    (fact) => isMaterialConflict(fact, cluster) && !primaryRecordNotes.has(fact.factKey),
  );
  const attributedClaims = ledger.facts.filter(isAttributedClaim);
  const authorityTopic = isAuthorityTopic(cluster.primary);
  const effectivePrimaryRecordMajorFacts = primaryRecordMajors.length + primaryRecordNotes.size;
  const resolvedNotes = [...new Set(primaryRecordNotes.values())];

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
    };
  }

  return {
    publish: true,
    mode: attributedClaims.length || ledger.conflicts.length ? "publish_with_attribution" : "verified",
    reason: resolvedNotes.length
      ? "factual backbone verified; central election-schedule conflict resolved by a verified primary record"
      : attributedClaims.length || ledger.conflicts.length
        ? "factual backbone verified; softer or disputed claims require attribution"
        : "traceable factual backbone verified",
    traceableMajorFacts: traceableMajors.length,
    corroboratedMajorFacts: corroboratedMajors.length,
    primaryRecordMajorFacts: effectivePrimaryRecordMajorFacts,
    materialConflictKeys: [],
    attributedClaimKeys: attributedClaims.map((fact) => fact.factKey),
    primaryRecordNotes: resolvedNotes,
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
      ? `PRIMARY RECORD RESOLUTION — use these official facts over conflicting secondary-source text: ${primaryRecordNotes.join(" | ")}`
      : "",
    softClaims.length
      ? `ATTRIBUTED CLAIMS ONLY — do not state these as settled facts: ${softClaims.map((fact) => `[${fact.sourceLabels.join("/")}] ${fact.text}`).join(" | ")}`
      : "",
    "Predictions, allegations, estimates, opinions, and interpretations must be attributed to the source or speaker and must not be rewritten as established fact.",
  ].filter(Boolean).join("\n");
}
