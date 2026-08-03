import { mergeEntityCollections } from './adapters';
import { SHARED_ENTITIES, searchEntityCollection, type EntitySearchResult, type SharedEntity } from './entities';
import type { SharedSite } from './registry';

export type EntityProviderContext = {
  site: SharedSite;
  query?: string;
  limit?: number;
};

export type SharedEntityProvider = {
  id: string;
  load: (context: EntityProviderContext) => Promise<ReadonlyArray<SharedEntity>> | ReadonlyArray<SharedEntity>;
};

const PROVIDERS = new Map<string, SharedEntityProvider>();

export function registerEntityProvider(provider: SharedEntityProvider) {
  if (!provider.id.trim()) throw new Error('Entity provider id cannot be empty.');
  if (PROVIDERS.has(provider.id)) throw new Error(`Entity provider already registered: ${provider.id}`);
  PROVIDERS.set(provider.id, provider);
  return () => PROVIDERS.delete(provider.id);
}

export function registeredEntityProviders() {
  return [...PROVIDERS.values()];
}

export async function loadEntityProviders(context: EntityProviderContext) {
  const collections = await Promise.all(
    registeredEntityProviders().map(async (provider) => {
      try {
        return await provider.load(context);
      } catch (error) {
        console.error(`Shared entity provider failed: ${provider.id}`, error);
        return [];
      }
    }),
  );

  const merged = mergeEntityCollections(SHARED_ENTITIES, ...collections).filter((entity) => entity.sites.includes(context.site));
  if (context.query?.trim()) return searchEntityCollection(context.query, merged, context.site, context.limit ?? 12);
  return merged.slice(0, context.limit && context.limit > 0 ? context.limit : undefined);
}

export async function searchEntityProviders(
  query: string,
  site: SharedSite,
  limit = 12,
): Promise<EntitySearchResult[]> {
  const result = await loadEntityProviders({ site, query, limit });
  return result as EntitySearchResult[];
}

export function clearEntityProvidersForTests() {
  PROVIDERS.clear();
}
