import { describe, expect, it } from 'vitest';
import {
  normalizeDailyResourceViews,
  normalizeRecentlyViewed,
  popularResourcesForDate,
  recordDailyResourceView,
  recordRecentlyViewed,
} from './resource-hub-personalization';

const bills = { label: 'Texas Bills', href: '/bills' };
const elections = { label: 'Election Central', href: '/elections' };

describe('resource hub personalization', () => {
  it('normalizes and deduplicates recently viewed resources', () => {
    expect(normalizeRecentlyViewed([bills, bills, { label: '', href: '/bad' }, { label: 'External', href: 'https://example.com' }]))
      .toEqual([bills]);
  });

  it('places the latest resource first without mutating history', () => {
    const previous = [bills];
    const next = recordRecentlyViewed(previous, elections);
    expect(next).toEqual([elections, bills]);
    expect(previous).toEqual([bills]);
  });

  it('increments same-day views and discards older dates', () => {
    const previous = [{ ...bills, count: 2, date: '2026-08-02' }];
    const first = recordDailyResourceView(previous, bills, '2026-08-03');
    const second = recordDailyResourceView(first, bills, '2026-08-03');
    expect(second).toEqual([{ ...bills, count: 2, date: '2026-08-03' }]);
    expect(previous[0].count).toBe(2);
  });

  it('orders popular resources by current-day view count', () => {
    const views = [
      { ...bills, count: 2, date: '2026-08-03' },
      { ...elections, count: 4, date: '2026-08-03' },
    ];
    expect(popularResourcesForDate(views, '2026-08-03')).toEqual([elections, bills]);
  });

  it('uses a copied fallback when no current-day views exist', () => {
    const fallback = [bills];
    const result = popularResourcesForDate([], '2026-08-03', fallback);
    expect(result).toEqual(fallback);
    expect(result).not.toBe(fallback);
  });

  it('rejects malformed stored view records', () => {
    expect(normalizeDailyResourceViews([
      { ...bills, count: 0, date: '2026-08-03' },
      { ...bills, count: 1, date: 'not-a-date' },
      { ...bills, count: 1, date: '2026-08-03' },
    ])).toEqual([{ ...bills, count: 1, date: '2026-08-03' }]);
  });
});
