import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  sourceRepository,
  type ExploreSourceFilters,
  type ExploreSourceRecord,
} from '@/repositories/explore/SourceRepository';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

const DEFAULT_PAGINATION: ExplorePagination = { page: 1, pageSize: 25 };

export const exploreAdminSourceKeys = {
  all: ['explore-admin', 'sources'] as const,
  list: (filters: ExploreSourceFilters, pagination: ExplorePagination) =>
    [...exploreAdminSourceKeys.all, 'list', filters, pagination] as const,
  activeCount: () => [...exploreAdminSourceKeys.all, 'active-count'] as const,
};

export function useExploreAdminSources(
  filters: ExploreSourceFilters = {},
  pagination: ExplorePagination = DEFAULT_PAGINATION,
) {
  const normalizedPagination = normalizePagination(pagination);
  return useQuery<ExplorePaginatedResult<ExploreSourceRecord>, Error>({
    queryKey: exploreAdminSourceKeys.list(filters, normalizedPagination),
    queryFn: () => sourceRepository.list(filters, normalizedPagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useExploreAdminActiveSourceCount() {
  return useQuery<number, Error>({
    queryKey: exploreAdminSourceKeys.activeCount(),
    queryFn: () => sourceRepository.countActive(),
    staleTime: 30_000,
  });
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
