import type { AuthorityEntityType } from '@/lib/authority-entity';

export const AUTHORITY_ENTITY_PATH_PREFIXES: Record<AuthorityEntityType, string> = {
  'statewide-office': '/texas-government/offices/',
  legislator: '/representatives/',
  candidate: '/elections/candidates/',
  committee: '/texas-legislature/committees/',
  agency: '/texas-government/agencies/',
  district: '/elections/districts/',
};

export function authorityEntityPath(
  entityType: AuthorityEntityType,
  slug: string,
): string {
  return `${AUTHORITY_ENTITY_PATH_PREFIXES[entityType]}${slug}`;
}
