import {
  SHARED_JOURNEYS,
  SHARED_RESOURCES,
  SHARED_TOPICS,
  type SharedSite,
} from '../../src/shared/texas-platform/registry.ts';

const errors: string[] = [];
const resourceIds = new Set<string>();
const topicIds = new Set<string>();
const journeyIds = new Set<string>();
const validSites = new Set<SharedSite>(['keeptxred', 'texasdefined']);

for (const resource of SHARED_RESOURCES) {
  if (resourceIds.has(resource.id)) errors.push(`Duplicate resource id: ${resource.id}`);
  resourceIds.add(resource.id);
  if (!resource.route.startsWith('/')) errors.push(`Resource ${resource.id} has a non-rooted route: ${resource.route}`);
  if (!resource.title.trim() || !resource.description.trim()) errors.push(`Resource ${resource.id} is missing visitor-facing copy`);
  if (!resource.sites.length || resource.sites.some((site) => !validSites.has(site))) errors.push(`Resource ${resource.id} has invalid site visibility`);
}

for (const topic of SHARED_TOPICS) {
  if (topicIds.has(topic.id)) errors.push(`Duplicate topic id: ${topic.id}`);
  topicIds.add(topic.id);
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

if (errors.length) {
  console.error(`Texas platform registry validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Texas platform registry validation passed (${SHARED_RESOURCES.length} resources, ${SHARED_TOPICS.length} topics, ${SHARED_JOURNEYS.length} journeys).`);
