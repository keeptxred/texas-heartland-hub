import type { SharedEntityType } from './entities';
import {
  createSharedSearchTelemetryEvent,
  type SharedSearchTelemetryEvent,
} from './search-telemetry';

export type SearchTelemetrySnapshot = {
  query: string;
  resultCount: number;
  selectedType: SharedEntityType | 'all';
};

export function searchTelemetrySnapshotKey(snapshot: SearchTelemetrySnapshot) {
  const event = createSharedSearchTelemetryEvent({ ...snapshot });
  return `${event.query}|${event.selectedType}|${event.resultCount}`;
}

export function shouldRecordSearchTelemetry(
  previousKey: string | undefined,
  snapshot: SearchTelemetrySnapshot,
) {
  const nextKey = searchTelemetrySnapshotKey(snapshot);
  return {
    shouldRecord: Boolean(snapshot.query.trim()) && nextKey !== previousKey,
    nextKey,
  };
}

export function createSearchResultClickEvent(
  snapshot: SearchTelemetrySnapshot,
  clickedEntityId: string,
): SharedSearchTelemetryEvent {
  return createSharedSearchTelemetryEvent({
    ...snapshot,
    clickedEntityId,
  });
}
