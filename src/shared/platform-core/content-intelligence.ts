export type PlatformSite = 'TexasDefined' | 'KeepTXRed';
export type ContentDomain = 'travel' | 'food' | 'events' | 'history' | 'moving' | 'home-garden' | 'real-estate' | 'property-tax' | 'shopping' | 'politics' | 'elections' | 'legislation' | 'breaking-news' | 'government-accountability' | 'texas-culture';
export type ContentOwnershipRule = { domain: ContentDomain; owner: PlatformSite; secondarySite?: PlatformSite; derivativeAllowed: boolean; fullRepublicationAllowed: boolean; crossSiteLinkPreferred: boolean; rationale: string };
export type ContentCandidate = { id: string; title: string; domain: ContentDomain; sourceSite: PlatformSite; targetSite: PlatformSite; sourceCanonicalUrl: string; proposedUrl?: string; contentFingerprint?: string; sourceFingerprint?: string; derivativePurpose?: 'summary' | 'context' | 'guide' | 'news-update' | 'commerce' };
export type ContentDisposition = 'publish-original' | 'publish-derivative-with-canonical-reference' | 'cross-link-only' | 'reject-duplicate' | 'manual-review';
export type ContentDecision = { disposition: ContentDisposition; canonicalOwner: PlatformSite; canonicalUrl: string; robots: 'index,follow' | 'noindex,follow'; requiredAttribution: boolean; reasons: string[] };

export type StoryRoutingInput = {
  title: string;
  description?: string | null;
  category?: string | null;
  source?: string | null;
  fallbackDomain?: ContentDomain;
};

export type StoryRoutingDecision = {
  domain: ContentDomain;
  owner: PlatformSite;
  secondarySite?: PlatformSite;
  derivativePurpose?: ContentCandidate['derivativePurpose'];
  confidence: 'high' | 'medium' | 'fallback';
  reasons: string[];
};

export const CONTENT_OWNERSHIP_RULES: ContentOwnershipRule[] = [rule('travel','TexasDefined',true),rule('food','TexasDefined',true),rule('events','TexasDefined',true),rule('history','TexasDefined',true),rule('moving','TexasDefined',true),rule('home-garden','TexasDefined',true),rule('real-estate','TexasDefined',true),rule('property-tax','TexasDefined',true),rule('shopping','TexasDefined',true),rule('texas-culture','TexasDefined',true),rule('politics','KeepTXRed',false),rule('elections','KeepTXRed',false),rule('legislation','KeepTXRed',false),rule('breaking-news','KeepTXRed',true),rule('government-accountability','KeepTXRed',false)];
export function ownershipRuleFor(domain: ContentDomain) { const found = CONTENT_OWNERSHIP_RULES.find((entry) => entry.domain === domain); if (!found) throw new Error(`No content ownership rule for ${domain}.`); return found; }

