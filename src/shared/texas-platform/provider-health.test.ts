import { describe, expect, it } from 'vitest';
import {
  sortEntityProviderStatuses,
  summarizeEntityProviderHealth,
  unhealthyEntityProviders,
} from './provider-health';
import type { EntityProviderStatus } from './providers';

const providers: EntityProviderStatus[] = [
  { id: 'ready-fast', status: 'ready', entityCount: 4, durationMs: 10, cached: true },
  { id: 'failed', status: 'failed', entityCount: 0, durationMs: 30, cached: false },
  { id: 'timeout', status: 'timed-out', entityCount: 0, durationMs: 50, cached: false },
  { id: 'ready-slow', status: 'ready', entityCount: 6, durationMs: 40, cached: false },
];

describe('entity provider health', () => {
  it('summarizes provider readiness, failures and loaded entities', () => {
    expect(summarizeEntityProviderHealth(providers)).toEqual({
      total: 4,
      ready: 2,
      failed: 1,
      timedOut: 1,
      cached: 1,
      loadedEntities: 10,
      slowestProvider: providers[2],
      healthy: false,
    });
  });

  it('marks an empty or entirely ready provider set healthy', () => {
    expect(summarizeEntityProviderHealth([]).healthy).toBe(true);
    expect(summarizeEntityProviderHealth([providers[0], providers[3]]).healthy).toBe(true);
  });

  it('returns only providers needing attention', () => {
    expect(unhealthyEntityProviders(providers).map((provider) => provider.id)).toEqual(['failed', 'timeout']);
  });

  it('sorts failures and timeouts before ready providers', () => {
    expect(sortEntityProviderStatuses(providers).map((provider) => provider.id)).toEqual([
      'failed',
      'timeout',
      'ready-slow',
      'ready-fast',
    ]);
  });

  it('does not mutate the source status array', () => {
    const source = [...providers];
    sortEntityProviderStatuses(source);
    expect(source).toEqual(providers);
  });
});
