import {
  SHARED_JOURNEYS,
  SHARED_RESOURCES,
  SHARED_TOPICS,
  type SharedSite,
} from '../../src/shared/texas-platform/registry.ts';
import { SHARED_ENTITIES } from '../../src/shared/texas-platform/entities.ts';
import { SHARED_RELATIONSHIPS } from '../../src/shared/texas-platform/relationships.ts';

const errors: string[] = [];
const resourceIds = new Set<string>();
const topicIds = new Set<string>();
const journeyIds = new Set<string>();
const entityIds = new Set<string>();
const validSites = new Set<SharedSite>(['keeptxred', 'texasdefined']);

function hasValidSites(sites: readonly SharedSite[]) {
  return sites.length > 0 && sites.every((site) => validSites.has(site));
}

for (const resource of SHARED_RESOURCES) {
  if (resourceIds.has(resource.id)) errors.push(`Duplicate resource id: ${resource.id}`);
  resourceIds.add(resource.id);
  if (!resource.route.startsWith('/')) errors.push(`Resource ${resource.id} has a non-rooted route: ${resource.route}`);
  if (!resource.title.trim() || !resource.description.trim()) errors.push(`Resource ${resource.id} is missing visitor-facing copy`);
  if (!hasValidSites(resource.sites)) errors.push(`Resource ${resource.id} has invalid site visibility`);
}

for (const topic of SHARED_TOPICS) {
  if (topicIds.has(topic.id)) errors.push(`Duplicate topic id: ${topic.id}`);
  topicIds.add(topic.id);
  if (!topic.title.trim() || !topic.description.trim() || !topic.cta.trim()) errors.push(`Topic ${topic.id} is missing visitor-facing copy`);
  if (!hasValidSites(topic.sites)) errors.push(`Topic ${topic.id} has invalid site visibility`);
  if (!topic.resourceIds.length) errors.push(`Topic ${topic.id} has no resources`);
  for (const resourceId of topic.resourceIds) {
    const resource = SHARED_RESOURCES.find((item) => item.id === resourceId);
    if (!resource) errors.push(`Topic ${topic.id} references missing resource ${resourceId}`);
    else if (!topic.sites.some((site) => resource.sites.includes(site))) errors.push(`Topic ${topic.id} and resource ${resourceId} have no shared site visibility`);
  }
}

for (const journey of SHARED_JOURNEYS) {
  if (journeyIds.has(journey.id)) errors.push(`Duplicate journey id: ${journey.id}`);
  journeyIds.add(journey.id);
  if (!journey.title.trim() || !journey.description.trim()) errors.push(`Journey ${journey.id} is missing visitor-facing copy`);
  if (!hasValidSites(journey.sites)) errors.push(`Journey ${journey.id} has invalid site visibility`);
  if (!journey.resourceIds.length) errors.push(`Journey ${journey.id} has no resources`);
  for (const resourceId of journey.resourceIds) {
    const resource = SHARED_RESOURCES.find((item) => item.id === resourceId);
    if (!resource) errors.push(`Journey ${journey.id} references missing resource ${resourceId}`);
    else if (!journey.sites.some((site) => resource.sites.includes(site))) errors.push(`Journey ${journey.id} and resource ${resourceId} have no shared site visibility`);
  }
}

for (const resource of SHARED_RESOURCES) {
  for (const topicId of resource.topics) {
    if (!topicIds.has(topicId)) errors.push(`Resource ${resource.id} references missing topic ${topicId}`);
  }
  for (const journeyId of resource.journeys) {
    if (!journeyIds.has(journeyId)) errors.push(`Resource ${resource.id} references missing journey ${journeyId}`);
  }
}

const routes = new Map<string, string>();
for (const entity of SHARED_ENTITIES) {
  if (!entity.id.trim()) errors.push('Entity has an empty id');
  if (entityIds.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}`);
  entityIds.add(entity.id);
  if (!entity.title.trim()) errors.push(`Entity ${entity.id} has an empty title`);
  if (!entity.summary.trim()) errors.push(`Entity ${entity.id} has an empty summary`);
  if (!entity.route.startsWith('/')) errors.push(`Entity ${entity.id} has an invalid route: ${entity.route}`);
  if (!hasValidSites(entity.sites)) errors.push(`Entity ${entity.id} has invalid site visibility`);
  if (!entity.topics.length) errors.push(`Entity ${entity.id} has no topics`);
  if (!entity.journeys.length) errors.push(`Entity ${entity.id} has no journeys`);

  const existingRouteOwner = routes.get(entity.route);
  if (existingRouteOwner && existingRouteOwner !== entity.id && entity.type !== 'representative') {
    errors.push(`Duplicate entity route ${entity.route}: ${existingRouteOwner} and ${entity.id}`);
  } else {
    routes.set(entity.route, entity.id);
  }

  for (const source of entity.officialSources ?? []) {
    try {
      const url = new URL(source.url);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol');
    } catch {
      errors.push(`Entity ${entity.id} has an invalid official source URL: ${source.url}`);
    }
  }
}

const relationshipKeys = new Set<string>();
for (const relationship of SHARED_RELATIONSHIPS) {
  if (!entityIds.has(relationship.fromId)) errors.push(`Relationship source does not exist: ${relationship.fromId}`);
  if (!entityIds.has(relationship.toId)) errors.push(`Relationship target does not exist: ${relationship.toId}`);
  if (relationship.fromId === relationship.toId) errors.push(`Self relationship is not allowed: ${relationship.fromId}`);
  if (relationship.weight !== undefined && (!Number.isFinite(relationship.weight) || relationship.weight < 0)) {
    errors.push(`Relationship ${relationship.fromId} -> ${relationship.toId} has an invalid weight`);
  }
  if (relationship.sites && !hasValidSites(relationship.sites)) {
    errors.push(`Relationship ${relationship.fromId} -> ${relationship.toId} has invalid site visibility`);
  }
  const key = `${relationship.fromId}|${relationship.toId}|${relationship.type}|${(relationship.sites ?? []).join(',')}`;
  if (relationshipKeys.has(key)) errors.push(`Duplicate relationship: ${key}`);
  relationshipKeys.add(key);
}

if (errors.length) {
  console.error(`Texas platform validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const representativeCount = SHARED_ENTITIES.filter((entity) => entity.type === 'representative').length;
console.log(
  `Texas platform validation passed (${SHARED_RESOURCES.length} resources, ${SHARED_TOPICS.length} topics, ${SHARED_JOURNEYS.length} journeys, ${SHARED_ENTITIES.length} entities, ${representativeCount} representatives, ${SHARED_RELATIONSHIPS.length} relationships).`,
);
