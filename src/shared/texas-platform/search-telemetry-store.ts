import type { SharedSearchTelemetryEvent } from './search-telemetry';

export type SharedSearchTelemetrySink = {
  id: string;
  record: (event: SharedSearchTelemetryEvent) => void | Promise<void>;
};

export type SharedSearchTelemetryDelivery = {
  id: string;
  status: 'fulfilled' | 'rejected';
  error?: string;
};

const SINKS = new Map<string, SharedSearchTelemetrySink>();

export function registerSharedSearchTelemetrySink(sink: SharedSearchTelemetrySink) {
  const id = sink.id.trim();
  if (!id) throw new Error('Search telemetry sink id cannot be empty.');
  if (SINKS.has(id)) throw new Error(`Search telemetry sink already registered: ${id}`);
  SINKS.set(id, { ...sink, id });
  return () => SINKS.delete(id);
}

export function registeredSharedSearchTelemetrySinks() {
  return [...SINKS.values()];
}

export async function recordSharedSearchTelemetry(
  event: SharedSearchTelemetryEvent,
): Promise<SharedSearchTelemetryDelivery[]> {
  const sinks = registeredSharedSearchTelemetrySinks();
  const results = await Promise.allSettled(sinks.map((sink) => Promise.resolve(sink.record(event))));
  return results.map((result, index) => ({
    id: sinks[index]?.id ?? 'unknown',
    status: result.status,
    ...(result.status === 'rejected'
      ? { error: result.reason instanceof Error ? result.reason.message : String(result.reason) }
      : {}),
  }));
}

export function clearSharedSearchTelemetrySinksForTests() {
  SINKS.clear();
}
