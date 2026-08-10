import { describe, expect, it } from 'vitest';
import type { SharedEntity } from './entities';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { sharedSearchContentGaps } from './search-content-gaps';

const entities: SharedEntity[] = [
  {
    id: 'resource:taxes',
    type: 'guide',
    title: 'Texas Property Tax Guide',
    summary: 'Understand property taxes and exemptions.',
    route: '/property-taxes',
    sites: ['keeptxred', 'texasdefined'],
    topics: ['home-property'],
    journeys: ['buying-home'],
    searchTerms: ['property tax homestead exemption'],
  },
];

function event(query: string, resultCount: number, clickedEntityId?: string) {
  return createSharedSearchTelemetryEvent({ query, resultCount, selectedType: 'all', clickedEntityId, occurredAt: '2026-08-03T00:00:00.000Z' });
}

describe('search content gaps', () => {
  it('recommends creating content when no current entity matches', () => {
    const gaps = sharedSearchContentGaps([event('vehicle registration', 0), event('vehicle registration', 0)], entities, 'keeptxred');
    expect(gaps[0]).toEqual(expect.objectContaining({ query: 'vehicle registration', recommendation: 'create-content', currentMatches: 0 }));
  });

  it('recommends ranking improvements when results exist but receive no clicks', () => {
    const gaps = sharedSearchContentGaps(Array.from({ length: 5 }, () => event('property taxes', 2)), entities, 'keeptxred');
    expect(gaps[0]).toEqual(expect.objectContaining({ recommendation: 'improve-ranking', currentMatches: 1 }));
  });

  it('omits successful searches with clicks', () => {
    const gaps = sharedSearchContentGaps([event('property taxes', 1, 'resource:taxes')], entities, 'keeptxred');
    expect(gaps).toEqual([]);
  });
});
