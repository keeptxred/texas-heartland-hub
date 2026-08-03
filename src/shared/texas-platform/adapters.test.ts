import { describe, expect, it } from 'vitest';
import { billToSharedEntity, committeeToSharedEntity, mergeEntityCollections, placeToSharedEntity } from './adapters';
import { searchEntities } from './entities';

 describe('shared Texas platform adapters', () => {
  it('normalizes a bill into the canonical entity contract', () => {
    const entity = billToSharedEntity({
      id: '89R-HB-149',
      identifier: 'HB 149',
      caption: 'Relating to property tax relief',
      chamber: 'House',
      status: 'Filed',
      session: '89th Regular Session',
      route: '/bills/89r/hb-149',
      sponsors: ['Charles Schwertner'],
      subjects: ['Property taxes'],
    });

    expect(entity.id).toBe('bill:89R-HB-149');
    expect(entity.type).toBe('bill');
    expect(entity.title).toContain('HB 149');
    expect(entity.searchTerms).toContain('Charles Schwertner');
    expect(entity.sites).toEqual(['keeptxred']);
  });

  it('normalizes committees and places with site-safe visibility', () => {
    const committee = committeeToSharedEntity({
      id: 'house-ways-means',
      name: 'House Ways and Means Committee',
      chamber: 'House',
      route: '/texas-legislature/committees/house-ways-means',
      officialUrl: 'https://house.texas.gov/committees/',
    });
    const city = placeToSharedEntity({
      id: 'katy',
      type: 'city',
      name: 'Katy',
      parentName: 'Harris and Fort Bend counties',
      route: '/texas/cities/katy',
    });

    expect(committee.type).toBe('committee');
    expect(committee.sites).toEqual(['keeptxred']);
    expect(city.type).toBe('city');
    expect(city.sites).toEqual(['keeptxred', 'texasdefined']);
  });

  it('merges entity collections by canonical id', () => {
    const first = placeToSharedEntity({ id: 'katy', type: 'city', name: 'Katy', route: '/katy' });
    const replacement = { ...first, summary: 'Updated summary.' };
    const merged = mergeEntityCollections([first], [replacement]);

    expect(merged).toHaveLength(1);
    expect(merged[0].summary).toBe('Updated summary.');
  });

  it('finds full-name representative entities in universal search', () => {
    const results = searchEntities('Charles Schwertner', 'keeptxred');
    expect(results[0]?.title).toBe('Charles Schwertner');
    expect(results[0]?.type).toBe('representative');
  });
});
