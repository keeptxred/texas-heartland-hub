import { SHARED_ENTITIES, type SharedEntity, type SharedEntityType } from './entities';
import { fingerprintEntities, type TexasEntityKind, type TexasEntityRecord } from '../platform-core';

const CORE_KIND_BY_SHARED_TYPE: Partial<Record<SharedEntityType, TexasEntityKind>> = {
  city: 'city',
  county: 'county',
  agency: 'agency',
  park: 'state-park',
  'school-district': 'school-district',
};

const LOCALLY_OWNED_ENTITY_TYPES: SharedEntityType[] = [
  'representative',
  'bill',
  'committee',
  'guide',
  'calculator',
  'resource',
];

export function sharedEntityToCore(entity: SharedEntity): TexasEntityRecord | undefined {
  const kind = CORE_KIND_BY_SHARED_TYPE[entity.type];
  if (!kind) return undefined;
  const officialUrl = entity.officialSources?.find((source) => source.url.startsWith('https://'))?.url;
  const reviewed = entity.lastReviewed ? new Date(entity.lastReviewed) : undefined;
  const reviewDueAt = reviewed && !Number.isNaN(reviewed.getTime())
    ? new Date(reviewed.getTime() + 90 * 86400000).toISOString()
    : undefined;
  return {
    id: entity.id,
    kind,
    name: entity.title,
    slug: entity.route.split('/').filter(Boolean).at(-1) ?? entity.id.replace(':', '-'),
    aliases: [...new Set(entity.searchTerms ?? [])],
    description: entity.summary,
    officialUrl,
    sourceId: entity.sourceResourceId ?? 'keeptxred-shared-registry',
    sourceConfidence: officialUrl ? 'official' : 'high',
    sourceCheckedAt: reviewed?.toISOString(),
    reviewDueAt,
    status: 'active',
    relationships: [],
    tags: [...new Set([...entity.topics, ...entity.journeys])],
  };
}

export const KEEP_TX_RED_CORE_ENTITIES = SHARED_ENTITIES
  .map(sharedEntityToCore)
  .filter((entity): entity is TexasEntityRecord => Boolean(entity));

export const KEEP_TX_RED_CORE_FINGERPRINT = fingerprintEntities(KEEP_TX_RED_CORE_ENTITIES);

export function unsupportedSharedEntityTypes() {
  const discovered = SHARED_ENTITIES
    .filter((entity) => !CORE_KIND_BY_SHARED_TYPE[entity.type])
    .map((entity) => entity.type);
  return [...new Set([...LOCALLY_OWNED_ENTITY_TYPES, ...discovered])].sort();
}
