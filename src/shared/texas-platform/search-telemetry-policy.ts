import type { SharedSearchTelemetryEvent } from './search-telemetry';
import type { SharedSearchTelemetrySink } from './search-telemetry-store';

export type SearchTelemetryPolicyOptions = {
  sampleRate?: number;
  maxEventsPerMinute?: number;
  random?: () => number;
  now?: () => number;
};

export type SearchTelemetryPolicyStats = {
  accepted: number;
  sampledOut: number;
  rateLimited: number;
};

export function createPolicyControlledSearchTelemetrySink(
  sink: SharedSearchTelemetrySink,
  options: SearchTelemetryPolicyOptions = {},
) {
  const sampleRate = options.sampleRate ?? 1;
  const maxEventsPerMinute = options.maxEventsPerMinute ?? 120;
  if (!Number.isFinite(sampleRate) || sampleRate < 0 || sampleRate > 1) {
    throw new Error('Search telemetry sample rate must be between zero and one.');
  }
  if (!Number.isInteger(maxEventsPerMinute) || maxEventsPerMinute <= 0) {
    throw new Error('Search telemetry event limit must be a positive integer.');
  }

  const random = options.random ?? Math.random;
  const now = options.now ?? Date.now;
  let windowStartedAt = now();
  let eventsInWindow = 0;
  const stats: SearchTelemetryPolicyStats = { accepted: 0, sampledOut: 0, rateLimited: 0 };

  function resetWindowIfNeeded() {
    const current = now();
    if (current - windowStartedAt >= 60_000) {
      windowStartedAt = current;
      eventsInWindow = 0;
    }
  }

  const controlledSink: SharedSearchTelemetrySink = {
    id: `${sink.id}:policy`,
    async record(event: SharedSearchTelemetryEvent) {
      resetWindowIfNeeded();
      if (random() >= sampleRate) {
        stats.sampledOut += 1;
        return;
      }
      if (eventsInWindow >= maxEventsPerMinute) {
        stats.rateLimited += 1;
        return;
      }
      eventsInWindow += 1;
      stats.accepted += 1;
      await sink.record(event);
    },
  };

  return {
    sink: controlledSink,
    stats: () => ({ ...stats }),
    reset() {
      windowStartedAt = now();
      eventsInWindow = 0;
      stats.accepted = 0;
      stats.sampledOut = 0;
      stats.rateLimited = 0;
    },
  };
}
