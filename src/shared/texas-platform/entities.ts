import {
  STATE_LEADERSHIP,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  representativeSlug,
  type Rep,
} from '@/data/representatives';
import { SHARED_RESOURCES, type SharedResource, type SharedSite } from './registry';

export type SharedEntityType =
  | 'city'
  | 'county'
  | 'representative'
  | 'bill'
  | 'committee'
  | 'agency'
  | 'guide'
  | 'calculator'
  | 'park'
  | 'school-district'
  | 'resource';

export type SharedOfficialSource = { label: string; url: string };

export type SharedEntity = {
  id: string;
  type: SharedEntityType;
  title: string;
  summary: string;
  whyItMatters?: string;
  route: string;
  sites: SharedSite[];
  topics: string[];
  journeys: string[];
  keyFacts?: Array<{ label: string; value: string }>;
  officialSources?: SharedOfficialSource[];
  lastReviewed?: string;
  searchTerms?: string[];
  sourceResourceId?: string;
};

function inferResourceType(resource: SharedResource): SharedEntityType {
  if (resource.route.includes('calculator') || resource.id === 'financial-tools') return 'calculator';
  if (resource.id === 'texas-bills') return 'bill';
  if (resource.id === 'find-representative') return 'representative';
  if (resource.id === 'explore-texas') return 'guide';
  return 'resource';
}

export const RESOURCE_ENTITIES: SharedEntity[] = SHARED_RESOURCES.map((resource) => ({
  id: `resource:${resource.id}`,
  type: inferResourceType(resource),
  title: resource.title,
  summary: resource.description,
  route: resource.route,
  sites: resource.sites,
  topics: resource.topics,
  journeys: resource.journeys,
  sourceResourceId: resource.id,
  searchTerms: [resource.id.replaceAll('-', ' '), ...resource.topics, ...resource.journeys],
}));

const ALL_REPRESENTATIVES: Rep[] = [
  ...US_SENATORS,
  ...STATE_LEADERSHIP,
  ...US_HOUSE_DELEGATION,
  ...TEXAS_SENATE_MEMBERS,
  ...TEXAS_HOUSE_MEMBERS,
];

export const REPRESENTATIVE_ENTITIES: SharedEntity[] = ALL_REPRESENTATIVES.map((representative) => {
  const district = representative.district?.trim();
  const party = representative.party === 'R' ? 'Republican' : 'Democrat';
  return {
    id: `representative:${representativeSlug(representative.name)}`,
    type: 'representative',
    title: representative.name,
    summary: `${party} ${representative.office}${district ? ` representing ${district}` : ''}.`,
    whyItMatters: 'This officeholder represents Texans in state or federal government and may vote on legislation, policy and public spending.',
    route: `/representatives/${representativeSlug(representative.name)}`,
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    keyFacts: [
      { label: 'Office', value: representative.office },
      { label: 'Party', value: representative.party },
      ...(district ? [{ label: 'District', value: district }] : []),
    ],
    officialSources: representative.website ? [{ label: 'Official website', url: representative.website }] : undefined,
    lastReviewed: '2026-08-03',
    searchTerms: [
      representative.office,
      party,
      representative.party,
      district ?? '',
      'representative legislator senator house government elected official',
    ].filter(Boolean),
  };
});

export const SHARED_ENTITIES: SharedEntity[] = [...RESOURCE_ENTITIES, ...REPRESENTATIVE_ENTITIES];

export function entitiesForSite(site: SharedSite) {
  return SHARED_ENTITIES.filter((entity) => entity.sites.includes(site));
}

export function entityById(id: string) {
  return SHARED_ENTITIES.find((entity) => entity.id === id);
}

export function entityByRoute(route: string, site?: SharedSite) {
  return SHARED_ENTITIES.find((entity) => entity.route === route && (!site || entity.sites.includes(site)));
}

export type EntitySearchResult = SharedEntity & { score: number };

export function searchEntities(query: string, site: SharedSite, limit = 12): EntitySearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter(Boolean);

  return entitiesForSite(site)
    .map((entity) => {
      const title = entity.title.toLowerCase();
      const summary = entity.summary.toLowerCase();
      const terms = (entity.searchTerms ?? []).join(' ').toLowerCase();
      const topicText = entity.topics.join(' ').toLowerCase();
      const journeyText = entity.journeys.join(' ').toLowerCase();
      let score = 0;
      if (title === normalized) score += 100;
      if (title.startsWith(normalized)) score += 55;
      if (title.includes(normalized)) score += 35;
      if (summary.includes(normalized)) score += 15;
      if (terms.includes(normalized)) score += 18;
      for (const token of tokens) {
        if (title.includes(token)) score += 12;
        if (summary.includes(token)) score += 4;
        if (topicText.includes(token)) score += 6;
        if (journeyText.includes(token)) score += 6;
        if (terms.includes(token)) score += 5;
      }
      return { ...entity, score };
    })
    .filter((entity) => entity.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}
