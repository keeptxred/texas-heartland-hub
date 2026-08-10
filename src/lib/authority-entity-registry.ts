import type { AuthorityEntity, AuthorityEntityType } from '@/lib/authority-entity';
import { STATEWIDE_OFFICE_AUTHORITY_ENTITIES } from '@/lib/statewide-office-authority';
import { LEGISLATOR_AUTHORITY_ENTITIES } from '@/lib/legislator-authority';
import { LEGISLATIVE_DISTRICT_AUTHORITY_ENTITIES } from '@/lib/legislative-district-authority';
import { AGENCY_AUTHORITY_ENTITIES } from '@/lib/agency-authority';

export type AuthorityEntityRegistry = {
  all: readonly AuthorityEntity[];
  byId: ReadonlyMap<string, AuthorityEntity>;
  getById: (id: string) => AuthorityEntity | null;
  getByType: (type: AuthorityEntityType) => readonly AuthorityEntity[];
  getRelated: (entity: Pick<AuthorityEntity, 'relatedEntityIds'>) => readonly AuthorityEntity[];
};

/** Builds a duplicate-safe lookup registry from canonical authority entities. */
export function createAuthorityEntityRegistry(
  entities: readonly AuthorityEntity[],
): AuthorityEntityRegistry {
  const byId = new Map<string, AuthorityEntity>();
  const byType = new Map<AuthorityEntityType, AuthorityEntity[]>();

  for (const entity of entities) {
    if (byId.has(entity.id)) {
      throw new Error(`Duplicate authority entity ID: ${entity.id}`);
    }

    byId.set(entity.id, entity);
    const typed = byType.get(entity.entityType) ?? [];
    typed.push(entity);
    byType.set(entity.entityType, typed);
  }

  return {
    all: [...entities],
    byId,
    getById: (id) => byId.get(id) ?? null,
    getByType: (type) => byType.get(type) ?? [],
    getRelated: (entity) =>
      entity.relatedEntityIds
        .map((id) => byId.get(id))
        .filter((related): related is AuthorityEntity => Boolean(related)),
  };
}

/** Static authority entities available without database or election-repository reads. */
export const STATIC_AUTHORITY_ENTITIES: readonly AuthorityEntity[] = [
  ...STATEWIDE_OFFICE_AUTHORITY_ENTITIES,
  ...LEGISLATOR_AUTHORITY_ENTITIES,
  ...LEGISLATIVE_DISTRICT_AUTHORITY_ENTITIES,
  ...AGENCY_AUTHORITY_ENTITIES,
];

export const STATIC_AUTHORITY_ENTITY_REGISTRY =
  createAuthorityEntityRegistry(STATIC_AUTHORITY_ENTITIES);
