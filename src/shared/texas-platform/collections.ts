import { entitiesForSite, type SharedEntity, type SharedEntityType } from './entities';
import { journeysForSite, topicsForSite, type SharedSite } from './registry';

export type SharedEntityCollection = {
  id: string;
  title: string;
  description: string;
  route: string;
  entities: SharedEntity[];
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
  return {
    id: `journey:${journey.id}`,
    title: journey.title,
    description: journey.description,
    route: `/texas-resources/journey/${journey.id}`,
    entities: sortEntities(entitiesForSite(site).filter((entity) => entity.journeys.includes(journey.id))),
  };
}

export function typeCollection(type: SharedEntityType, site: SharedSite): SharedEntityCollection {
  const title = type.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    id: `type:${type}`,
    title,
    description: `Browse Texas ${title.toLowerCase()} available through the shared resource platform.`,
    route: `/texas-resources#${type}`,
    entities: sortEntities(entitiesForSite(site).filter((entity) => entity.type === type)),
  };
}

export function allTopicCollections(site: SharedSite) {
  return topicsForSite(site).map((topic) => topicCollection(topic.id, site)).filter((collection): collection is SharedEntityCollection => Boolean(collection));
}

export function allJourneyCollections(site: SharedSite) {
  return journeysForSite(site).map((journey) => journeyCollection(journey.id, site)).filter((collection): collection is SharedEntityCollection => Boolean(collection));
}
