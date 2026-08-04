import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSearchTelemetryAlerts } from './search-telemetry-alerts';
import {
  clearSearchTelemetryAlertHandlersForTests,
  deliverSearchTelemetryAlerts,
  registerSearchTelemetryAlertHandler,
  registeredSearchTelemetryAlertHandlers,
} from './search-telemetry-alert-delivery';

afterEach(() => clearSearchTelemetryAlertHandlersForTests());

const anomaly = {
  code: 'zero-results-high' as const,
  severity: 'critical' as const,
  message: '55% returned no results.',
  value: 55,
};

describe('search telemetry alert delivery', () => {
  it('delivers alerts only to matching channels', async () => {
    const admin = vi.fn();
    const email = vi.fn();
    registerSearchTelemetryAlertHandler({ id: 'admin-handler', channel: 'admin', deliver: admin });
    registerSearchTelemetryAlertHandler({ id: 'email-handler', channel: 'email', deliver: email });

    const alerts = createSearchTelemetryAlerts([anomaly], { channels: ['admin'] });
    const result = await deliverSearchTelemetryAlerts(alerts);
    expect(admin).toHaveBeenCalledTimes(1);
    expect(email).not.toHaveBeenCalled();
    expect(result).toEqual([
      expect.objectContaining({ handlerId: 'admin-handler', status: 'fulfilled' }),
    ]);
  });

  it('isolates handler failures', async () => {
    registerSearchTelemetryAlertHandler({
      id: 'failure',
      channel: 'admin',
      deliver: () => { throw new Error('unavailable'); },
    });
    registerSearchTelemetryAlertHandler({ id: 'success', channel: 'admin', deliver: () => undefined });

    const result = await deliverSearchTelemetryAlerts(createSearchTelemetryAlerts([anomaly]));
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ handlerId: 'failure', status: 'rejected', error: 'unavailable' }),
      expect.objectContaining({ handlerId: 'success', status: 'fulfilled' }),
    ]));
  });

  it('trims ids, prevents duplicates and supports removal', () => {
    const remove = registerSearchTelemetryAlertHandler({ id: ' admin ', channel: 'admin', deliver: () => undefined });
    expect(registeredSearchTelemetryAlertHandlers()[0].id).toBe('admin');
    expect(() => registerSearchTelemetryAlertHandler({ id: 'admin', channel: 'admin', deliver: () => undefined })).toThrow(
      'already registered',
    );
    remove();
    expect(registeredSearchTelemetryAlertHandlers()).toHaveLength(0);
  });
});
