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

export function inferKeepTxRedDomain(
  category: string | null | undefined,
  context?: string | null,
): ContentDomain {
  const value = `${category ?? ''} ${context ?? ''}`.toLowerCase();
  if (value.includes('election') || value.includes('ballot') || value.includes('voter')) return 'elections';
  if (value.includes('legislat') || /\b(hb|sb)\s*\d+\b/.test(value) || value.includes('bill becomes law')) return 'legislation';
  if (value.includes('accountability') || value.includes('investigation') || value.includes('ethics complaint')) return 'government-accountability';
  if (value.includes('property tax') || value.includes('homestead exemption') || value.includes('appraisal district')) return 'property-tax';
  if (value.includes('moving') || value.includes('migration') || value.includes('relocat') || value.includes('newcomer')) return 'moving';
  if (value.includes('real estate') || value.includes('housing') || value.includes('mortgage') || value.includes('homebuyer')) return 'real-estate';
  if (value.includes('home & garden') || value.includes('home and garden') || value.includes('gardening')) return 'home-garden';
  if (value.includes('travel') || value.includes('state park') || value.includes('road trip') || value.includes('tourism')) return 'travel';
  if (value.includes('food') || value.includes('barbecue') || value.includes('bbq') || value.includes('tex-mex') || value.includes('restaurant')) return 'food';
  if (value.includes('event') || value.includes('festival') || value.includes('fair ')) return 'events';
  if (value.includes('history') || value.includes('historic')) return 'history';
  if (value.includes('shop') || value.includes('commerce') || value.includes('gift guide') || value.includes('product review')) return 'shopping';
  if (value.includes('culture') || value.includes('identity') || value.includes('small-town texas')) return 'texas-culture';
  if (value.includes('breaking') || value.includes('news') || value.includes('non-political')) return 'breaking-news';
  return 'politics';
}
