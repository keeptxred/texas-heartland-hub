import type { SharedEntity, SharedEntityType } from './entities';
import type { SharedSite } from './registry';

export type BillEntityInput = {
  id: string;
  identifier: string;
  caption?: string | null;
  chamber?: string | null;
  status?: string | null;
  session?: string | null;
  route: string;
  sponsors?: string[];
  subjects?: string[];
};

export type CommitteeEntityInput = {
  id: string;
  name: string;
  chamber?: string | null;
  description?: string | null;
  route: string;
  officialUrl?: string | null;
};

export type PlaceEntityInput = {
  id: string;
  type: 'city' | 'county' | 'park' | 'school-district';
  name: string;
  summary?: string | null;
  route: string;
  parentName?: string | null;
  officialUrl?: string | null;
  searchTerms?: string[];
};

function clean(values: Array<string | null | undefined>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value));
}

export function billToSharedEntity(input: BillEntityInput): SharedEntity {
  const title = input.identifier.trim();
  const caption = input.caption?.trim();
  const chamber = input.chamber?.trim();
  const status = input.status?.trim();
  const session = input.session?.trim();

  return {
    id: `bill:${input.id}`,
    type: 'bill',
    title: caption ? `${title}: ${caption}` : title,
    summary: clean([chamber, status, session]).join(' · ') || 'Texas legislation and official bill history.',
    whyItMatters: 'Bills can change Texas law, government programs, taxes, regulations and public spending.',
    route: input.route,
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    keyFacts: [
      { label: 'Bill', value: title },
      ...(chamber ? [{ label: 'Chamber', value: chamber }] : []),
      ...(status ? [{ label: 'Status', value: status }] : []),
      ...(session ? [{ label: 'Session', value: session }] : []),
    ],
    searchTerms: clean([
      title,
      caption,
      chamber,
      status,
      session,
      ...(input.sponsors ?? []),
      ...(input.subjects ?? []),
      'Texas bill legislation legislature',
    ]),
  };
}

export function committeeToSharedEntity(input: CommitteeEntityInput): SharedEntity {
  const chamber = input.chamber?.trim();
  return {
    id: `committee:${input.id}`,
    type: 'committee',
    title: input.name.trim(),
    summary: input.description?.trim() || `${chamber ? `${chamber} ` : ''}committee in the Texas Legislature.`,
    whyItMatters: 'Legislative committees review bills, hold hearings and decide which proposals advance.',
    route: input.route,
    sites: ['keeptxred'],
    topics: ['government-elections'],
    journeys: ['government-help'],
    keyFacts: chamber ? [{ label: 'Chamber', value: chamber }] : undefined,
    officialSources: input.officialUrl ? [{ label: 'Official committee page', url: input.officialUrl }] : undefined,
    searchTerms: clean([input.name, chamber, 'committee hearing Texas Legislature']),
  };
}

export function placeToSharedEntity(input: PlaceEntityInput, sites: SharedSite[] = ['keeptxred', 'texasdefined']): SharedEntity {
  const parent = input.parentName?.trim();
  const typeLabel: Record<PlaceEntityInput['type'], string> = {
    city: 'Texas city',
    county: 'Texas county',
    park: 'Texas park',
    'school-district': 'Texas school district',
  };

  return {
    id: `${input.type}:${input.id}`,
    type: input.type as SharedEntityType,
    title: input.name.trim(),
    summary: input.summary?.trim() || `${typeLabel[input.type]}${parent ? ` in ${parent}` : ''}.`,
    route: input.route,
    sites,
    topics: input.type === 'park' ? ['explore-texas'] : ['cities-counties'],
    journeys: input.type === 'park' ? ['explore-texas'] : ['moving-texas', 'explore-texas'],
    keyFacts: parent ? [{ label: 'Located in', value: parent }] : undefined,
    officialSources: input.officialUrl ? [{ label: 'Official source', url: input.officialUrl }] : undefined,
    searchTerms: clean([input.name, parent, typeLabel[input.type], ...(input.searchTerms ?? [])]),
  };
}

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function mergeEntities(previous: SharedEntity, incoming: SharedEntity): SharedEntity {
  const facts = new Map<string, string>();
  for (const fact of [...(previous.keyFacts ?? []), ...(incoming.keyFacts ?? [])]) facts.set(fact.label, fact.value);

  const sources = new Map<string, { label: string; url: string }>();
  for (const source of [...(previous.officialSources ?? []), ...(incoming.officialSources ?? [])]) sources.set(source.url, source);

  return {
    ...previous,
    ...incoming,
    sites: unique([...previous.sites, ...incoming.sites]),
    topics: unique([...previous.topics, ...incoming.topics]),
    journeys: unique([...previous.journeys, ...incoming.journeys]),
    searchTerms: unique([...(previous.searchTerms ?? []), ...(incoming.searchTerms ?? [])]),
    keyFacts: facts.size ? [...facts].map(([label, value]) => ({ label, value })) : undefined,
    officialSources: sources.size ? [...sources.values()] : undefined,
    whyItMatters: incoming.whyItMatters || previous.whyItMatters,
    lastReviewed: incoming.lastReviewed || previous.lastReviewed,
  };
}

export function mergeEntityCollections(...collections: ReadonlyArray<ReadonlyArray<SharedEntity>>) {
  const byId = new Map<string, SharedEntity>();
  for (const collection of collections) {
    for (const entity of collection) {
      const previous = byId.get(entity.id);
      byId.set(entity.id, previous ? mergeEntities(previous, entity) : entity);
    }
  }
  return [...byId.values()];
}
