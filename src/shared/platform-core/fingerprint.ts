import { canonicalizeEntity, type TexasEntityRecord } from './entities';

export function fnv1aFingerprint(value: unknown): string {
  const canonical = typeof value === 'string' ? value : JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function fingerprintEntities(entities: TexasEntityRecord[]): string {
  return fnv1aFingerprint(
    entities.map(canonicalizeEntity).sort((left, right) => left.id.localeCompare(right.id)),
  );
}
