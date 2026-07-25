/*
PATH:
src/features/explore/admin/hooks/useExploreAdminEntityMutations.ts

FILE:
useExploreAdminEntityMutations.ts
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { entityRepository } from '@/repositories/explore/EntityRepository';
import type { ExploreEntity, ExploreEntityUpdateInput } from '@/types/explore';

import { exploreAdminEntityKeys } from './useExploreAdminEntities';

export interface UpdateExploreAdminEntityVariables {
  entityId: string;
  input: ExploreEntityUpdateInput;
}

export interface ArchiveExploreAdminEntityVariables {
  entityId: string;
}

export function useUpdateExploreAdminEntity() {
  const queryClient = useQueryClient();

  return useMutation<ExploreEntity, Error, UpdateExploreAdminEntityVariables>({
    mutationFn: ({ entityId, input }) => entityRepository.update(entityId, input),
    onSuccess: async (entity) => {
      queryClient.setQueryData(exploreAdminEntityKeys.detail(entity.id), entity);

      await queryClient.invalidateQueries({
        queryKey: exploreAdminEntityKeys.lists(),
      });
    },
  });
}

export function useArchiveExploreAdminEntity() {
  const queryClient = useQueryClient();

  return useMutation<ExploreEntity, Error, ArchiveExploreAdminEntityVariables>({
    mutationFn: ({ entityId }) => entityRepository.archive(entityId),
    onSuccess: async (entity) => {
      queryClient.setQueryData(exploreAdminEntityKeys.detail(entity.id), entity);

      await queryClient.invalidateQueries({
        queryKey: exploreAdminEntityKeys.lists(),
      });
    },
  });
}
