import { describe, expect, it } from 'vitest';
import {
  allJourneyCollections,
  allTopicCollections,
  allTypeCollections,
  journeyCollection,
  relatedCollections,
  topicCollection,
  typeCollection,
} from './collections';
import { entityById } from './entities';

describe('shared entity collections', () => {
  it('builds topic collections from shared entity metadata', () => {
    const collection = topicCollection('government-elections', 'keeptxred');
    expect(collection?.route).toBe('/texas-resources/topic/government-elections');
    expect(collection?.entities.some((entity) => entity.type === 'representative')).toBe(true);
  });

  it('respects site visibility', () => {
    expect(topicCollection('government-elections', 'texasdefined')).toBeUndefined();
  });

  it('preserves configured journey order before alphabetical fallback items', () => {
    const collection = journeyCollection('buying-home', 'texasdefined');
    expect(collection?.entities.some((entity) => entity.type === 'calculator')).toBe(true);
    expect(collection?.entities[0]?.id).toBe('resource:mortgage-calculator');
    expect(collection?.entities[1]?.id).toBe('resource:property-tax-calculator');
  });

  it('builds complete type collections with canonical routes and visitor copy', () => {
    const representatives = typeCollection('representative', 'keeptxred');
    expect(representatives.entities.length).toBeGreaterThan(0);
    expect(representatives.route).toBe('/texas-resources/type/representative');
    expect(representatives.description).toContain('officeholders');
    expect(allTypeCollections('keeptxred').every((collection) => collection.entities.length > 0)).toBe(true);
  });

  it('builds complete topic and journey collection lists', () => {
    expect(allTopicCollections('keeptxred').length).toBeGreaterThan(0);
    expect(allJourneyCollections('keeptxred').length).toBeGreaterThan(0);
  });

  it('returns the related journeys, topics and type directory for an entity', () => {
    const entity = entityById('resource:mortgage-calculator');
    expect(entity).toBeDefined();
    const collections = relatedCollections(entity!, 'texasdefined');
    expect(collections.some((collection) => collection.id === 'journey:buying-home')).toBe(true);
    expect(collections.some((collection) => collection.id === 'topic:home-property')).toBe(true);
    expect(collections.some((collection) => collection.id === 'type:calculator')).toBe(true);
  });
});
