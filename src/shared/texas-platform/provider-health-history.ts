import type { EntityProviderStatus } from './providers';
import { summarizeEntityProviderHealth } from './provider-health';

export type EntityProviderHealthSnapshot = {
  capturedAt: string;
  providers: EntityProviderStatus[];
};

export type EntityProviderHealthChange = {
  providerId: string;
  previousStatus?: EntityProviderStatus['status'];
  currentStatus?: EntityProviderStatus['status'];
  durationChangeMs?: number;
  entityCountChange?: number;
};

export function createEntityProviderHealthSnapshot(
  providers: ReadonlyArray<EntityProviderStatus>,
  capturedAt = new Date().toISOString(),
): EntityProviderHealthSnapshot {
  return {
    capturedAt,
    providers: providers.map((provider) => ({ ...provider })),
  };
}

export function compareEntityProviderHealthSnapshots(
  previous: EntityProviderHealthSnapshot,
  current: EntityProviderHealthSnapshot,
): EntityProviderHealthChange[] {
  const previousById = new Map(previous.providers.map((provider) => [provider.id, provider]));
  const currentById = new Map(current.providers.map((provider) => [provider.id, provider]));
  const ids = new Set([...previousById.keys(), ...currentById.keys()]);

  return [...ids].sort().map((providerId) => {
    const before = previousById.get(providerId);
    const after = currentById.get(providerId);
    return {
      providerId,
      previousStatus: before?.status,
      currentStatus: after?.status,
      durationChangeMs: before && after ? after.durationMs - before.durationMs : undefined,
      entityCountChange: before && after ? after.entityCount - before.entityCount : undefined,
    };
  });
}

export function regressedEntityProviders(changes: ReadonlyArray<EntityProviderHealthChange>) {
  return changes.filter((change) =>
    change.previousStatus === 'ready' && change.currentStatus !== 'ready'
  );
}

export function recoveredEntityProviders(changes: ReadonlyArray<EntityProviderHealthChange>) {
  return changes.filter((change) =>
    change.previousStatus !== undefined && change.previousStatus !== 'ready' && change.currentStatus === 'ready'
  );
}

export function summarizeEntityProviderHealthHistory(snapshots: ReadonlyArray<EntityProviderHealthSnapshot>) {
  const latest = snapshots.at(-1);
  return {
    snapshots: snapshots.length,
    latestCapturedAt: latest?.capturedAt,
    latestHealth: latest ? summarizeEntityProviderHealth(latest.providers) : undefined,
  };
}
