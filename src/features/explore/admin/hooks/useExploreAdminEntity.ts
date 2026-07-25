import { useQuery } from '@tanstack/react-query';

import { entityRepository } from '@/repositories/explore/EntityRepository';
import type { ExploreEntity } from '@/types/explore';

import { exploreAdminEntityKeys } from './useExploreAdminEntities';

export interface UseExploreAdminEntityOptions {
  enabled?: boolean;
}

export function useExploreAdminEntity(
  entityId: string | null | undefined,
  options: UseExploreAdminEntityOptions = {},
) {
  const normalizedEntityId = entityId?.trim() ?? '';
  const enabled = options.enabled ?? true;

  return useQuery<ExploreEntity, Error>({
    queryKey: exploreAdminEntityKeys.detail(normalizedEntityId),
    queryFn: async () => {
      const entity = await entityRepository.findById(normalizedEntityId);

      if (!entity) {
        throw new Error(`Explore Texas entity not found: ${normalizedEntityId}`);
      }

      return entity;
    },
    enabled: enabled && normalizedEntityId.length > 0,
    staleTime: 30_000,
  });
}
