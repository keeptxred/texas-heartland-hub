import type { SharedSearchTelemetryEvent } from './search-telemetry';
import type { SharedEntityType } from './entities';

const VALID_TYPES = new Set<SharedEntityType | 'all'>([
  'all',
  'city',
  'county',
  'representative',
  'bill',
  'committee',
  'agency',
  'guide',
  'calculator',
  'park',
  'school-district',
  'resource',
]);

export type SearchTelemetryValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateSharedSearchTelemetryEvent(
  event: SharedSearchTelemetryEvent,
): SearchTelemetryValidationResult {
  const errors: string[] = [];
  if (!event.query.trim()) errors.push('query is empty');
  if (event.query.length > 120) errors.push('query exceeds 120 characters');
  if (!Number.isInteger(event.resultCount) || event.resultCount < 0) {
    errors.push('resultCount must be a non-negative integer');
  }
  if (!VALID_TYPES.has(event.selectedType)) errors.push('selectedType is invalid');
  if (!Number.isFinite(Date.parse(event.occurredAt))) errors.push('occurredAt is invalid');
  if (event.clickedEntityId !== undefined && !event.clickedEntityId.trim()) {
    errors.push('clickedEntityId cannot be empty');
  }
  return { valid: errors.length === 0, errors };
}

export function validSharedSearchTelemetryEvents(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
) {
  return events.filter((event) => validateSharedSearchTelemetryEvent(event).valid);
}
