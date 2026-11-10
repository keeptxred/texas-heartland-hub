import { categoryForPillar } from "./newsroom-rewrite-adapter";
import { newsroomPacketHasTexasIncidentEvidence } from "./newsroom-texas-evidence-guard";
import { newsroomHasPublisherDiversity } from "./newsroom-publication-preflight";
import { researchPacketEvidenceChars, type ResearchPacket } from "./newsroom-research-packet";

/**
 * Research first, publish second. Only recent, specific, recoverable failures
 * can re-enter the established guarded publisher; NEVER waive its preflight.
 * Keep zero-AI packet hydration and a single bounded provider retry distinct.
 */
export type RecoverableResearchCandidate = {
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  score_breakdown: Record<string, unknown> | null;
};

export type ResearchRescueDecision = {
  retry: boolean;
  reason: "new_source_evidence" | "transient_provider" | "hold";
  evidenceChars: number;
  previousEvidenceChars: number;
};

const TRANSIENT_PROVIDER = /^publication_failed:\s*Cloudflare Workers AI (?:request timed out after \d+ms|403:.*(?:doesn't support JSON Schema|does not support JSON Schema))/i;
const RESEARCH_FAILURE = /(?:tiered_main_word_count|below_news_word_floor|paragraph_count|multisource_unattributed_claim|repeated_newsroom_paragraphs|direct_answer_summary_length|insufficient_(?:source|evidence|independent))/i;
const NEWS_WINDOW_MS = 72 * 60 * 60 * 1000;
const MIN_RESEARCH_DELTA = 900;
const PROVIDER_COOLDOWN_MS = 60 * 60 * 1000;

export function isRecoverableResearchFailure(candidate: Pick<RecoverableResearchCandidate, "status" | "rejection_reason">): boolean {
  if (candidate.status !== "HELD" && candidate.status !== "REJECTED") return false;
  const reason = String(candidate.rejection_reason || "");
  if (!reason || /superseded|outdated|captured|image_verification_failed|recovery_draft_failed_revalidation|copyright|fabricat|unsafe|disinformation/i.test(reason)) return false;
  return TRANSIENT_PROVIDER.test(reason) || RESEARCH_FAILURE.test(reason);
}

function retryCount(candidate: RecoverableResearchCandidate): number {
  const value = candidate.score_breakdown?.research_rescue;
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  const count = (value as Record<string, unknown>).attempts;
  return typeof count === "number" && Number.isInteger(count) && count >= 0 ? count : 0;
}

export function evaluateResearchRescue(input: {
  candidate: RecoverableResearchCandidate;
  packet: ResearchPacket | null;
  previousPacket: ResearchPacket | null;
  nowMs: number;
}): ResearchRescueDecision {
  const { candidate, packet, previousPacket, nowMs } = input;
  const evidenceChars = packet ? researchPacketEvidenceChars(packet) : 0;
  const previousEvidenceChars = previousPacket ? researchPacketEvidenceChars(previousPacket) : 0;
  const hold = (): ResearchRescueDecision => ({
    retry: false, reason: "hold", evidenceChars, previousEvidenceChars,
  });
  if (!isRecoverableResearchFailure(candidate) || !packet || retryCount(candidate) >= 1) return hold();
  if (!newsroomPacketHasTexasIncidentEvidence(packet)) return hold();
  const createdMs = Date.parse(candidate.created_at);
  const updatedMs = Date.parse(candidate.updated_at);
  if (!Number.isFinite(createdMs) || createdMs > nowMs + 60_000 || createdMs < nowMs - NEWS_WINDOW_MS) return hold();
  if (!Number.isFinite(updatedMs) || updatedMs > nowMs + 60_000 || updatedMs > nowMs - PROVIDER_COOLDOWN_MS) return hold();

  const category = categoryForPillar(packet.pillar).toLowerCase();
  const minEvidence = category === "sports" || category === "education" || category === "non-political" ? 9000 : 5000;
  // Require the exact same primary-record or independent-publisher check as
  // the protected publisher. An unverified isPrimarySource flag alone is NOT
  // proof that the source URL is a government or other primary record.
  if (evidenceChars < minEvidence || !newsroomHasPublisherDiversity(packet.sources)) return hold();
  const transientProvider = TRANSIENT_PROVIDER.test(String(candidate.rejection_reason || ""));
  if (transientProvider) return { retry: true, reason: "transient_provider", evidenceChars, previousEvidenceChars };
  // Local draft failures require materially *new* verified source evidence;
  // never regenerate from an identical packet or pad a draft to a word quota.
  if (!previousPacket || evidenceChars < previousEvidenceChars + MIN_RESEARCH_DELTA) return hold();
  return { retry: true, reason: "new_source_evidence", evidenceChars, previousEvidenceChars };
}
