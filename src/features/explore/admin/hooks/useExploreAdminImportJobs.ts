import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  importJobRepository,
  type ExploreImportJob,
  type ExploreImportJobFilters,
} from '@/repositories/explore/ImportJobRepository';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

const DEFAULT_PAGINATION: ExplorePagination = { page: 1, pageSize: 25 };

export const exploreAdminImportJobKeys = {
  all: ['explore-admin', 'import-jobs'] as const,
  list: (filters: ExploreImportJobFilters, pagination: ExplorePagination) =>
    [...exploreAdminImportJobKeys.all, 'list', filters, pagination] as const,
  activeCount: () => [...exploreAdminImportJobKeys.all, 'active-count'] as const,
};

export function useExploreAdminImportJobs(
  filters: ExploreImportJobFilters = {},
  pagination: ExplorePagination = DEFAULT_PAGINATION,
) {
  const normalizedPagination = normalizePagination(pagination);
  return useQuery<ExplorePaginatedResult<ExploreImportJob>, Error>({
    queryKey: exploreAdminImportJobKeys.list(filters, normalizedPagination),
    queryFn: () => importJobRepository.list(filters, normalizedPagination),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.items.some((job) => job.status === 'queued' || job.status === 'running')
        ? 15_000
        : false,
    staleTime: 15_000,
  });
}

export function useExploreAdminActiveImportCount() {
  return useQuery<number, Error>({
    queryKey: exploreAdminImportJobKeys.activeCount(),
    queryFn: () => importJobRepository.countActive(),
    refetchInterval: 15_000,
    staleTime: 15_000,
  });
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
