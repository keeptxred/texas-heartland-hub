import { describe, expect, it } from 'vitest';
import type { EntitySearchResult } from './entities';
import { filterSearchResults, searchTypeCounts } from './search-filters';

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
});
