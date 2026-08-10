import { fnv1aFingerprint } from './fingerprint';
import type { ContentCandidate, ContentDecision, PlatformSite } from './content-intelligence';
export type PublicationGateStatus = 'allowed' | 'blocked' | 'override-required';
export type PublicationOverride = { candidateId: string; targetSite: PlatformSite; decisionFingerprint: string; reviewer: string; reason: string; reviewedAt: string; expiresAt: string; token: string };
export type PublicationGateResult = { status: PublicationGateStatus; publishable: boolean; decisionFingerprint: string; overrideValid: boolean; reasons: string[] };
export function fingerprintContentDecision(candidate: ContentCandidate, decision: ContentDecision): string {
  return fnv1aFingerprint({ candidate: { id: candidate.id, domain: candidate.domain, sourceSite: candidate.sourceSite, targetSite: candidate.targetSite,
    sourceCanonicalUrl: candidate.sourceCanonicalUrl, proposedUrl: candidate.proposedUrl ?? null,
    contentFingerprint: candidate.contentFingerprint ?? null, sourceFingerprint: candidate.sourceFingerprint ?? null,
    derivativePurpose: candidate.derivativePurpose ?? null }, decision });
}
export function createPublicationOverride(input: Omit<PublicationOverride, 'token'>): PublicationOverride {
  const normalized = { ...input, reviewer: input.reviewer.trim(), reason: input.reason.trim() };
  return { ...normalized, token: fnv1aFingerprint(normalized) };
}
export function validatePublicationOverride(override: PublicationOverride | undefined, candidate: ContentCandidate, decision: ContentDecision, now = new Date()) {
  const errors: string[] = [];
  if (!override) return { valid: false, errors: ['Missing publication override.'] };
  const decisionFingerprint = fingerprintContentDecision(candidate, decision);
  if (override.candidateId !== candidate.id) errors.push('Override candidate does not match.');
  if (override.targetSite !== candidate.targetSite) errors.push('Override target site does not match.');
  if (override.decisionFingerprint !== decisionFingerprint) errors.push('Override decision fingerprint does not match.');
  if (!override.reviewer.trim()) errors.push('Override reviewer is required.');
  if (override.reason.trim().length < 20) errors.push('Override reason must contain at least 20 characters.');
  if (!/^\d{4}-\d{2}-\d{2}T/.test(override.reviewedAt)) errors.push('Override reviewedAt must be an ISO timestamp.');
  if (!/^\d{4}-\d{2}-\d{2}T/.test(override.expiresAt)) errors.push('Override expiresAt must be an ISO timestamp.');
  const expiry = Date.parse(override.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= now.getTime()) errors.push('Override is expired.');
  const expected = createPublicationOverride({ candidateId: override.candidateId, targetSite: override.targetSite, decisionFingerprint: override.decisionFingerprint,
    reviewer: override.reviewer, reason: override.reason, reviewedAt: override.reviewedAt, expiresAt: override.expiresAt });
  if (override.token !== expected.token) errors.push('Override token is invalid.');
  return { valid: errors.length === 0, errors };
}
export function enforcePublicationDecision(candidate: ContentCandidate, decision: ContentDecision, override?: PublicationOverride, now = new Date()): PublicationGateResult {
  const decisionFingerprint = fingerprintContentDecision(candidate, decision);
  const reasons = [...decision.reasons];
  if (decision.disposition === 'publish-original' || decision.disposition === 'publish-derivative-with-canonical-reference') return { status: 'allowed', publishable: true, decisionFingerprint, overrideValid: false, reasons };
  if (decision.disposition === 'reject-duplicate' || decision.disposition === 'cross-link-only') return { status: 'blocked', publishable: false, decisionFingerprint, overrideValid: false, reasons: [...reasons, 'This disposition cannot be overridden for publication.'] };
  const validation = validatePublicationOverride(override, candidate, decision, now);
  if (!validation.valid) return { status: 'override-required', publishable: false, decisionFingerprint, overrideValid: false, reasons: [...reasons, ...validation.errors] };
  return { status: 'allowed', publishable: true, decisionFingerprint, overrideValid: true, reasons: [...reasons, 'A valid reviewed override permits this manual-review candidate to proceed.'] };
}
