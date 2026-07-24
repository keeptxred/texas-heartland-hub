import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { entityRepository } from '@/repositories/explore/EntityRepository';
import type {
  ExploreEntityFilters,
  ExplorePaginatedResult,
  ExplorePagination,
  ExploreEntity,
} from '@/types/explore';

export interface ExploreAdminEntityQuery {
  filters?: ExploreEntityFilters;
  pagination?: ExplorePagination;
}

export const exploreAdminEntityKeys = {
  all: ['explore-admin', 'entities'] as const,
  lists: () => [...exploreAdminEntityKeys.all, 'list'] as const,
  list: (filters: ExploreEntityFilters, pagination: ExplorePagination) =>
    [...exploreAdminEntityKeys.lists(), filters, pagination] as const,
  details: () => [...exploreAdminEntityKeys.all, 'detail'] as const,
  detail: (entityId: string) => [...exploreAdminEntityKeys.details(), entityId] as const,
};

const DEFAULT_PAGINATION: ExplorePagination = {
  page: 1,
  pageSize: 25,
};

export function useExploreAdminEntities({
  filters = {},
  pagination = DEFAULT_PAGINATION,
}: ExploreAdminEntityQuery = {}) {
  const normalizedFilters = normalizeFilters(filters);
  const normalizedPagination = normalizePagination(pagination);

  return useQuery<ExplorePaginatedResult<ExploreEntity>, Error>({
    queryKey: exploreAdminEntityKeys.list(normalizedFilters, normalizedPagination),
    queryFn: () => entityRepository.list(normalizedFilters, normalizedPagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

function normalizeFilters(filters: ExploreEntityFilters): ExploreEntityFilters {
  const query = filters.query?.trim();

  return {
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.visibility ? { visibility: filters.visibility } : {}),
    ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
    ...(filters.categorySlugs?.length ? { categorySlugs: [...filters.categorySlugs].sort() } : {}),
    ...(filters.tagSlugs?.length ? { tagSlugs: [...filters.tagSlugs].sort() } : {}),
    ...(query ? { query } : {}),
  };
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
