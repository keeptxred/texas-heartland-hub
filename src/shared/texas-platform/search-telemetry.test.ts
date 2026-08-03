import { describe, expect, it } from 'vitest';
import { createSharedSearchTelemetryEvent, summarizeSharedSearchTelemetry } from './search-telemetry';
import { isSearchTelemetryQuerySafe, sanitizeSearchTelemetryQuery } from './search-telemetry-privacy';

describe('shared search telemetry', () => {
  it('normalizes queries without storing extra user data', () => {
    const event = createSharedSearchTelemetryEvent({
      query: '  Property Taxes  ',
      resultCount: 4,
      selectedType: 'all',
    });
    expect(event.query).toBe('property taxes');
    expect(event.occurredAt).toBeTruthy();
    expect(event.redacted).toBeUndefined();
  });

  it('redacts email addresses, phone numbers and long identifiers', () => {
    const event = createSharedSearchTelemetryEvent({
      query: 'help jane@example.com 713-555-1212 account 123456789',
      resultCount: 0,
      selectedType: 'all',
    });
    expect(event.query).toBe('help [email] [phone] account [number]');
    expect(event.redacted).toBe(true);
  });

  it('reports whether a query requires redaction', () => {
    expect(isSearchTelemetryQuerySafe('property taxes')).toBe(true);
    expect(isSearchTelemetryQuerySafe('call 713-555-1212')).toBe(false);
    expect(sanitizeSearchTelemetryQuery('email me at test@example.com')).toEqual({
      query: 'email me at [email]',
      redacted: true,
    });
  });

  it('summarizes searches, zero-result searches and clicks', () => {
    const events = [
      createSharedSearchTelemetryEvent({ query: 'property taxes', resultCount: 4, selectedType: 'all', clickedEntityId: 'calculator:tax' }),
      createSharedSearchTelemetryEvent({ query: 'property taxes', resultCount: 4, selectedType: 'calculator' }),
      createSharedSearchTelemetryEvent({ query: 'unknown topic', resultCount: 0, selectedType: 'all' }),
      createSharedSearchTelemetryEvent({ query: 'jane@example.com', resultCount: 0, selectedType: 'all' }),
    ];
    const summary = summarizeSharedSearchTelemetry(events);
    expect(summary.searches).toBe(4);
    expect(summary.zeroResultSearches).toBe(2);
    expect(summary.clickThroughSearches).toBe(1);
    expect(summary.clickThroughRate).toBe(25);
    expect(summary.redactedSearches).toBe(1);
    expect(summary.topQueries[0]).toEqual({ query: 'property taxes', count: 2 });
    expect(summary.topZeroResultQueries).toEqual([
      { query: '[email]', count: 1 },
      { query: 'unknown topic', count: 1 },
    ]);
  });

  it('handles empty telemetry safely', () => {
    expect(summarizeSharedSearchTelemetry([])).toEqual(expect.objectContaining({
      searches: 0,
      clickThroughRate: 0,
      redactedSearches: 0,
      topQueries: [],
    }));
  });
});
