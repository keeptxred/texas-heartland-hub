import type { EntitySearchResult, SharedEntityType } from './entities';
import { filterSearchResults } from './search-filters';

export const SEARCH_PAGE_SIZE = 12;

export function paginatedSearchResults(
  results: ReadonlyArray<EntitySearchResult>,
  activeType: SharedEntityType | 'all',
  visibleCount = SEARCH_PAGE_SIZE,
) {
  const filtered = filterSearchResults(results, activeType);
  const safeVisibleCount = Math.max(SEARCH_PAGE_SIZE, visibleCount);
  return {
    filtered,
    visible: filtered.slice(0, safeVisibleCount),
    total: filtered.length,
    canLoadMore: safeVisibleCount < filtered.length,
    nextVisibleCount: Math.min(safeVisibleCount + SEARCH_PAGE_SIZE, filtered.length),
  };
}
