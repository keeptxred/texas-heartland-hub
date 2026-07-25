/*
PATH:
src/features/explore/admin/hooks/useExploreAdminDuplicateCandidates.ts

FILE:
useExploreAdminDuplicateCandidates.ts
*/

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  duplicateCandidateRepository,
  type ExploreDuplicateCandidate,
  type ExploreDuplicateCandidateFilters,
  type ResolveExploreDuplicateCandidateInput,
} from '@/repositories/explore/DuplicateCandidateRepository';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

const DEFAULT_PAGINATION: ExplorePagination = {
  page: 1,
  pageSize: 25,
};

export interface UseExploreAdminDuplicateCandidatesOptions {
  filters?: ExploreDuplicateCandidateFilters;
  pagination?: ExplorePagination;
}

export interface ResolveExploreAdminDuplicateCandidateVariables {
  candidateId: string;
  input: ResolveExploreDuplicateCandidateInput;
}

export const exploreAdminDuplicateCandidateKeys = {
  all: ['explore-admin', 'duplicate-candidates'] as const,
  lists: () => [...exploreAdminDuplicateCandidateKeys.all, 'list'] as const,
  list: (filters: ExploreDuplicateCandidateFilters, pagination: ExplorePagination) =>
    [...exploreAdminDuplicateCandidateKeys.lists(), filters, pagination] as const,
  details: () => [...exploreAdminDuplicateCandidateKeys.all, 'detail'] as const,
  detail: (candidateId: string) =>
    [...exploreAdminDuplicateCandidateKeys.details(), candidateId] as const,
  pendingCount: () => [...exploreAdminDuplicateCandidateKeys.all, 'pending-count'] as const,
};

export function useExploreAdminDuplicateCandidates({
  filters = { status: 'pending' },
  pagination = DEFAULT_PAGINATION,
}: UseExploreAdminDuplicateCandidatesOptions = {}) {
  const normalizedFilters = normalizeFilters(filters);
  const normalizedPagination = normalizePagination(pagination);

  return useQuery<ExplorePaginatedResult<ExploreDuplicateCandidate>, Error>({
    queryKey: exploreAdminDuplicateCandidateKeys.list(
      normalizedFilters,
      normalizedPagination,
    ),
    queryFn: () =>
      duplicateCandidateRepository.list(normalizedFilters, normalizedPagination),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useExploreAdminDuplicateCandidate(candidateId: string | null) {
  return useQuery<ExploreDuplicateCandidate, Error>({
    queryKey: exploreAdminDuplicateCandidateKeys.detail(candidateId ?? ''),
    queryFn: async () => {
      if (!candidateId) {
        throw new Error('A duplicate candidate ID is required.');
      }

      const candidate = await duplicateCandidateRepository.findById(candidateId);

      if (!candidate) {
        throw new Error(`Explore duplicate candidate ${candidateId} was not found.`);
      }

      return candidate;
    },
    enabled: Boolean(candidateId),
    staleTime: 30_000,
  });
}

export function useExploreAdminPendingDuplicateCount() {
  return useQuery<number, Error>({
    queryKey: exploreAdminDuplicateCandidateKeys.pendingCount(),
    queryFn: () => duplicateCandidateRepository.countPending(),
    staleTime: 30_000,
  });
}

export function useResolveExploreAdminDuplicateCandidate() {
  const queryClient = useQueryClient();

  return useMutation<
    ExploreDuplicateCandidate,
    Error,
    ResolveExploreAdminDuplicateCandidateVariables
  >({
    mutationFn: ({ candidateId, input }) =>
      duplicateCandidateRepository.resolve(candidateId, input),
    onSuccess: async (candidate) => {
      queryClient.setQueryData(
        exploreAdminDuplicateCandidateKeys.detail(candidate.id),
        candidate,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: exploreAdminDuplicateCandidateKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: exploreAdminDuplicateCandidateKeys.pendingCount(),
        }),
      ]);
    },
  });
}

function normalizeFilters(
  filters: ExploreDuplicateCandidateFilters,
): ExploreDuplicateCandidateFilters {
  const minimumSimilarity =
    filters.minimumSimilarity === undefined
      ? undefined
      : Math.max(0, Math.min(1, filters.minimumSimilarity));

  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(minimumSimilarity !== undefined ? { minimumSimilarity } : {}),
  };
}

function normalizePagination(pagination: ExplorePagination): ExplorePagination {
  return {
    page: Math.max(1, Math.trunc(pagination.page)),
    pageSize: Math.min(100, Math.max(1, Math.trunc(pagination.pageSize))),
  };
}
