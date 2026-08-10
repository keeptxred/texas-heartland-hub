import { fnv1aFingerprint } from './fingerprint';
import type { ContentDisposition, ContentDomain, PlatformSite } from './content-intelligence';
import type { PublicationGateStatus } from './publication-gate';

export type GovernanceEventKind =
  | 'decision-evaluated'
  | 'publication-allowed'
  | 'publication-blocked'
  | 'override-required'
  | 'override-accepted'
  | 'override-rejected'
  | 'ownership-drift-detected';

export type GovernanceEvent = {
  id: string;
  occurredAt: string;
  kind: GovernanceEventKind;
  site: PlatformSite;
  domain: ContentDomain;
  disposition: ContentDisposition;
  gateStatus: PublicationGateStatus;
  decisionFingerprint: string;
  candidateFingerprint: string;
  canonicalOwner: PlatformSite;
  sourceSite: PlatformSite;
  overrideUsed: boolean;
  writer?: string;
  reasonCodes: string[];
};

export type GovernanceEventInput = Omit<GovernanceEvent, 'id' | 'candidateFingerprint' | 'reasonCodes'> & {
  candidateId: string;
  title?: string;
  sourceCanonicalUrl?: string;
  proposedUrl?: string;
  reasonCodes?: string[];
};

export type GovernanceSummary = {
  total: number;
  allowed: number;
  blocked: number;
  overrideRequired: number;
  overridesAccepted: number;
  overridesRejected: number;
  ownershipDrift: number;
  bySite: Record<PlatformSite, number>;
  byDomain: Partial<Record<ContentDomain, number>>;
  byDisposition: Partial<Record<ContentDisposition, number>>;
  blockedRate: number;
  overrideAcceptanceRate: number;
};

export function createGovernanceEvent(input: GovernanceEventInput): GovernanceEvent {
  const candidateFingerprint = fnv1aFingerprint({ candidateId: input.candidateId, title: input.title ?? null, sourceCanonicalUrl: input.sourceCanonicalUrl ?? null, proposedUrl: input.proposedUrl ?? null });
  const normalized = {
    occurredAt: input.occurredAt,
    kind: input.kind,
    site: input.site,
    domain: input.domain,
    disposition: input.disposition,
    gateStatus: input.gateStatus,
    decisionFingerprint: input.decisionFingerprint,
    candidateFingerprint,
    canonicalOwner: input.canonicalOwner,
    sourceSite: input.sourceSite,
    overrideUsed: input.overrideUsed,
    writer: input.writer?.trim() || undefined,
    reasonCodes: normalizeReasonCodes(input.reasonCodes ?? []),
  };
  return { id: fnv1aFingerprint(normalized), ...normalized };
}

export function validateGovernanceEvent(event: GovernanceEvent): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}T/.test(event.occurredAt)) errors.push('occurredAt must be an ISO timestamp.');
  if (!/^fnv1a-[0-9a-f]{8}$/.test(event.id)) errors.push('Event id must be a deterministic fingerprint.');
  if (!/^fnv1a-[0-9a-f]{8}$/.test(event.candidateFingerprint)) errors.push('Candidate fingerprint is invalid.');
  if (!event.decisionFingerprint) errors.push('decisionFingerprint is required.');
  if (event.kind === 'publication-allowed' && event.gateStatus !== 'allowed') errors.push('Allowed event requires an allowed gate status.');
  if (event.kind === 'publication-blocked' && event.gateStatus !== 'blocked') errors.push('Blocked event requires a blocked gate status.');
  if (event.kind === 'override-required' && event.gateStatus !== 'override-required') errors.push('Override-required event requires override-required gate status.');
  if (event.kind === 'override-accepted' && !event.overrideUsed) errors.push('Accepted override event must record overrideUsed.');
  return { valid: errors.length === 0, errors };
}

export function summarizeGovernanceEvents(events: GovernanceEvent[]): GovernanceSummary {
  const summary: GovernanceSummary = { total: events.length, allowed: 0, blocked: 0, overrideRequired: 0, overridesAccepted: 0, overridesRejected: 0, ownershipDrift: 0, bySite: { TexasDefined: 0, KeepTXRed: 0 }, byDomain: {}, byDisposition: {}, blockedRate: 0, overrideAcceptanceRate: 0 };
  for (const event of events) {
    summary.bySite[event.site] += 1;
    summary.byDomain[event.domain] = (summary.byDomain[event.domain] ?? 0) + 1;
    summary.byDisposition[event.disposition] = (summary.byDisposition[event.disposition] ?? 0) + 1;
    if (event.kind === 'publication-allowed') summary.allowed += 1;
    if (event.kind === 'publication-blocked') summary.blocked += 1;
    if (event.kind === 'override-required') summary.overrideRequired += 1;
    if (event.kind === 'override-accepted') summary.overridesAccepted += 1;
    if (event.kind === 'override-rejected') summary.overridesRejected += 1;
    if (event.kind === 'ownership-drift-detected') summary.ownershipDrift += 1;
  }
  summary.blockedRate = rate(summary.blocked, summary.allowed + summary.blocked);
  summary.overrideAcceptanceRate = rate(summary.overridesAccepted, summary.overridesAccepted + summary.overridesRejected);
  return summary;
}

export function detectOwnershipDrift(events: GovernanceEvent[]) {
  return events.filter((event) => event.site !== event.canonicalOwner && event.gateStatus === 'allowed' && !event.overrideUsed);
}

function normalizeReasonCodes(values: string[]) {
  return [...new Set(values.map((value) => value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')).filter(Boolean))].sort();
}
function rate(numerator: number, denominator: number) { return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : 0; }
