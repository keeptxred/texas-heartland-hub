import {
  GOVERNMENT_ENTITIES,
  GOVERNMENT_REVIEWED_AT,
  type GovernmentEntity,
} from '@/lib/texas-government';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const statewideOfficeSlugs = new Set(
  GOVERNMENT_ENTITIES.filter((entity) => entity.entityType === 'office').map(
    (entity) => entity.slug,
  ),
);

export function statewideOfficeToAuthorityEntity(
  office: GovernmentEntity,
): AuthorityEntity {
  if (office.entityType !== 'office') {
    throw new Error(`Government entity ${office.slug} is not a statewide office`);
  }

  return {
    id: createAuthorityEntityKey('statewide-office', office.slug),
    entityType: 'statewide-office',
    slug: office.slug,
    name: office.name,
    active: true,
    lastVerified: GOVERNMENT_REVIEWED_AT,
    sourceOfTruth: {
      label: `${office.shortName} official website`,
      url: office.officialUrl,
    },
    title: office.shortName,
    subtitle: office.currentOfficeholder,
    summary: office.overview,
    imageUrl: null,
    relatedEntityIds: office.relatedEntities
      .filter((slug) => statewideOfficeSlugs.has(slug))
      .map((slug) => createAuthorityEntityKey('statewide-office', slug)),
    createdAt: null,
    updatedAt: null,
  };
}

export const STATEWIDE_OFFICE_AUTHORITY_ENTITIES: AuthorityEntity[] =
  GOVERNMENT_ENTITIES.filter(
    (entity): entity is GovernmentEntity => entity.entityType === 'office',
  ).map(statewideOfficeToAuthorityEntity);
