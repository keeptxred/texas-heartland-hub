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

export const ENTITY_TYPE_LABELS: Record<SharedEntityType, string> = {
  calculator: 'Calculator & Tool',
  guide: 'Guide',
  representative: 'Representative',
  bill: 'Bill',
  committee: 'Committee',
  city: 'City',
  county: 'County',
  park: 'Park',
  'school-district': 'School District',
  agency: 'Agency',
  resource: 'Resource',
};

export type SearchTypeCount = {
  type: SharedEntityType;
  label: string;
  count: number;
};

export function searchTypeCounts(results: readonly EntitySearchResult[]): SearchTypeCount[] {
  const counts = new Map<SharedEntityType, number>();
  for (const result of results) counts.set(result.type, (counts.get(result.type) ?? 0) + 1);
  return SEARCHABLE_ENTITY_TYPES
    .map((type) => ({ type, label: SEARCH_TYPE_LABELS[type], count: counts.get(type) ?? 0 }))
    .filter((item) => item.count > 0);
}

export function filterSearchResults(
  results: readonly EntitySearchResult[],
  type: SharedEntityType | 'all',
) {
  return type === 'all' ? [...results] : results.filter((result) => result.type === type);
}
