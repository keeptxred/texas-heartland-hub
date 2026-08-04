export type TexasLifeAudience = 'resident' | 'moving' | 'business' | 'visitor';

export type TexasLifeContext = {
  resourceId?: string;
  journeyId?: string;
  audience?: TexasLifeAudience;
  city?: string;
  county?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  changedTopics?: string[];
};

export type TexasLifeRecommendation = {
  id: string;
  title: string;
  href: string;
  description: string;
  resourceId?: string;
  journeyIds?: string[];
  audiences?: TexasLifeAudience[];
  cities?: string[];
  counties?: string[];
  seasons?: TexasLifeContext['season'][];
  topics?: string[];
  baseScore?: number;
};

export type RankedTexasLifeRecommendation = TexasLifeRecommendation & {
  score: number;
  reasons: string[];
};

function normalized(value?: string) {
  return value?.trim().toLowerCase();
}

function includesNormalized(values: readonly string[] | undefined, value?: string) {
  const target = normalized(value);
  return Boolean(target && values?.some((item) => normalized(item) === target));
}

export function rankTexasLifeRecommendations(
  recommendations: ReadonlyArray<TexasLifeRecommendation>,
  context: TexasLifeContext,
  limit = 6,
): RankedTexasLifeRecommendation[] {
  if (!Number.isInteger(limit) || limit < 0) throw new Error('Recommendation limit must be a non-negative integer.');

  return recommendations
    .filter((item) => item.href.startsWith('/'))
    .map((item) => {
      let score = item.baseScore ?? 0;
      const reasons: string[] = [];
      if (context.resourceId && item.resourceId === context.resourceId) {
        score += 10;
        reasons.push('current-resource');
      }
      if (context.journeyId && item.journeyIds?.includes(context.journeyId)) {
        score += 8;
        reasons.push('same-journey');
      }
      if (context.audience && item.audiences?.includes(context.audience)) {
        score += 6;
        reasons.push('audience-match');
      }
      if (includesNormalized(item.cities, context.city)) {
        score += 5;
        reasons.push('same-city');
      }
      if (includesNormalized(item.counties, context.county)) {
        score += 5;
        reasons.push('same-county');
      }
      if (context.season && item.seasons?.includes(context.season)) {
        score += 3;
        reasons.push('seasonal');
      }
      const changed = new Set((context.changedTopics ?? []).map((topic) => normalized(topic)));
      if (item.topics?.some((topic) => changed.has(normalized(topic)))) {
        score += 4;
        reasons.push('recent-change');
      }
      return { ...item, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
