import type { SharedEntity, SharedEntityType } from './entities';

export type EntityFreshness = 'current' | 'review-soon' | 'stale' | 'unknown';

const REVIEW_DAYS: Record<SharedEntityType, number> = {
  bill: 7,
  representative: 30,
  committee: 30,
  agency: 90,
  calculator: 180,
  guide: 365,
  city: 365,
  county: 365,
  park: 365,
  'school-district': 180,
  resource: 365,
};

export type EntityQuality = {
  score: number;
  completed: number;
  possible: number;
  missing: string[];
  freshness: EntityFreshness;
  reviewBy?: string;
};

function validDate(value?: string) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time) : null;
}

export function entityReviewDays(entity: SharedEntity) {
  return REVIEW_DAYS[entity.type];
}

export function entityFreshness(entity: SharedEntity, now = new Date()): Pick<EntityQuality, 'freshness' | 'reviewBy'> {
  const reviewed = validDate(entity.lastReviewed);
  if (!reviewed) return { freshness: 'unknown' };

  const reviewBy = new Date(reviewed);
  reviewBy.setUTCDate(reviewBy.getUTCDate() + entityReviewDays(entity));
  const warningAt = new Date(reviewBy);
  warningAt.setUTCDate(warningAt.getUTCDate() - Math.min(30, Math.ceil(entityReviewDays(entity) * 0.15)));

  return {
    freshness: now > reviewBy ? 'stale' : now >= warningAt ? 'review-soon' : 'current',
    reviewBy: reviewBy.toISOString().slice(0, 10),
  };
}

export function entityQuality(entity: SharedEntity, now = new Date()): EntityQuality {
  const checks: Array<[string, boolean]> = [
    ['summary', entity.summary.trim().length >= 40],
    ['why it matters', Boolean(entity.whyItMatters?.trim())],
    ['key facts', Boolean(entity.keyFacts?.length)],
    ['official source', Boolean(entity.officialSources?.length)],
    ['topic', entity.topics.length > 0],
    ['journey', entity.journeys.length > 0],
    ['search terms', Boolean(entity.searchTerms?.length)],
    ['last reviewed', Boolean(validDate(entity.lastReviewed))],
  ];
  const completed = checks.filter(([, pass]) => pass).length;
  const freshness = entityFreshness(entity, now);
  return {
    completed,
    possible: checks.length,
    score: Math.round((completed / checks.length) * 100),
    missing: checks.filter(([, pass]) => !pass).map(([label]) => label),
    ...freshness,
  };
}

export function entitiesNeedingReview(entities: readonly SharedEntity[], now = new Date()) {
  return entities
    .map((entity) => ({ entity, quality: entityQuality(entity, now) }))
    .filter(({ quality }) =>
      quality.freshness === 'unknown' ||
      quality.freshness === 'stale' ||
      quality.freshness === 'review-soon' ||
      quality.score < 75,
    )
    .sort((a, b) => a.quality.score - b.quality.score || a.entity.title.localeCompare(b.entity.title));
}
