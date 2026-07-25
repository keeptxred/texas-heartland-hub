/*
PATH:
src/features/explore/admin/hooks/useExploreAdminReviewQueue.ts

FILE:
useExploreAdminReviewQueue.ts
*/

import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';

import { entityRepository } from '@/repositories/explore/EntityRepository';
import type {
  ExploreEntity,
  ExploreEntityStatus,
  ExplorePaginatedResult,
  ExplorePagination,
} from '@/types/explore';

const REVIEW_STATUSES: ExploreEntityStatus[] = ['imported', 'validated'];

const DEFAULT_PAGINATION: ExplorePagination = {
  page: 1,
  pageSize: 25,
};

export interface UseExploreAdminReviewQueueOptions {
  pagination?: ExplorePagination;
  status?: Extract<ExploreEntityStatus, 'imported' | 'validated'> | 'all';
}

export const exploreAdminReviewQueueKeys = {
  all: ['explore-admin', 'review-queue'] as const,
  list: (status: UseExploreAdminReviewQueueOptions['status'], pagination: ExplorePagination) =>
    [...exploreAdminReviewQueueKeys.all, 'list', status, pagination] as const,
  counts: () => [...exploreAdminReviewQueueKeys.all, 'counts'] as const,
};

export function useExploreAdminReviewQueue({
  pagination = DEFAULT_PAGINATION,
  status = 'all',
}: UseExploreAdminReviewQueueOptions = {}) {
  const normalizedPagination = normalizePagination(pagination);

  return useQuery<ExplorePaginatedResult<ExploreEntity>, Error>({
    queryKey: exploreAdminReviewQueueKeys.list(status, normalizedPagination),
    queryFn: async () => {
      if (status !== 'all') {
        return entityRepository.list({ status }, normalizedPagination);
      }

      const results = await Promise.all(
        REVIEW_STATUSES.map((reviewStatus) =>
          entityRepository.list(
            { status: reviewStatus },
            { page: 1, pageSize: 100 },
          ),
        ),
      );

      const combined = results
        .flatMap((result) => result.items)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

      const start = (normalizedPagination.page - 1) * normalizedPagination.pageSize;
      const end = start + normalizedPagination.pageSize;
      const total = results.reduce((sum, result) => sum + result.total, 0);

      return {
        items: combined.slice(start, end),
        total,
        page: normalizedPagination.page,
        pageSize: normalizedPagination.pageSize,
        totalPages: Math.max(1, Math.ceil(total / normalizedPagination.pageSize)),
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useExploreAdminReviewQueueCounts() {
  const results = useQueries({
    queries: REVIEW_STATUSES.map((status) => ({
      queryKey: [...exploreAdminReviewQueueKeys.counts(), status] as const,
      queryFn: () => entityRepository.list({ status }, { page: 1, pageSize: 1 }),
      staleTime: 30_000,
    })),
  });

  const imported = results[0]?.data?.total ?? 0;
  const validated = results[1]?.data?.total ?? 0;

  return {
    imported,
    validated,
    total: imported + validated,
    isLoading: results.some((result) => result.isLoading),
    isFetching: results.some((result) => result.isFetching),
    isError: results.some((result) => result.isError),
    error: results.find((result) => result.error)?.error ?? null,
    refetch: () => Promise.all(results.map((result) => result.refetch())),
  };
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
