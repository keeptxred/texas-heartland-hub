import { describe, expect, it } from 'vitest';
import { allJourneyCollections, allTopicCollections, journeyCollection, topicCollection, typeCollection } from './collections';

describe('shared entity collections', () => {
  it('builds topic collections from shared entity metadata', () => {
    const collection = topicCollection('government-elections', 'keeptxred');
    expect(collection?.route).toBe('/texas-resources/topic/government-elections');
    expect(collection?.entities.some((entity) => entity.type === 'representative')).toBe(true);
  });

  it('respects site visibility', () => {
    expect(topicCollection('government-elections', 'texasdefined')).toBeUndefined();
  });

  it('builds journey collections', () => {
    const collection = journeyCollection('buying-home', 'keeptxred');
    expect(collection?.entities.some((entity) => entity.type === 'calculator')).toBe(true);
  });

  it('builds type collections and complete collection lists', () => {
    expect(typeCollection('representative', 'keeptxred').entities.length).toBeGreaterThan(0);
    expect(allTopicCollections('keeptxred').length).toBeGreaterThan(0);
    expect(allJourneyCollections('keeptxred').length).toBeGreaterThan(0);
  });
});
