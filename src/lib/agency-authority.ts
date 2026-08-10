import {
  GOVERNMENT_ENTITIES,
  GOVERNMENT_REVIEWED_AT,
  type GovernmentEntity,
} from '@/lib/texas-government';
import {
  createAuthorityEntityKey,
  type AuthorityEntity,
} from '@/lib/authority-entity';

const agencyEntityTypes = new Set<GovernmentEntity['entityType']>([
  'board',
  'commission',
]);

const agencySlugs = new Set(
  GOVERNMENT_ENTITIES.filter((entity) => agencyEntityTypes.has(entity.entityType)).map(
    (entity) => entity.slug,
  ),
);

export function governmentEntityToAgencyAuthorityEntity(
  agency: GovernmentEntity,
): AuthorityEntity {
  if (!agencyEntityTypes.has(agency.entityType)) {
    throw new Error(`Government entity ${agency.slug} is not an agency entity`);
  }

  return {
    id: createAuthorityEntityKey('agency', agency.slug),
    entityType: 'agency',
    slug: agency.slug,
    name: agency.name,
    active: true,
    lastVerified: GOVERNMENT_REVIEWED_AT,
    sourceOfTruth: {
      label: `${agency.shortName} official website`,
      url: agency.officialUrl,
    },
    title: agency.shortName,
    subtitle: agency.branch,
    summary: agency.overview,
    imageUrl: null,
    relatedEntityIds: agency.relatedEntities
      .filter((slug) => agencySlugs.has(slug))
      .map((slug) => createAuthorityEntityKey('agency', slug)),
    createdAt: null,
    updatedAt: null,
  };
}

export const AGENCY_AUTHORITY_ENTITIES: AuthorityEntity[] =
  GOVERNMENT_ENTITIES.filter((entity) => agencyEntityTypes.has(entity.entityType)).map(
    governmentEntityToAgencyAuthorityEntity,
  );
