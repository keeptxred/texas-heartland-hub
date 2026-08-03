import type { SharedEntityType } from './entities';
import { SEARCHABLE_ENTITY_TYPES } from './search-filters';

export type ResourceSearchParams = {
  q: string;
  type: SharedEntityType | 'all';
};

export function normalizeResourceSearchQuery(value: unknown, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function normalizeResourceSearchType(value: unknown): SharedEntityType | 'all' {
  return typeof value === 'string' && SEARCHABLE_ENTITY_TYPES.includes(value as SharedEntityType)
    ? value as SharedEntityType
    : 'all';
}

export function normalizeResourceSearchParams(search: Record<string, unknown>): ResourceSearchParams {
  return {
    q: normalizeResourceSearchQuery(search.q),
    type: normalizeResourceSearchType(search.type),
  };
}

export function resourceSearchHref(query: string, type: SharedEntityType | 'all' = 'all') {
  const params = new URLSearchParams();
  const normalizedQuery = normalizeResourceSearchQuery(query);
  if (normalizedQuery) params.set('q', normalizedQuery);
  if (type !== 'all') params.set('type', type);
  const suffix = params.toString();
  return `/texas-resources${suffix ? `?${suffix}` : ''}`;
}
