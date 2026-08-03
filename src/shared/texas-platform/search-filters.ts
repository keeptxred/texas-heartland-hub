import type { EntitySearchResult, SharedEntityType } from './entities';

export const SEARCHABLE_ENTITY_TYPES: SharedEntityType[] = [
  'calculator',
  'guide',
  'representative',
  'bill',
  'committee',
  'city',
  'county',
  'park',
  'school-district',
  'agency',
  'resource',
];

export const SEARCH_TYPE_LABELS: Record<SharedEntityType, string> = {
  calculator: 'Tools',
  guide: 'Guides',
  representative: 'Representatives',
  bill: 'Bills',
  committee: 'Committees',
  city: 'Cities',
  county: 'Counties',
  park: 'Parks',
  'school-district': 'School districts',
  agency: 'Agencies',
  resource: 'Resources',
};

export type SearchTypeCount = {
  type: SharedEntityType;
  label: string;
  count: number;
};

export function searchTypeCounts(results: readonly EntitySearchResult[]): SearchTypeCount[] {
  return SEARCHABLE_ENTITY_TYPES.map((type) => ({
    type,
    label: SEARCH_TYPE_LABELS[type],
    count: results.filter((result) => result.type === type).length,
  })).filter((item) => item.count > 0);
}

export function filterSearchResults(
  results: readonly EntitySearchResult[],
  type: SharedEntityType | 'all',
) {
  return type === 'all' ? [...results] : results.filter((result) => result.type === type);
}
