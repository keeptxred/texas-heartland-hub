import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  relationshipRepository,
  type ExploreRelationshipFilters,
  type ExploreRelationshipRecord,
} from '@/repositories/explore/RelationshipRepository';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

const DEFAULT_PAGINATION: ExplorePagination = { page: 1, pageSize: 25 };

export const exploreAdminRelationshipKeys = {
  all: ['explore-admin', 'relationships'] as const,
  list: (filters: ExploreRelationshipFilters, pagination: ExplorePagination) =>
    [...exploreAdminRelationshipKeys.all, 'list', filters, pagination] as const,
};

export function useExploreAdminRelationships(
  filters: ExploreRelationshipFilters = {},
  pagination: ExplorePagination = DEFAULT_PAGINATION,
) {
  const normalizedPagination = normalizePagination(pagination);
  return useQuery<ExplorePaginatedResult<ExploreRelationshipRecord>, Error>({
    queryKey: exploreAdminRelationshipKeys.list(filters, normalizedPagination),
    queryFn: () => relationshipRepository.list(filters, normalizedPagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
