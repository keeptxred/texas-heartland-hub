import {
  summarizeSharedSearchTelemetry,
  type SharedSearchTelemetryEvent,
  type SharedSearchTelemetrySummary,
} from './search-telemetry';
import { searchTelemetryForWindow } from './search-telemetry-retention';

export type SearchTelemetryTrend = {
  current: SharedSearchTelemetrySummary;
  previous: SharedSearchTelemetrySummary;
  searchChange: number;
  zeroResultChange: number;
  clickThroughRateChange: number;
};

export function compareSearchTelemetryWindows(
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
  windowDays = 30,
  now = new Date(),
): SearchTelemetryTrend {
  const days = Math.max(1, windowDays);
  const currentEvents = searchTelemetryForWindow(events, days, now);
  const previousEnd = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const previousWindow = searchTelemetryForWindow(events, days, previousEnd);
  const previousStart = previousEnd.getTime() - days * 24 * 60 * 60 * 1000;
  const previousEvents = previousWindow.filter((event) => Date.parse(event.occurredAt) >= previousStart);
  const current = summarizeSharedSearchTelemetry(currentEvents);
  const previous = summarizeSharedSearchTelemetry(previousEvents);

  return {
    current,
    previous,
    searchChange: current.searches - previous.searches,
    zeroResultChange: current.zeroResultSearches - previous.zeroResultSearches,
    clickThroughRateChange: current.clickThroughRate - previous.clickThroughRate,
  };
}
