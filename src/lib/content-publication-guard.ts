import {
  decideCrossSiteContent,
  enforcePublicationDecision,
  type ContentCandidate,
  type ContentDomain,
  type PublicationOverride,
} from '@/shared/platform-core';
import { recordGovernanceDecision } from '@/platform/governance-event-store';

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
  writer?: string;
};

export type KeepTxRedPublicationGuard = ReturnType<typeof guardKeepTxRedPublication>;

export function guardKeepTxRedPublication(input: KeepTxRedPublicationInput) {
  const resolvedDomain = resolveKeepTxRedPublicationDomain(input.domain, input.title);
  const candidate: ContentCandidate = {
    id: input.id,
    title: input.title,
    domain: resolvedDomain,
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
  const governanceEventIds = recordGovernanceDecision({
    candidate,
    decision,
    gate,
    override: input.override,
    writer: input.writer ?? 'internal-publication-guard',
  });
  return { candidate, decision, gate, governanceEventIds };
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
      governanceEventIds: result.governanceEventIds,
    });
    throw error;
  }
  return result;
}

export function resolveKeepTxRedPublicationDomain(
  domain: ContentDomain,
  context?: string | null,
): ContentDomain {
  const value = context?.toLowerCase() ?? '';

  // Sports belongs on both sites according to article intent, not source domain.
  // Current team/player/game/news coverage belongs to KeepTXRed. Evergreen sports
  // culture, venue, history, travel and guide content remains TexasDefined-owned.
  if (isCurrentSportsNews(value)) return 'breaking-news';
  if (isEvergreenSportsFeature(value)) return 'texas-culture';

  return domain === 'politics' ? inferKeepTxRedDomain(domain, context) : domain;
}

export function inferKeepTxRedDomain(
  category: string | null | undefined,
  context?: string | null,
): ContentDomain {
  const value = `${category ?? ''} ${context ?? ''}`.toLowerCase();
  if (isCurrentSportsNews(value)) return 'breaking-news';
  if (isEvergreenSportsFeature(value)) return 'texas-culture';
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

function isCurrentSportsNews(value: string): boolean {
  if (!hasTexasSportsSignal(value) || isEvergreenSportsFeature(value)) return false;

  return /\b(news|today|tonight|practice|training camp|preseason|season|game|match|series|score|win|loss|defeat|beats?|faces?|facing|injury|injured|roster|depth chart|starter|starting|position|contract|extension|signs?|signed|waived|released|activated|trade|traded|draft|coach|player|quarterback|touchdown|pitcher|home run|playoffs?|standings|schedule|recap|preview|press conference|availability|suspension)\b/.test(value)
    || /\b(vs\.?|at)\b/.test(value);
}

function isEvergreenSportsFeature(value: string): boolean {
  if (!hasTexasSportsSignal(value)) return false;

  return /\b(history of|historic|tradition|culture|guide to|visitor guide|travel guide|best stadiums?|best ballparks?|things to do|things to know|where to watch|stadium tour|ballpark tour|fan guide|ultimate guide|explained|why .* defines texas)\b/.test(value);
}

function hasTexasSportsSignal(value: string): boolean {
  return /\b(sports?|football|baseball|basketball|hockey|soccer|nfl|mlb|nba|nhl|mls|college football|high school football|cowboys|dallas cowboys|texans|houston texans|astros|houston astros|rangers|texas rangers|mavericks|dallas mavericks|spurs|san antonio spurs|stars|dallas stars|longhorns|texas longhorns|aggies|texas a&m|red raiders|texas tech|horned frogs|tcu|baylor bears|houston cougars|rice owls|smu mustangs|fc dallas|houston dynamo|austin fc|wings|dallas wings)\b/.test(value);
}
