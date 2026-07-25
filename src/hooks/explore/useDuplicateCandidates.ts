import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';

import {
  listExploreDuplicateCandidatesFn,
  getExploreDuplicateCandidateFn,
  mergeExploreDuplicateCandidateFn,
  resolveExploreDuplicateCandidateFn,
  type ListDuplicatesResult,
  type GetDuplicateResult,
  type MergeCandidateResult,
  type ResolveCandidateResult,
} from '@/services/explore/duplicateMerge.functions';
import type {
  ExploreDuplicateCandidate,
  ExploreDuplicateCandidateWithEntities,
  ExploreDuplicateStatus,
  ExploreMergeResult,
} from '@/types/explore/duplicates';

export const exploreDuplicateKeys = {
  all: ['explore', 'duplicates'] as const,
  lists: () => [...exploreDuplicateKeys.all, 'list'] as const,
  list: (params: { status: ExploreDuplicateStatus; page: number; pageSize: number }) =>
    [...exploreDuplicateKeys.lists(), params] as const,
  details: () => [...exploreDuplicateKeys.all, 'detail'] as const,
  detail: (id: string) => [...exploreDuplicateKeys.details(), id] as const,
};

export type DuplicateListData = {
  items: ExploreDuplicateCandidateWithEntities[];
  total: number;
  page: number;
  pageSize: number;
};

function unwrap<T>(result: { ok: true; data: T } | { ok: false; error: { code: string; message: string } }): T {
  if (result.ok) return result.data;
  throw new Error(result.error.message || 'Request failed');
}

export function useDuplicateCandidatesList(params: {
  token: string;
  status: ExploreDuplicateStatus;
  page: number;
  pageSize: number;
  enabled?: boolean;
}): UseQueryResult<DuplicateListData, Error> {
  const fn = useServerFn(listExploreDuplicateCandidatesFn);
  return useQuery({
    queryKey: exploreDuplicateKeys.list({
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    }),
    queryFn: async () => {
      const res: ListDuplicatesResult = await fn({
        data: {
          token: params.token,
          status: params.status,
          page: params.page,
          pageSize: params.pageSize,
        },
      });
      return unwrap(res);
    },
    enabled: (params.enabled ?? true) && params.token.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useDuplicateCandidateDetail(params: {
  token: string;
  candidateId: string | null | undefined;
}): UseQueryResult<ExploreDuplicateCandidateWithEntities, Error> {
  const fn = useServerFn(getExploreDuplicateCandidateFn);
  const id = params.candidateId ?? '';
  return useQuery({
    queryKey: exploreDuplicateKeys.detail(id),
    queryFn: async () => {
      const res: GetDuplicateResult = await fn({
        data: { token: params.token, candidateId: id },
      });
      return unwrap(res);
    },
    enabled: params.token.length > 0 && id.length > 0,
    staleTime: 15_000,
  });
}

export type MergeInput = {
  candidateId: string;
  survivorId: string;
  reason?: string;
};

export function useMergeDuplicateCandidate(
  token: string,
): UseMutationResult<ExploreMergeResult, Error, MergeInput> {
  const fn = useServerFn(mergeExploreDuplicateCandidateFn);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MergeInput) => {
      const res: MergeCandidateResult = await fn({
        data: {
          token,
          candidateId: input.candidateId,
          survivorId: input.survivorId,
          reason: input.reason,
        },
      });
      return unwrap(res);
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: exploreDuplicateKeys.lists() });
      qc.invalidateQueries({ queryKey: exploreDuplicateKeys.detail(result.candidateId) });
      // Broadly refresh any explore entity/search caches that may exist.
      qc.invalidateQueries({ queryKey: ['explore', 'entities'] });
      qc.invalidateQueries({ queryKey: ['explore', 'entity', result.survivorId] });
      qc.invalidateQueries({ queryKey: ['explore', 'entity', result.loserId] });
      qc.invalidateQueries({ queryKey: ['explore', 'search'] });
    },
  });
}

export type ResolveInput = {
  candidateId: string;
  status: Extract<ExploreDuplicateStatus, 'not_duplicate' | 'deferred'>;
  reason?: string;
};

export function useResolveDuplicateCandidate(
  token: string,
): UseMutationResult<ExploreDuplicateCandidate, Error, ResolveInput> {
  const fn = useServerFn(resolveExploreDuplicateCandidateFn);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ResolveInput) => {
      if (input.status !== 'not_duplicate' && input.status !== 'deferred') {
        throw new Error('Invalid resolution status');
      }
      const res: ResolveCandidateResult = await fn({
        data: {
          token,
          candidateId: input.candidateId,
          status: input.status,
          reason: input.reason,
        },
      });
      return unwrap(res);
    },
    onSuccess: (candidate) => {
      qc.invalidateQueries({ queryKey: exploreDuplicateKeys.lists() });
      qc.invalidateQueries({ queryKey: exploreDuplicateKeys.detail(candidate.id) });
    },
  });
}