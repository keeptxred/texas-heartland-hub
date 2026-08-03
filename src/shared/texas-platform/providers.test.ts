import { afterEach, describe, expect, it } from 'vitest';
import { placeToSharedEntity } from './adapters';
import {
  clearEntityProvidersForTests,
  loadEntityProviders,
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

  it('prevents duplicate provider ids', () => {
    registerEntityProvider({ id: 'duplicate', load: () => [] });
    expect(() => registerEntityProvider({ id: 'duplicate', load: () => [] })).toThrow(
      'Entity provider already registered',
    );
    expect(registeredEntityProviders()).toHaveLength(1);
  });

  it('isolates provider failures so other entities still load', async () => {
    registerEntityProvider({
      id: 'failure',
      load: () => {
        throw new Error('provider unavailable');
      },
    });

    const entities = await loadEntityProviders({ site: 'keeptxred' });
    expect(entities.length).toBeGreaterThan(0);
  });
});
