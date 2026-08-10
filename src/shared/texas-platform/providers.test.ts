import { afterEach, describe, expect, it } from 'vitest';
import { placeToSharedEntity } from './adapters';
import {
  clearEntityProviderCache,
  clearEntityProvidersForTests,
  entityProviderCacheSize,
  loadEntityProviders,
  loadEntityProvidersWithStatus,
  registerEntityProvider,
  registeredEntityProviders,
} from './providers';

afterEach(() => clearEntityProvidersForTests());

describe('shared entity providers', () => {
  it('loads and merges entities from registered providers', async () => {
    registerEntityProvider({
      id: 'test-cities',
      load: () => [
        placeToSharedEntity({
          id: 'katy',
          type: 'city',
          name: 'Katy',
          route: '/texas/cities/katy',
        }),
      ],
    });

    const entities = await loadEntityProviders({ site: 'texasdefined' });
    expect(entities.some((entity) => entity.id === 'city:katy')).toBe(true);
  });

  it('prevents duplicate provider ids and trims ids', () => {
    registerEntityProvider({ id: ' duplicate ', load: () => [] });
    expect(() => registerEntityProvider({ id: 'duplicate', load: () => [] })).toThrow(
      'Entity provider already registered',
    );
    expect(registeredEntityProviders()).toHaveLength(1);
    expect(registeredEntityProviders()[0].id).toBe('duplicate');
  });

  it('rejects invalid provider timeouts and cache TTLs', () => {
    expect(() => registerEntityProvider({ id: 'invalid-timeout', timeoutMs: 0, load: () => [] })).toThrow(
      'Entity provider timeout must be greater than zero',
    );
    expect(() => registerEntityProvider({ id: 'invalid-cache', cacheTtlMs: -1, load: () => [] })).toThrow(
      'Entity provider cache TTL cannot be negative',
    );
  });

  it('isolates provider failures so other entities still load', async () => {
    registerEntityProvider({
      id: 'failure',
      load: () => {
        throw new Error('provider unavailable');
      },
    });

    const result = await loadEntityProvidersWithStatus({ site: 'keeptxred' });
    expect(result.entities.length).toBeGreaterThan(0);
    expect(result.providers).toEqual([
      expect.objectContaining({ id: 'failure', status: 'failed', entityCount: 0, cached: false }),
    ]);
  });

  it('times out slow providers without blocking the shared registry', async () => {
    registerEntityProvider({
      id: 'slow-provider',
      timeoutMs: 5,
      load: () => new Promise((resolve) => setTimeout(() => resolve([]), 50)),
    });

    const result = await loadEntityProvidersWithStatus({ site: 'keeptxred' });
    expect(result.entities.length).toBeGreaterThan(0);
    expect(result.providers).toEqual([
      expect.objectContaining({ id: 'slow-provider', status: 'timed-out', entityCount: 0, cached: false }),
    ]);
  });

  it('reports successful provider counts', async () => {
    registerEntityProvider({
      id: 'successful-provider',
      load: () => [
        placeToSharedEntity({
          id: 'houston',
          type: 'city',
          name: 'Houston',
          route: '/texas/cities/houston',
        }),
      ],
    });

    const result = await loadEntityProvidersWithStatus({ site: 'texasdefined' });
    expect(result.providers).toEqual([
      expect.objectContaining({ id: 'successful-provider', status: 'ready', entityCount: 1, cached: false }),
    ]);
  });

  it('caches provider results for the configured TTL', async () => {
    let calls = 0;
    registerEntityProvider({
      id: 'cached-provider',
      cacheTtlMs: 1000,
      load: () => {
        calls += 1;
        return [];
      },
    });

    const first = await loadEntityProvidersWithStatus({ site: 'keeptxred' });
    const second = await loadEntityProvidersWithStatus({ site: 'keeptxred' });

    expect(calls).toBe(1);
    expect(first.providers[0].cached).toBe(false);
    expect(second.providers[0].cached).toBe(true);
    expect(entityProviderCacheSize()).toBe(1);
  });

  it('deduplicates concurrent provider requests', async () => {
    let calls = 0;
    registerEntityProvider({
      id: 'deduplicated-provider',
      load: async () => {
        calls += 1;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return [];
      },
    });

    await Promise.all([
      loadEntityProvidersWithStatus({ site: 'keeptxred' }),
      loadEntityProvidersWithStatus({ site: 'keeptxred' }),
    ]);

    expect(calls).toBe(1);
  });

  it('keeps cache entries separate by site and query', async () => {
    let calls = 0;
    registerEntityProvider({
      id: 'context-cache-provider',
      cacheTtlMs: 1000,
      load: () => {
        calls += 1;
        return [];
      },
    });

    await loadEntityProvidersWithStatus({ site: 'keeptxred', query: 'taxes' });
    await loadEntityProvidersWithStatus({ site: 'keeptxred', query: 'parks' });
    await loadEntityProvidersWithStatus({ site: 'texasdefined', query: 'taxes' });

    expect(calls).toBe(3);
    expect(entityProviderCacheSize()).toBe(3);
  });

  it('clears cache entries globally or by provider id', async () => {
    registerEntityProvider({ id: 'one', cacheTtlMs: 1000, load: () => [] });
    registerEntityProvider({ id: 'two', cacheTtlMs: 1000, load: () => [] });
    await loadEntityProvidersWithStatus({ site: 'keeptxred' });
    expect(entityProviderCacheSize()).toBe(2);

    clearEntityProviderCache('one');
    expect(entityProviderCacheSize()).toBe(1);

    clearEntityProviderCache();
    expect(entityProviderCacheSize()).toBe(0);
  });
});
