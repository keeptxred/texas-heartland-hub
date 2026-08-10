import { describe, expect, it } from 'vitest';
import {
  compareEntityProviderHealthSnapshots,
  createEntityProviderHealthSnapshot,
  recoveredEntityProviders,
  regressedEntityProviders,
  summarizeEntityProviderHealthHistory,
} from './provider-health-history';

const ready = { id: 'bills', status: 'ready' as const, entityCount: 100, durationMs: 40, cached: false };
const failed = { id: 'bills', status: 'failed' as const, entityCount: 0, durationMs: 10, cached: false };

describe('provider health history', () => {
  it('creates immutable snapshots', () => {
    const providers = [ready];
    const snapshot = createEntityProviderHealthSnapshot(providers, '2026-08-03T00:00:00.000Z');
    expect(snapshot.capturedAt).toBe('2026-08-03T00:00:00.000Z');
    expect(snapshot.providers).toEqual(providers);
    expect(snapshot.providers).not.toBe(providers);
  });

  it('detects provider regressions and recoveries', () => {
    const first = createEntityProviderHealthSnapshot([ready]);
    const second = createEntityProviderHealthSnapshot([failed]);
    const regression = compareEntityProviderHealthSnapshots(first, second);
    expect(regressedEntityProviders(regression)).toHaveLength(1);

    const recovery = compareEntityProviderHealthSnapshots(second, first);
    expect(recoveredEntityProviders(recovery)).toHaveLength(1);
  });

  it('reports duration and entity-count changes', () => {
    const first = createEntityProviderHealthSnapshot([ready]);
    const second = createEntityProviderHealthSnapshot([{ ...ready, durationMs: 70, entityCount: 120 }]);
    expect(compareEntityProviderHealthSnapshots(first, second)[0]).toEqual(expect.objectContaining({
      durationChangeMs: 30,
      entityCountChange: 20,
    }));
  });

  it('summarizes the latest snapshot', () => {
    const snapshots = [createEntityProviderHealthSnapshot([ready])];
    const summary = summarizeEntityProviderHealthHistory(snapshots);
    expect(summary.snapshots).toBe(1);
    expect(summary.latestHealth?.healthy).toBe(true);
  });
});
