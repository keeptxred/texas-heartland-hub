import type { SharedSite } from './registry';
import { entityById, entitiesForSite, type SharedEntity } from './entities';

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
};

export const SHARED_RELATIONSHIPS: SharedRelationship[] = [
  { fromId: 'resource:mortgage-calculator', toId: 'resource:property-tax-calculator', type: 'next-step', weight: 10 },
  { fromId: 'resource:mortgage-calculator', toId: 'resource:financial-tools', type: 'related-to', weight: 7 },
  { fromId: 'resource:property-tax-calculator', toId: 'resource:financial-tools', type: 'next-step', weight: 8 },
  { fromId: 'resource:moving-guide', toId: 'resource:cost-of-living', type: 'next-step', weight: 10 },
  { fromId: 'resource:moving-guide', toId: 'resource:explore-texas', type: 'related-to', weight: 8 },
  { fromId: 'resource:find-representative', toId: 'resource:texas-bills', type: 'related-to', weight: 9, sites: ['keeptxred'] },
  { fromId: 'resource:texas-bills', toId: 'resource:find-representative', type: 'related-to', weight: 9, sites: ['keeptxred'] },
  { fromId: 'resource:texas-laws', toId: 'resource:texas-bills', type: 'related-to', weight: 7, sites: ['keeptxred'] },
];

function visibleOnSite(relationship: SharedRelationship, site: SharedSite) {
  return !relationship.sites || relationship.sites.includes(site);
}

export function relatedEntities(entityId: string, site: SharedSite, limit = 6): SharedEntity[] {
  const explicit = SHARED_RELATIONSHIPS
    .filter((relationship) => relationship.fromId === entityId && visibleOnSite(relationship, site))
    .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
    .map((relationship) => entityById(relationship.toId))
    .filter((entity): entity is SharedEntity => Boolean(entity?.sites.includes(site)));

  const source = entityById(entityId);
  if (!source) return explicit.slice(0, limit);

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
