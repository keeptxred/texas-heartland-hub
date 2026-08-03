import { describe, expect, it } from 'vitest';
import {
  createSearchResultClickEvent,
  searchTelemetrySnapshotKey,
  shouldRecordSearchTelemetry,
} from './search-telemetry-session';

const snapshot = {
  query: ' Property Taxes ',
  resultCount: 4,
  selectedType: 'all' as const,
};

describe('search telemetry sessions', () => {
  it('normalizes snapshot keys', () => {
    expect(searchTelemetrySnapshotKey(snapshot)).toBe('property taxes|all|4');
  });

  it('records a new useful search once', () => {
    const first = shouldRecordSearchTelemetry(undefined, snapshot);
    expect(first.shouldRecord).toBe(true);
    expect(shouldRecordSearchTelemetry(first.nextKey, snapshot).shouldRecord).toBe(false);
  });

  it('records result-count and type changes', () => {
    const key = searchTelemetrySnapshotKey(snapshot);
    expect(shouldRecordSearchTelemetry(key, { ...snapshot, resultCount: 0 }).shouldRecord).toBe(true);
    expect(shouldRecordSearchTelemetry(key, { ...snapshot, selectedType: 'calculator' }).shouldRecord).toBe(true);
  });

  it('does not record empty searches', () => {
    expect(shouldRecordSearchTelemetry(undefined, { ...snapshot, query: '   ' }).shouldRecord).toBe(false);
  });

  it('creates click events with the selected entity', () => {
    expect(createSearchResultClickEvent(snapshot, 'resource:property-tax-calculator')).toEqual(
      expect.objectContaining({
        query: 'property taxes',
        resultCount: 4,
        selectedType: 'all',
        clickedEntityId: 'resource:property-tax-calculator',
      }),
    );
  });
});
