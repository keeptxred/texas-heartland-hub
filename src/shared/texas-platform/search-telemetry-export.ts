import type { SharedSearchTelemetryEvent } from './search-telemetry';
import { validSharedSearchTelemetryEvents } from './search-telemetry-validation';

function csvCell(value: string | number | boolean | undefined) {
  const text = value === undefined ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function sharedSearchTelemetryCsv(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
) {
  const rows = validSharedSearchTelemetryEvents(events)
    .slice()
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .map((event) => [
      event.occurredAt,
      event.query,
      event.selectedType,
      event.resultCount,
      event.clickedEntityId,
      Boolean(event.clickedEntityId),
      Boolean((event as SharedSearchTelemetryEvent & { redacted?: boolean }).redacted),
    ].map(csvCell).join(','));

  return [
    'occurred_at,query,selected_type,result_count,clicked_entity_id,clicked,redacted',
    ...rows,
  ].join('\n');
}

export function sharedSearchTelemetryJson(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
) {
  return JSON.stringify(validSharedSearchTelemetryEvents(events), null, 2);
}
