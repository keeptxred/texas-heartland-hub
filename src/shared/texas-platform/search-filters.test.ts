import { describe, expect, it } from 'vitest';
import type { EntitySearchResult } from './entities';
import { ENTITY_TYPE_LABELS, filterSearchResults, searchTypeCounts } from './search-filters';

const results: EntitySearchResult[] = [
  {
    id: 'calculator:tax',
    type: 'calculator',
    title: 'Tax Calculator',
    summary: 'Estimate Texas property taxes for a home.',
    route: '/tax-calculator',
    sites: ['keeptxred'],
    topics: ['home-property'],
    journeys: ['buying-home'],
    score: 80,
  },
  {
    id: 'representative:test',
    type: 'representative',
    title: 'Test Representative',
    summary: 'A Texas representative profile.',
    route: '/representatives/test',
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    score: 70,
  },
  {
    id: 'calculator:mortgage',
    type: 'calculator',
    title: 'Mortgage Calculator',
    summary: 'Estimate a Texas mortgage payment.',
    route: '/texas-mortgage-calculator',
    sites: ['keeptxred'],
    topics: ['home-property'],
    journeys: ['buying-home'],
    score: 60,
  },
];

describe('shared search filters', () => {
  it('counts only entity types present in the result set', () => {
    expect(searchTypeCounts(results)).toEqual([
      { type: 'calculator', label: 'Tools', count: 2 },
      { type: 'representative', label: 'Representatives', count: 1 },
    ]);
  });

  it('returns every result for the all filter without mutating the source', () => {
    const filtered = filterSearchResults(results, 'all');
    expect(filtered).toEqual(results);
    expect(filtered).not.toBe(results);
  });

  it('filters results by entity type while preserving ranking order', () => {
    expect(filterSearchResults(results, 'calculator').map((result) => result.id)).toEqual([
      'calculator:tax',
      'calculator:mortgage',
    ]);
  });

  it('provides visitor-facing singular labels for every result card type', () => {
    expect(ENTITY_TYPE_LABELS.calculator).toBe('Calculator & Tool');
    expect(ENTITY_TYPE_LABELS['school-district']).toBe('School District');
    expect(Object.keys(ENTITY_TYPE_LABELS)).toHaveLength(11);
  });
});
