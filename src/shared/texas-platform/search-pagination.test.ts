import { describe, expect, it } from 'vitest';
import type { EntitySearchResult } from './entities';
import { paginatedSearchResults, SEARCH_PAGE_SIZE } from './search-pagination';

function result(index: number, type: EntitySearchResult['type'] = 'resource'): EntitySearchResult {
  return {
    id: `${type}:${index}`,
    type,
    title: `Result ${index}`,
    summary: 'A sufficiently descriptive shared search result used for pagination tests.',
    route: `/result-${index}`,
    sites: ['keeptxred'],
    topics: [],
    journeys: [],
    score: 100 - index,
  };
}

describe('shared search pagination', () => {
  it('shows the first page and reports additional results', () => {
    const results = Array.from({ length: 20 }, (_, index) => result(index));
    const page = paginatedSearchResults(results, 'all');
    expect(page.visible).toHaveLength(SEARCH_PAGE_SIZE);
    expect(page.total).toBe(20);
    expect(page.canLoadMore).toBe(true);
    expect(page.nextVisibleCount).toBe(20);
  });

  it('filters before paginating', () => {
    const results = [
      ...Array.from({ length: 15 }, (_, index) => result(index, 'calculator')),
      ...Array.from({ length: 5 }, (_, index) => result(index + 20, 'guide')),
    ];
    const page = paginatedSearchResults(results, 'guide');
    expect(page.total).toBe(5);
    expect(page.visible.every((item) => item.type === 'guide')).toBe(true);
    expect(page.canLoadMore).toBe(false);
  });

  it('never mutates ranked source results', () => {
    const results = Array.from({ length: 14 }, (_, index) => result(index));
    const ids = results.map((item) => item.id);
    paginatedSearchResults(results, 'all', 24);
    expect(results.map((item) => item.id)).toEqual(ids);
  });
});
