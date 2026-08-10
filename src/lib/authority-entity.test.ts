import { describe, expect, it } from 'vitest';
import {
  AUTHORITY_ENTITY_TYPES,
  createAuthorityEntityKey,
  isAuthorityEntityType,
} from '@/lib/authority-entity';

describe('authority entity foundation', () => {
  it('recognizes every canonical authority entity type', () => {
    for (const entityType of AUTHORITY_ENTITY_TYPES) {
      expect(isAuthorityEntityType(entityType)).toBe(true);
    }
  });

  it('rejects legacy and unrelated relationship types', () => {
    expect(isAuthorityEntityType('representative')).toBe(false);
    expect(isAuthorityEntityType('bill')).toBe(false);
    expect(isAuthorityEntityType(null)).toBe(false);
  });

  it('creates a stable namespaced entity key', () => {
    expect(createAuthorityEntityKey('legislator', 'jane-doe')).toBe(
      'legislator:jane-doe',
    );
  });
});
