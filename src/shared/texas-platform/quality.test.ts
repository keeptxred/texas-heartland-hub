import { describe, expect, it } from 'vitest';
import type { SharedEntity } from './entities';
import { entitiesNeedingReview, entityFreshness, entityQuality } from './quality';

const completeEntity: SharedEntity = {
  id: 'guide:test',
  type: 'guide',
  title: 'Test guide',
  summary: 'A sufficiently detailed summary that clearly explains what this shared Texas guide provides.',
  whyItMatters: 'It helps Texans make a decision.',
  route: '/test-guide',
  sites: ['keeptxred', 'texasdefined'],
  topics: ['test-topic'],
  journeys: ['test-journey'],
  keyFacts: [{ label: 'Fact', value: 'Value' }],
  officialSources: [{ label: 'Official source', url: 'https://example.gov' }],
  lastReviewed: '2026-07-01',
  searchTerms: ['test guide'],
};

describe('entity quality', () => {
  it('scores complete entities at 100', () => {
    expect(entityQuality(completeEntity, new Date('2026-08-01T00:00:00Z')).score).toBe(100);
  });

  it('reports missing fields', () => {
    const quality = entityQuality({ ...completeEntity, whyItMatters: undefined, officialSources: undefined });
    expect(quality.missing).toContain('why it matters');
    expect(quality.missing).toContain('official source');
  });

  it('uses type-specific freshness windows', () => {
    const bill = { ...completeEntity, type: 'bill' as const, lastReviewed: '2026-07-01' };
    expect(entityFreshness(bill, new Date('2026-08-01T00:00:00Z')).freshness).toBe('stale');
    expect(entityFreshness(completeEntity, new Date('2026-08-01T00:00:00Z')).freshness).toBe('current');
  });

  it('prioritizes incomplete or stale entities for review', () => {
    const incomplete = { ...completeEntity, id: 'guide:incomplete', summary: 'Too short', lastReviewed: undefined };
    const results = entitiesNeedingReview([completeEntity, incomplete], new Date('2026-08-01T00:00:00Z'));
    expect(results.map(({ entity }) => entity.id)).toContain('guide:incomplete');
  });
});
