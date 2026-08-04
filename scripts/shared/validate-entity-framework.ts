import { SHARED_ENTITIES } from '../../src/shared/texas-platform/entities.ts';
import { SHARED_RELATIONSHIPS } from '../../src/shared/texas-platform/relationships.ts';
import {
  KEEP_TX_RED_CORE_ENTITIES,
  KEEP_TX_RED_CORE_FINGERPRINT,
  unsupportedSharedEntityTypes,
} from '../../src/shared/texas-platform/core-adapter.ts';
import upstream from '../../src/shared/platform-core/upstream.json' with { type: 'json' };

const errors: string[] = [];
const ids = new Set<string>();
const routes = new Map<string, string>();
const relationshipKeys = new Set<string>();

for (const entity of SHARED_ENTITIES) {
  if (!entity.id.trim()) errors.push('Entity has an empty id.');
  if (ids.has(entity.id)) errors.push(`Duplicate entity id: ${entity.id}`);
  ids.add(entity.id);

  if (!entity.title.trim()) errors.push(`Entity ${entity.id} has an empty title.`);
  if (!entity.summary.trim()) errors.push(`Entity ${entity.id} has an empty summary.`);
  if (!entity.route.startsWith('/')) errors.push(`Entity ${entity.id} has an invalid route: ${entity.route}`);
  if (!entity.sites.length) errors.push(`Entity ${entity.id} has no site visibility.`);
  if (!entity.topics.length) errors.push(`Entity ${entity.id} has no topics.`);
  if (!entity.journeys.length) errors.push(`Entity ${entity.id} has no journeys.`);

  const routeOwner = routes.get(entity.route);
  if (routeOwner && routeOwner !== entity.id && entity.type !== 'representative') {
    errors.push(`Duplicate entity route ${entity.route}: ${routeOwner} and ${entity.id}`);
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

for (const relationship of SHARED_RELATIONSHIPS) {
  if (!ids.has(relationship.fromId)) errors.push(`Relationship source does not exist: ${relationship.fromId}`);
  if (!ids.has(relationship.toId)) errors.push(`Relationship target does not exist: ${relationship.toId}`);
  if (relationship.fromId === relationship.toId) errors.push(`Self relationship is not allowed: ${relationship.fromId}`);
  if (relationship.weight !== undefined && (!Number.isFinite(relationship.weight) || relationship.weight < 0)) {
    errors.push(`Relationship ${relationship.fromId} -> ${relationship.toId} has an invalid weight.`);
  }
  if (relationship.sites?.some((site) => !['keeptxred', 'texasdefined'].includes(site))) {
    errors.push(`Relationship ${relationship.fromId} -> ${relationship.toId} has invalid site visibility.`);
  }

  const endpoints = relationship.bidirectional
    ? [relationship.fromId, relationship.toId].sort().join('<->')
    : `${relationship.fromId}->${relationship.toId}`;
  const key = `${endpoints}:${relationship.type}:${(relationship.sites ?? []).slice().sort().join(',')}`;
  if (relationshipKeys.has(key)) errors.push(`Duplicate relationship: ${key}`);
  relationshipKeys.add(key);
}

if (!/^[a-f0-9]{40}$/.test(upstream.commit)) errors.push('Shared platform upstream must be pinned to a full commit SHA.');
if (upstream.repository !== 'keeptxred/texas-common-core') errors.push('Unexpected shared platform upstream repository.');
if (!/^fnv1a-[a-f0-9]{8}$/.test(KEEP_TX_RED_CORE_FINGERPRINT)) errors.push('Invalid shared core fingerprint.');
const coreIds = new Set<string>();
for (const entity of KEEP_TX_RED_CORE_ENTITIES) {
  if (coreIds.has(entity.id)) errors.push(`Duplicate adapted core entity id: ${entity.id}`);
  coreIds.add(entity.id);
  if (!['city', 'county', 'agency', 'state-park', 'school-district'].includes(entity.kind)) {
    errors.push(`Unsupported adapted core kind: ${entity.id} -> ${entity.kind}`);
  }
  if (!entity.sourceId || !entity.name || !entity.slug) errors.push(`Incomplete adapted core entity: ${entity.id}`);
}
const intentionallyLocal = unsupportedSharedEntityTypes();
for (const requiredType of ['representative', 'bill', 'committee', 'guide', 'calculator', 'resource']) {
  if (!intentionallyLocal.includes(requiredType as never)) errors.push(`Expected KeepTXRed-owned entity type not excluded from core: ${requiredType}`);
}

if (errors.length) {
  console.error(`Shared entity validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const representativeCount = SHARED_ENTITIES.filter((entity) => entity.type === 'representative').length;
const bidirectionalCount = SHARED_RELATIONSHIPS.filter((relationship) => relationship.bidirectional).length;
console.log(
  `Shared entity validation passed (${SHARED_ENTITIES.length} entities, ${representativeCount} representatives, ${SHARED_RELATIONSHIPS.length} relationships, ${bidirectionalCount} bidirectional, ${KEEP_TX_RED_CORE_ENTITIES.length} core-compatible, fingerprint ${KEEP_TX_RED_CORE_FINGERPRINT}).`,
);
