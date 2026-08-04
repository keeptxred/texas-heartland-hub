import { describe, expect, it } from 'vitest';
import {
  clearResourcePersonalization,
  popularResourcesFromStorage,
  readResourcePersonalization,
  recordResourceOpen,
  type ResourcePersonalizationStorage,
} from './resource-hub-personalization-storage';

function memoryStorage(initial: Record<string, string> = {}): ResourcePersonalizationStorage & { values: Map<string, string> } {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

describe('resource hub personalization storage', () => {
  it('records recently viewed resources and same-day popularity', () => {
    const storage = memoryStorage();
    recordResourceOpen(storage, 'keeptxred', { label: 'Texas Bills', href: '/bills' }, '2026-08-03');
    const snapshot = recordResourceOpen(storage, 'keeptxred', { label: 'Texas Bills', href: '/bills' }, '2026-08-03');

    expect(snapshot.recentlyViewed).toEqual([{ label: 'Texas Bills', href: '/bills' }]);
    expect(snapshot.dailyViews).toEqual([{ label: 'Texas Bills', href: '/bills', date: '2026-08-03', count: 2 }]);
  });

  it('keeps site personalization isolated', () => {
    const storage = memoryStorage();
    recordResourceOpen(storage, 'keeptxred', { label: 'Texas Bills', href: '/bills' }, '2026-08-03');
    recordResourceOpen(storage, 'texasdefined', { label: 'Texas Parks', href: '/parks' }, '2026-08-03');

    expect(readResourcePersonalization(storage, 'keeptxred').recentlyViewed[0]?.href).toBe('/bills');
    expect(readResourcePersonalization(storage, 'texasdefined').recentlyViewed[0]?.href).toBe('/parks');
  });

  it('returns fallback popularity when no valid views exist', () => {
    const storage = memoryStorage();
    const fallback = [{ label: 'Representatives', href: '/representatives' }];
    expect(popularResourcesFromStorage(storage, 'keeptxred', '2026-08-03', fallback)).toEqual(fallback);
  });

  it('recovers from malformed stored JSON', () => {
    const storage = memoryStorage({
      'texas-resource-personalization:keeptxred:recent': '{bad json',
      'texas-resource-personalization:keeptxred:daily': 'not-json',
    });
    expect(readResourcePersonalization(storage, 'keeptxred')).toEqual({ recentlyViewed: [], dailyViews: [] });
  });

  it('clears one site without deleting the other site history', () => {
    const storage = memoryStorage();
    recordResourceOpen(storage, 'keeptxred', { label: 'Bills', href: '/bills' }, '2026-08-03');
    recordResourceOpen(storage, 'texasdefined', { label: 'Cities', href: '/cities' }, '2026-08-03');

    expect(clearResourcePersonalization(storage, 'keeptxred')).toBe(true);
    expect(readResourcePersonalization(storage, 'keeptxred').recentlyViewed).toEqual([]);
    expect(readResourcePersonalization(storage, 'texasdefined').recentlyViewed).toHaveLength(1);
  });

  it('handles unavailable storage without throwing', () => {
    const storage: ResourcePersonalizationStorage = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(readResourcePersonalization(storage, 'keeptxred')).toEqual({ recentlyViewed: [], dailyViews: [] });
    expect(() => recordResourceOpen(storage, 'keeptxred', { label: 'Bills', href: '/bills' }, '2026-08-03')).not.toThrow();
    expect(clearResourcePersonalization(storage, 'keeptxred')).toBe(false);
  });
});
