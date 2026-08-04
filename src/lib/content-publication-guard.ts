import {
  decideCrossSiteContent,
  enforcePublicationDecision,
  type ContentCandidate,
  type ContentDomain,
  type PublicationOverride,
} from '@/shared/platform-core';

export type KeepTxRedPublicationInput = {
  id: string;
  title: string;
  domain: ContentDomain;
  sourceSite?: 'TexasDefined' | 'KeepTXRed';
  sourceCanonicalUrl: string;
  proposedUrl?: string;
  contentFingerprint?: string;
  sourceFingerprint?: string;
  derivativePurpose?: ContentCandidate['derivativePurpose'];
  override?: PublicationOverride;
};

export type KeepTxRedPublicationGuard = ReturnType<typeof guardKeepTxRedPublication>;

export function guardKeepTxRedPublication(input: KeepTxRedPublicationInput) {
  const candidate: ContentCandidate = {
    id: input.id,
    title: input.title,
    domain: input.domain,
    sourceSite: input.sourceSite ?? 'KeepTXRed',
    targetSite: 'KeepTXRed',
    sourceCanonicalUrl: input.sourceCanonicalUrl,
    ...(input.proposedUrl ? { proposedUrl: input.proposedUrl } : {}),
    ...(input.contentFingerprint ? { contentFingerprint: input.contentFingerprint } : {}),
    ...(input.sourceFingerprint ? { sourceFingerprint: input.sourceFingerprint } : {}),
    ...(input.derivativePurpose ? { derivativePurpose: input.derivativePurpose } : {}),
  };
  const decision = decideCrossSiteContent(candidate);
  const gate = enforcePublicationDecision(candidate, decision, input.override);
  return { candidate, decision, gate };
}

export function assertKeepTxRedPublication(input: KeepTxRedPublicationInput) {
  const result = guardKeepTxRedPublication(input);
  if (!result.gate.publishable) {
    const error = new Error(`Publication blocked: ${result.gate.reasons.join(' ')}`);
    Object.assign(error, {
      code: 'CONTENT_PUBLICATION_BLOCKED',
      decisionFingerprint: result.gate.decisionFingerprint,
      disposition: result.decision.disposition,
      canonicalOwner: result.decision.canonicalOwner,
      canonicalUrl: result.decision.canonicalUrl,
    });
    throw error;
  }
  return result;
}

export function inferKeepTxRedDomain(category: string | null | undefined): ContentDomain {
  const value = String(category ?? '').toLowerCase();
  if (value.includes('election')) return 'elections';
  if (value.includes('legislat') || value.includes('bill')) return 'legislation';
  if (value.includes('accountability') || value.includes('investigation')) return 'government-accountability';
  if (value.includes('breaking') || value.includes('news') || value.includes('non-political')) return 'breaking-news';
  if (value.includes('travel')) return 'travel';
  if (value.includes('food')) return 'food';
  if (value.includes('event')) return 'events';
  if (value.includes('history')) return 'history';
  if (value.includes('moving')) return 'moving';
  if (value.includes('home') || value.includes('garden')) return 'home-garden';
  if (value.includes('real estate') || value.includes('housing')) return 'real-estate';
  if (value.includes('property tax')) return 'property-tax';
  if (value.includes('shop') || value.includes('commerce')) return 'shopping';
  if (value.includes('culture')) return 'texas-culture';
  return 'politics';
}
