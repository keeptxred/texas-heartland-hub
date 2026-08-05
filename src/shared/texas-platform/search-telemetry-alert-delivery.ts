import type { SearchTelemetryAlert, SearchTelemetryAlertChannel } from './search-telemetry-alerts';

export type SearchTelemetryAlertHandler = {
  id: string;
  channel: SearchTelemetryAlertChannel;
  deliver: (alert: SearchTelemetryAlert) => void | Promise<void>;
};

export type SearchTelemetryAlertDelivery = {
  handlerId: string;
  alertKey: string;
  status: 'fulfilled' | 'rejected';
  error?: string;
};

const HANDLERS = new Map<string, SearchTelemetryAlertHandler>();

export function registerSearchTelemetryAlertHandler(handler: SearchTelemetryAlertHandler) {
  const id = handler.id.trim();
  if (!id) throw new Error('Search telemetry alert handler id cannot be empty.');
  if (HANDLERS.has(id)) throw new Error(`Search telemetry alert handler already registered: ${id}`);
  HANDLERS.set(id, { ...handler, id });
  return () => HANDLERS.delete(id);
}

export function registeredSearchTelemetryAlertHandlers() {
  return [...HANDLERS.values()];
}

export async function deliverSearchTelemetryAlerts(
  alerts: ReadonlyArray<SearchTelemetryAlert>,
): Promise<SearchTelemetryAlertDelivery[]> {
  const handlers = registeredSearchTelemetryAlertHandlers();
  const deliveries = alerts.flatMap((alert) =>
    handlers
      .filter((handler) => handler.channel === alert.channel)
      .map((handler) => ({ alert, handler })),
  );

  return Promise.all(deliveries.map(async ({ alert, handler }) => {
    try {
      await handler.deliver(alert);
      return { handlerId: handler.id, alertKey: alert.key ?? alert.id, status: 'fulfilled' as const };
    } catch (error) {
      return {
        handlerId: handler.id,
        alertKey: alert.key ?? alert.id,
        status: 'rejected' as const,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }));
}

export function clearSearchTelemetryAlertHandlersForTests() {
  HANDLERS.clear();
}
