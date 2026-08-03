import { afterEach, describe, expect, it } from 'vitest';
import { placeToSharedEntity } from './adapters';
import {
  clearEntityProvidersForTests,
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

  it('rejects invalid provider timeouts', () => {
    expect(() => registerEntityProvider({ id: 'invalid-timeout', timeoutMs: 0, load: () => [] })).toThrow(
      'Entity provider timeout must be greater than zero',
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
      expect.objectContaining({ id: 'failure', status: 'failed', entityCount: 0 }),
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
      expect.objectContaining({ id: 'slow-provider', status: 'timed-out', entityCount: 0 }),
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
      expect.objectContaining({ id: 'successful-provider', status: 'ready', entityCount: 1 }),
    ]);
  });
});
