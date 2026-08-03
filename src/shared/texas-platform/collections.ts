import { entitiesForSite, type SharedEntity, type SharedEntityType } from './entities';
import { journeysForSite, topicsForSite, type SharedSite } from './registry';

export type SharedEntityCollection = {
  id: string;
  title: string;
  description: string;
  route: string;
  entities: SharedEntity[];
};

const TYPE_LABELS: Record<SharedEntityType, string> = {
  calculator: 'Calculators & Tools',
  guide: 'Guides',
  representative: 'Representatives',
  bill: 'Bills',
  committee: 'Committees',
  city: 'Cities',
  county: 'Counties',
  park: 'Parks',
  'school-district': 'School Districts',
  agency: 'Agencies',
  resource: 'More Resources',
};

const TYPE_DESCRIPTIONS: Record<SharedEntityType, string> = {
  calculator: 'Use practical Texas calculators and interactive tools for taxes, housing, budgets and everyday decisions.',
  guide: 'Read practical Texas guides that explain important tasks, choices and official processes.',
  representative: 'Find Texas state and federal officeholders, districts and official contact information.',
  bill: 'Browse Texas legislation, sponsors, status and official bill history.',
  committee: 'Explore Texas legislative committees, responsibilities and official information.',
  city: 'Explore Texas cities and connected local resources.',
  county: 'Explore Texas counties and connected local resources.',
  park: 'Discover Texas parks, destinations and official visitor information.',
  'school-district': 'Explore Texas school districts and connected community information.',
  agency: 'Find Texas agencies and official government resources.',
  resource: 'Browse additional practical Texas resources available through the shared platform.',
};

function sortEntities(entities: SharedEntity[]) {
  return [...entities].sort((a, b) => a.title.localeCompare(b.title));
}

export function topicCollection(topicId: string, site: SharedSite): SharedEntityCollection | undefined {
  const topic = topicsForSite(site).find((item) => item.id === topicId);
  if (!topic) return undefined;
  return {
    id: `topic:${topic.id}`,
    title: topic.title,
    description: topic.description,
    route: `/texas-resources/topic/${topic.id}`,
    entities: sortEntities(entitiesForSite(site).filter((entity) => entity.topics.includes(topic.id))),
  };
}

export function journeyCollection(journeyId: string, site: SharedSite): SharedEntityCollection | undefined {
  const journey = journeysForSite(site).find((item) => item.id === journeyId);
  if (!journey) return undefined;
  const order = new Map(journey.resourceIds.map((id, index) => [`resource:${id}`, index]));
  const entities = entitiesForSite(site).filter((entity) => entity.journeys.includes(journey.id));
  entities.sort((a, b) => {
    const aOrder = order.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = order.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.title.localeCompare(b.title);
  });
  return {
    id: `journey:${journey.id}`,
    title: journey.title,
    description: journey.description,
    route: `/texas-resources/journey/${journey.id}`,
    entities,
  };
}

export function typeCollection(type: SharedEntityType, site: SharedSite): SharedEntityCollection {
  return {
    id: `type:${type}`,
    title: TYPE_LABELS[type],
    description: TYPE_DESCRIPTIONS[type],
    route: `/texas-resources/type/${type}`,
    entities: sortEntities(entitiesForSite(site).filter((entity) => entity.type === type)),
  };
}

export function allTopicCollections(site: SharedSite) {
  return topicsForSite(site)
    .map((topic) => topicCollection(topic.id, site))
    .filter((collection): collection is SharedEntityCollection => Boolean(collection));
}

export function allJourneyCollections(site: SharedSite) {
  return journeysForSite(site)
    .map((journey) => journeyCollection(journey.id, site))
    .filter((collection): collection is SharedEntityCollection => Boolean(collection));
}

export function allTypeCollections(site: SharedSite) {
  return (Object.keys(TYPE_LABELS) as SharedEntityType[])
    .map((type) => typeCollection(type, site))
    .filter((collection) => collection.entities.length > 0);
}

export function relatedCollections(entity: SharedEntity, site: SharedSite) {
  return [
    ...entity.journeys.map((id) => journeyCollection(id, site)),
    ...entity.topics.map((id) => topicCollection(id, site)),
    typeCollection(entity.type, site),
  ].filter((collection): collection is SharedEntityCollection => Boolean(collection));
}
