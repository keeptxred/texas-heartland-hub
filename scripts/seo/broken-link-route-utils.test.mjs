import { describe, expect, it } from 'vitest';
import { normalizeRoutePart } from './broken-link-route-utils.mjs';

describe('broken-link TanStack route normalization', () => {
  it('removes non-nesting suffix underscores from public path segments', () => {
    expect(normalizeRoutePart('figures_')).toBe('figures');
    expect(normalizeRoutePart('races_')).toBe('races');
  });

  it('drops pathless layout and route-group segments', () => {
    expect(normalizeRoutePart('_authenticated')).toBeNull();
    expect(normalizeRoutePart('(marketing)')).toBeNull();
  });

  it('preserves ordinary and dynamic route segments', () => {
    expect(normalizeRoutePart('texas-politics')).toBe('texas-politics');
    expect(normalizeRoutePart('$figureSlug')).toBe('$figureSlug');
  });
});
