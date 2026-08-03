import { describe, expect, it } from 'vitest';
import { searchEntityCollection, type SharedEntity } from './entities';
import { countFuzzyTokenMatches, fuzzyTokenMatch, levenshteinDistance } from './search-fuzzy';

const entities: SharedEntity[] = [
  {
    id: 'representative:charles-schwertner',
    type: 'representative',
    title: 'Charles Schwertner',
    summary: 'Texas senator representing Senate District 5.',
    route: '/representatives/charles-schwertner',
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    searchTerms: ['senator legislator representative'],
  },
  {
    id: 'resource:mortgage-calculator',
    type: 'calculator',
    title: 'Texas Mortgage Calculator',
    summary: 'Estimate a monthly home payment.',
    route: '/texas-mortgage-calculator',
    sites: ['keeptxred', 'texasdefined'],
    topics: ['home-property'],
    journeys: ['buying-home'],
  },
];

describe('shared search typo tolerance', () => {
  it('calculates bounded edit distance', () => {
    expect(levenshteinDistance('mortgage', 'mortage', 2)).toBe(1);
    expect(levenshteinDistance('senator', 'calculator', 1)).toBeGreaterThan(1);
  });

  it('accepts conservative long-token typos and rejects short noisy terms', () => {
    expect(fuzzyTokenMatch('schwertnr', 'schwertner')).toBe(true);
    expect(fuzzyTokenMatch('mortage', 'mortgage')).toBe(true);
    expect(fuzzyTokenMatch('tax', 'texas')).toBe(false);
  });

  it('counts fuzzy matches without double-counting candidate words', () => {
    expect(countFuzzyTokenMatches(['charls', 'schwertnr'], 'Charles Schwertner')).toBe(2);
  });

  it('finds a representative when the last name contains a small typo', () => {
    const results = searchEntityCollection('Charles Schwertnr', entities, 'keeptxred');
    expect(results[0]?.id).toBe('representative:charles-schwertner');
  });

  it('finds a calculator when a long word is misspelled', () => {
    const results = searchEntityCollection('mortage', entities, 'keeptxred');
    expect(results[0]?.id).toBe('resource:mortgage-calculator');
  });

  it('does not leak KeepTXRed-only fuzzy matches into TexasDefined', () => {
    expect(searchEntityCollection('Schwertnr', entities, 'texasdefined')).toEqual([]);
  });
});
