import { describe, expect, it } from 'vitest';
import {
  createAuthorityEntityRegistry,
  STATIC_AUTHORITY_ENTITIES,
  STATIC_AUTHORITY_ENTITY_REGISTRY,
} from '@/lib/authority-entity-registry';
import type { AuthorityEntity } from '@/lib/authority-entity';

const entity = (id: string, relatedEntityIds: string[] = []): AuthorityEntity => ({
  id,
  entityType: 'agency',
  slug: id.split(':')[1],
  name: id,
  active: true,
  lastVerified: null,
  sourceOfTruth: null,
  title: null,
  subtitle: null,
  summary: null,
  imageUrl: null,
  relatedEntityIds,
  createdAt: null,
  updatedAt: null,
});

describe('authority entity registry', () => {
  it('indexes every static authority entity by its stable ID', () => {
    expect(STATIC_AUTHORITY_ENTITY_REGISTRY.all).toHaveLength(
      STATIC_AUTHORITY_ENTITIES.length,
    );
    for (const item of STATIC_AUTHORITY_ENTITIES) {
      expect(STATIC_AUTHORITY_ENTITY_REGISTRY.getById(item.id)).toBe(item);
    }
  });

  it('groups entities by canonical type', () => {
    expect(STATIC_AUTHORITY_ENTITY_REGISTRY.getByType('district').length).toBeGreaterThan(0);
    expect(
      STATIC_AUTHORITY_ENTITY_REGISTRY.getByType('district').every(
        (item) => item.entityType === 'district',
      ),
    ).toBe(true);
  });

  it('resolves known relationships and ignores unresolved dynamic IDs', () => {
    const first = entity('agency:first', ['agency:second', 'committee:database-only']);
    const second = entity('agency:second');
    const registry = createAuthorityEntityRegistry([first, second]);

    expect(registry.getRelated(first)).toEqual([second]);
  });

  it('rejects duplicate authority IDs', () => {
    expect(() => createAuthorityEntityRegistry([entity('agency:same'), entity('agency:same')])).toThrow(
      /Duplicate authority entity ID/,
    );
  });
});
