import type { EntityProviderStatus } from './providers';

export type EntityProviderHealthSummary = {
  total: number;
  ready: number;
  failed: number;
  timedOut: number;
  cached: number;
  loadedEntities: number;
  slowestProvider?: EntityProviderStatus;
  healthy: boolean;
};

export function summarizeEntityProviderHealth(
  providers: ReadonlyArray<EntityProviderStatus>,
): EntityProviderHealthSummary {
  let ready = 0;
  let failed = 0;
  let timedOut = 0;
  let cached = 0;
  let loadedEntities = 0;
  let slowestProvider: EntityProviderStatus | undefined;

  for (const provider of providers) {
    if (provider.status === 'ready') ready += 1;
    if (provider.status === 'failed') failed += 1;
    if (provider.status === 'timed-out') timedOut += 1;
    if (provider.cached) cached += 1;
    loadedEntities += provider.entityCount;
    if (!slowestProvider || provider.durationMs > slowestProvider.durationMs) {
      slowestProvider = provider;
    }
  }

  return {
    total: providers.length,
    ready,
    failed,
    timedOut,
    cached,
    loadedEntities,
    slowestProvider,
    healthy: failed === 0 && timedOut === 0,
  };
}

export function unhealthyEntityProviders(providers: ReadonlyArray<EntityProviderStatus>) {
  return providers.filter((provider) => provider.status !== 'ready');
}

export function sortEntityProviderStatuses(providers: ReadonlyArray<EntityProviderStatus>) {
  const priority: Record<EntityProviderStatus['status'], number> = {
    failed: 0,
    'timed-out': 1,
    ready: 2,
  };
  return [...providers].sort(
    (a, b) => priority[a.status] - priority[b.status] || b.durationMs - a.durationMs || a.id.localeCompare(b.id),
  );
}
