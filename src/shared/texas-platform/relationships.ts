import type { SharedSite } from './registry.ts';
import { entityById, entitiesForSite, REPRESENTATIVE_ENTITIES, type SharedEntity } from './entities.ts';

export type SharedRelationshipType =
  | 'related-to'
  | 'next-step'
  | 'located-in'
  | 'represented-by'
  | 'affects'
  | 'official-source';

export type SharedRelationship = {
  fromId: string;
  toId: string;
  type: SharedRelationshipType;
  weight?: number;
  sites?: SharedSite[];
  bidirectional?: boolean;
};

const REPRESENTATIVE_RELATIONSHIPS: SharedRelationship[] = REPRESENTATIVE_ENTITIES.flatMap((representative) => [
  { fromId: representative.id, toId: 'resource:find-representative', type: 'related-to', weight: 10, sites: ['keeptxred'] },
  { fromId: representative.id, toId: 'resource:texas-bills', type: 'related-to', weight: 9, sites: ['keeptxred'] },
  { fromId: representative.id, toId: 'resource:texas-elections', type: 'related-to', weight: 7, sites: ['keeptxred'] },
]);

export const SHARED_RELATIONSHIPS: SharedRelationship[] = [
  { fromId: 'resource:mortgage-calculator', toId: 'resource:property-tax-calculator', type: 'next-step', weight: 10 },
  { fromId: 'resource:mortgage-calculator', toId: 'resource:financial-tools', type: 'related-to', weight: 7, bidirectional: true },
  { fromId: 'resource:property-tax-calculator', toId: 'resource:financial-tools', type: 'next-step', weight: 8 },
  { fromId: 'resource:moving-guide', toId: 'resource:cost-of-living', type: 'next-step', weight: 10 },
  { fromId: 'resource:moving-guide', toId: 'resource:explore-texas', type: 'related-to', weight: 8, bidirectional: true },
  { fromId: 'resource:find-representative', toId: 'resource:texas-bills', type: 'related-to', weight: 9, sites: ['keeptxred'], bidirectional: true },
  { fromId: 'resource:find-representative', toId: 'resource:texas-elections', type: 'next-step', weight: 8, sites: ['keeptxred'] },
  { fromId: 'resource:texas-bills', toId: 'resource:texas-laws', type: 'next-step', weight: 7, sites: ['keeptxred'] },
  { fromId: 'resource:texas-laws', toId: 'resource:texas-bills', type: 'related-to', weight: 7, sites: ['keeptxred'], bidirectional: true },
  { fromId: 'resource:cost-of-living', toId: 'resource:texas-comparisons', type: 'next-step', weight: 8 },
  { fromId: 'resource:explore-texas', toId: 'resource:texas-comparisons', type: 'related-to', weight: 7, bidirectional: true },
  ...REPRESENTATIVE_RELATIONSHIPS,
];

function visibleOnSite(relationship: SharedRelationship, site: SharedSite) {
  return !relationship.sites || relationship.sites.includes(site);
}

export function relationshipsFrom(entityId: string, site: SharedSite, types?: SharedRelationshipType[]) {
  return SHARED_RELATIONSHIPS.flatMap((relationship) => {
    if (!visibleOnSite(relationship, site) || (types?.length && !types.includes(relationship.type))) return [];
    if (relationship.fromId === entityId) return [{ ...relationship, targetId: relationship.toId }];
    if (relationship.bidirectional && relationship.toId === entityId) return [{ ...relationship, targetId: relationship.fromId }];
    return [];
  }).sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
}

export function relatedEntities(
  entityId: string,
  site: SharedSite,
  limit = 6,
  types?: SharedRelationshipType[],
): SharedEntity[] {
  const explicit = relationshipsFrom(entityId, site, types)
    .map((relationship) => entityById(relationship.targetId))
    .filter((entity): entity is SharedEntity => Boolean(entity?.sites.includes(site)));

  const source = entityById(entityId);
  if (!source || types?.length) return explicit.slice(0, limit);

  const fallback = entitiesForSite(site)
    .filter((candidate) => candidate.id !== entityId && !explicit.some((item) => item.id === candidate.id))
    .map((candidate) => ({
      candidate,
      score:
        candidate.topics.filter((topic) => source.topics.includes(topic)).length * 4 +
        candidate.journeys.filter((journey) => source.journeys.includes(journey)).length * 3,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .map(({ candidate }) => candidate);

  return [...explicit, ...fallback].slice(0, limit);
}

export function nextStepEntities(entityId: string, site: SharedSite, limit = 4) {
  return relatedEntities(entityId, site, limit, ['next-step']);
}
