import { describe, expect, it } from 'vitest';
import { searchEntityCollection, type SharedEntity } from './entities';

const entities: SharedEntity[] = [
  {
    id: 'city:el-nino',
    type: 'city',
    title: 'El Niño',
    summary: 'A Texas community profile.',
    route: '/cities/el-nino',
    sites: ['keeptxred'],
    topics: ['cities-counties'],
    journeys: [],
  },
  {
    id: 'representative:charles-schwertner',
    type: 'representative',
    title: 'Charles Schwertner',
    summary: 'Texas senator representing Senate District 5.',
    route: '/representatives/charles-schwertner',
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    searchTerms: ['Senate District 5'],
  },
];

describe('shared entity search', () => {
  it('matches accent-insensitive queries', () => {
    expect(searchEntityCollection('el nino', entities, 'keeptxred')[0]?.id).toBe('city:el-nino');
  });

  it('prioritizes a complete person name', () => {
    expect(searchEntityCollection('Charles Schwertner', entities, 'keeptxred')[0]?.id).toBe(
      'representative:charles-schwertner',
    );
  });

  it('does not return noisy results for one-character or stop-word-only queries', () => {
    expect(searchEntityCollection('a', entities, 'keeptxred')).toEqual([]);
    expect(searchEntityCollection('the', entities, 'keeptxred')).toEqual([]);
  });

  it('respects site visibility', () => {
    expect(searchEntityCollection('Charles Schwertner', entities, 'texasdefined')).toEqual([]);
  });
});
