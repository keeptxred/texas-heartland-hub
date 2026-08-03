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
  timeoutMs?: number;
  load: (context: EntityProviderContext) => Promise<ReadonlyArray<SharedEntity>> | ReadonlyArray<SharedEntity>;
};

export type EntityProviderStatus = {
  id: string;
  status: 'ready' | 'failed' | 'timed-out';
  entityCount: number;
  durationMs: number;
};

export type EntityProviderLoadResult = {
  entities: SharedEntity[];
  providers: EntityProviderStatus[];
};

const DEFAULT_PROVIDER_TIMEOUT_MS = 5000;
const PROVIDERS = new Map<string, SharedEntityProvider>();

export function registerEntityProvider(provider: SharedEntityProvider) {
  const id = provider.id.trim();
  if (!id) throw new Error('Entity provider id cannot be empty.');
  if (PROVIDERS.has(id)) throw new Error(`Entity provider already registered: ${id}`);
  if (provider.timeoutMs !== undefined && (!Number.isFinite(provider.timeoutMs) || provider.timeoutMs <= 0)) {
    throw new Error(`Entity provider timeout must be greater than zero: ${id}`);
  }
  PROVIDERS.set(id, { ...provider, id });
  return () => PROVIDERS.delete(id);
}

export function registeredEntityProviders() {
  return [...PROVIDERS.values()];
}

async function loadProvider(provider: SharedEntityProvider, context: EntityProviderContext) {
  const startedAt = Date.now();
  const timeoutMs = provider.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    const entities = await Promise.race([
      Promise.resolve(provider.load(context)),
      new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);

    return {
      entities: [...entities],
      status: {
        id: provider.id,
        status: 'ready' as const,
        entityCount: entities.length,
        durationMs: Date.now() - startedAt,
      },
    };
  } catch (error) {
    const timedOut = error instanceof Error && error.message.startsWith('timed out after');
    console.error(`Shared entity provider ${timedOut ? 'timed out' : 'failed'}: ${provider.id}`, error);
    return {
      entities: [] as SharedEntity[],
      status: {
        id: provider.id,
        status: timedOut ? 'timed-out' as const : 'failed' as const,
        entityCount: 0,
        durationMs: Date.now() - startedAt,
      },
    };
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export async function loadEntityProvidersWithStatus(context: EntityProviderContext): Promise<EntityProviderLoadResult> {
  const results = await Promise.all(
    registeredEntityProviders().map((provider) => loadProvider(provider, context)),
  );
  const merged = mergeEntityCollections(
    SHARED_ENTITIES,
    ...results.map((result) => result.entities),
  ).filter((entity) => entity.sites.includes(context.site));
  const entities = context.query?.trim()
    ? searchEntityCollection(context.query, merged, context.site, context.limit ?? 12)
    : merged.slice(0, context.limit && context.limit > 0 ? context.limit : undefined);

  return {
    entities,
    providers: results.map((result) => result.status),
  };
}

export async function loadEntityProviders(context: EntityProviderContext) {
  const result = await loadEntityProvidersWithStatus(context);
  return result.entities;
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