export function classifyStoryOwnership(input: StoryRoutingInput): StoryRoutingDecision {
  const text = `${input.title ?? ''} ${input.description ?? ''} ${input.category ?? ''} ${input.source ?? ''}`.toLowerCase();
  const reasons: string[] = [];

  // Government action, elections, regulation, litigation and public-safety events
  // are newsroom/public-affairs stories even when the subject is a hospital,
  // university, restaurant, attraction, sports team or other lifestyle entity.
  if (/\b(election|ballot|voter|polling (?:place|site)|candidate|campaign|redistrict)/.test(text)) {
    return route('elections', 'KeepTXRed', 'high', ['Election or voting impact.']);
  }
  if (/\b(legislat|lawmakers?|house bill|senate bill|\bhb\s*\d+\b|\bsb\s*\d+\b|signed into law|bill becomes law)/.test(text)) {
    return route('legislation', 'KeepTXRed', 'high', ['Legislation or lawmaking.']);
  }
  if (/\b(attorney general|governor|secretary of state|commissioners court|city council|county judge|state agency|department of public safety|dps|tdem|texas workforce commission|workforce solutions|grant awarded|public funds?)/.test(text)) {
    return route('breaking-news', 'KeepTXRed', 'high', ['Government or public-agency action.'], 'context');
  }
  if (/\b(lawsuit|sues?|court|judge|ruling|injunction|restraining order|first amendment|civil rights|religious freedom|extradition|indicted|charged|arrested|fired officers?|disciplinary hearing)/.test(text)) {
    return route('government-accountability', 'KeepTXRed', 'high', ['Court, accountability, or enforcement story.']);
  }
  if (/\b(wildfire|evacuation|emergency|disaster|hurricane|tornado|flood|public safety|crime|police|sheriff|stolen firearms?|vehicle burglar)/.test(text)) {
    return route('breaking-news', 'KeepTXRed', 'high', ['Breaking public-safety impact.'], 'context');
  }
  if (/\b(back wages?|minimum wage|overtime|child labor|labor violation|workforce grant|layoffs?|job cuts?|economic development|skills development fund)/.test(text)) {
    return route('breaking-news', 'KeepTXRed', 'high', ['Labor, workforce, or statewide economic news.'], 'context');
  }

  // Lifestyle ownership is based on the story itself, not the feed it came from.
  if (/\b(best hospitals?|hospital ranking|ranked (?:no\.?\s*)?1|u\.s\. news.*hospital|health ranking|medical center ranking)/.test(text)) {
    return route('texas-culture', 'TexasDefined', 'high', ['Consumer health/rankings story.'], 'news-update');
  }
  if (/\b(moving to texas|moving destination|migration report|gen z|millennials?|relocat|newcomers?)/.test(text)) {
    return route('moving', 'TexasDefined', 'high', ['Relocation or migration lifestyle story.'], 'context');
  }
  if (/\b(museum|attraction|theme park|six flags|state fair|rodeo|festival|concert|birthday deal|anniversary deal|whataburger|buc-ee'?s|heb\b|h-e-b|restaurant|bakery|food finalist|menu item)/.test(text)) {
    const domain: ContentDomain = /\b(restaurant|bakery|food|menu|whataburger|h-e-b|heb\b)/.test(text) ? 'food' : /\b(fair|rodeo|festival|concert)/.test(text) ? 'events' : 'texas-culture';
    return route(domain, 'TexasDefined', 'high', ['Texas lifestyle, food, event, or attraction story.'], 'news-update');
  }
  if (/\b(travel|road trip|state park|lake|river|cavern|beach|tourism|visitor|things to do)/.test(text)) {
    return route('travel', 'TexasDefined', 'high', ['Travel or destination story.'], 'guide');
  }
  if (/\b(real estate|housing market|homebuyer|mortgage|home value|property market)/.test(text)) {
    return route('real-estate', 'TexasDefined', 'medium', ['Consumer housing/real-estate story.'], 'context');
  }
  if (/\b(cowboys|texans|astros|rangers|mavericks|spurs|stars|fc dallas|dynamo|austin fc|longhorns|aggies|red raiders|horned frogs|sports?|football|baseball|basketball|hockey|soccer)/.test(text)) {
    if (/\b(today|tonight|game|match|score|win|loss|injury|roster|contract|trade|draft|coach|player|season|playoffs?|standings|schedule|opens? play|ownership stake)/.test(text)) {
      return route('breaking-news', 'KeepTXRed', 'medium', ['Current Texas sports news.'], 'context');
    }
    return route('texas-culture', 'TexasDefined', 'medium', ['Evergreen sports culture/fan story.'], 'guide');
  }
  if (/\b(history|historic|anniversary of|on this day)/.test(text)) {
    return route('history', 'TexasDefined', 'medium', ['Texas history or heritage story.'], 'context');
  }

  const fallback = input.fallbackDomain ?? 'breaking-news';
  const fallbackRule = ownershipRuleFor(fallback);
  reasons.push(`No strong story-level signal; using ${fallback} ownership.`);
  return {
    domain: fallback,
    owner: fallbackRule.owner,
    ...(fallbackRule.secondarySite ? { secondarySite: fallbackRule.secondarySite } : {}),
    ...(fallbackRule.derivativeAllowed ? { derivativePurpose: 'context' as const } : {}),
    confidence: 'fallback',
    reasons,
  };
}

function route(domain: ContentDomain, owner: PlatformSite, confidence: StoryRoutingDecision['confidence'], reasons: string[], derivativePurpose?: ContentCandidate['derivativePurpose']): StoryRoutingDecision {
  return { domain, owner, secondarySite: owner === 'KeepTXRed' ? 'TexasDefined' : 'KeepTXRed', ...(derivativePurpose ? { derivativePurpose } : {}), confidence, reasons };
}

export function decideCrossSiteContent(candidate: ContentCandidate): ContentDecision {
  const rule = ownershipRuleFor(candidate.domain); const reasons: string[] = [];
  const exactDuplicate = Boolean(candidate.contentFingerprint && candidate.sourceFingerprint && candidate.contentFingerprint === candidate.sourceFingerprint);
  if (candidate.targetSite === rule.owner) { reasons.push(`${rule.owner} owns the ${candidate.domain} domain.`); return { disposition: candidate.sourceSite === rule.owner ? 'publish-original' : 'manual-review', canonicalOwner: rule.owner, canonicalUrl: candidate.proposedUrl ?? candidate.sourceCanonicalUrl, robots: 'index,follow', requiredAttribution: candidate.sourceSite !== rule.owner, reasons }; }
  if (exactDuplicate) { reasons.push('The proposed content matches the source fingerprint.', `The canonical owner is ${rule.owner}.`); return { disposition: 'reject-duplicate', canonicalOwner: rule.owner, canonicalUrl: candidate.sourceCanonicalUrl, robots: 'noindex,follow', requiredAttribution: true, reasons }; }
  if (rule.derivativeAllowed && candidate.derivativePurpose) { reasons.push(`A distinct ${candidate.derivativePurpose} derivative is allowed.`, `The original remains canonically owned by ${rule.owner}.`); return { disposition: 'publish-derivative-with-canonical-reference', canonicalOwner: rule.owner, canonicalUrl: candidate.proposedUrl ?? candidate.sourceCanonicalUrl, robots: 'index,follow', requiredAttribution: true, reasons }; }
  if (!rule.fullRepublicationAllowed) { reasons.push('Full republication is prohibited for this domain.', `The canonical owner is ${rule.owner}.`); return { disposition: 'cross-link-only', canonicalOwner: rule.owner, canonicalUrl: candidate.sourceCanonicalUrl, robots: 'noindex,follow', requiredAttribution: true, reasons }; }
  reasons.push('No approved derivative purpose was supplied.'); return { disposition: rule.crossSiteLinkPreferred ? 'cross-link-only' : 'manual-review', canonicalOwner: rule.owner, canonicalUrl: candidate.sourceCanonicalUrl, robots: 'noindex,follow', requiredAttribution: true, reasons };
}
export function validateContentOwnershipRules(rules: ContentOwnershipRule[] = CONTENT_OWNERSHIP_RULES) { const errors: string[] = []; const domains = new Set<ContentDomain>(); for (const rule of rules) { if (domains.has(rule.domain)) errors.push(`Duplicate content domain: ${rule.domain}`); domains.add(rule.domain); if (rule.secondarySite === rule.owner) errors.push(`Secondary site matches owner for ${rule.domain}.`); if (rule.fullRepublicationAllowed && !rule.derivativeAllowed) errors.push(`Full republication requires derivative permission for ${rule.domain}.`); if (!rule.rationale.trim()) errors.push(`Missing rationale for ${rule.domain}.`); } return { valid: errors.length === 0, errors }; }
function rule(domain: ContentDomain, owner: PlatformSite, derivativeAllowed: boolean): ContentOwnershipRule { return { domain, owner, secondarySite: owner === 'TexasDefined' ? 'KeepTXRed' : 'TexasDefined', derivativeAllowed, fullRepublicationAllowed: false, crossSiteLinkPreferred: true, rationale: `${owner} is the canonical editorial owner for ${domain} content.` }; }
