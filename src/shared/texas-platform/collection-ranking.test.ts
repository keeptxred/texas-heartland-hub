import { describe, expect, it } from 'vitest';
import { collectionItemList, rankCollectionEntities } from './collection-ranking';
import type { SharedEntity } from './entities';

const entity = (id: string, title: string, sourceResourceId?: string): SharedEntity => ({
  id,
  type: 'resource',
  title,
  summary: `${title} is a sufficiently descriptive shared Texas resource for testing.`,
  route: `/${id.replace(':', '-')}`,
  sites: ['keeptxred'],
  topics: ['test-topic'],
  journeys: ['test-journey'],
  sourceResourceId,
});

describe('collection ranking', () => {
  it('puts configured resources first in configured order', () => {
    const ranked = rankCollectionEntities(
      [entity('resource:third', 'Third', 'third'), entity('resource:first', 'First', 'first'), entity('resource:other', 'Alpha')],
      ['first', 'third'],
    );
    expect(ranked.map((item) => item.title)).toEqual(['First', 'Third', 'Alpha']);
  });

  it('does not mutate the source collection', () => {
    const source = [entity('resource:b', 'Beta', 'b'), entity('resource:a', 'Alpha', 'a')];
    rankCollectionEntities(source, ['a']);
    expect(source.map((item) => item.title)).toEqual(['Beta', 'Alpha']);
  });

  it('creates ordered ItemList schema', () => {
    const schema = collectionItemList([entity('resource:a', 'Alpha')], 'https://example.com');
    expect(schema.numberOfItems).toBe(1);
    expect(schema.itemListElement[0]).toMatchObject({ position: 1, name: 'Alpha', url: 'https://example.com/resource-a' });
  });
});
