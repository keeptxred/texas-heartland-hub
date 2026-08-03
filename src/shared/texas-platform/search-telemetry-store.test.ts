import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import {
  clearSharedSearchTelemetrySinksForTests,
  recordSharedSearchTelemetry,
  registerSharedSearchTelemetrySink,
  registeredSharedSearchTelemetrySinks,
} from './search-telemetry-store';

afterEach(() => clearSharedSearchTelemetrySinksForTests());

const event = createSharedSearchTelemetryEvent({
  query: 'property taxes',
  resultCount: 3,
  selectedType: 'all',
});

describe('search telemetry sinks', () => {
  it('records through every registered sink', async () => {
    const first = vi.fn();
    const second = vi.fn();
    registerSharedSearchTelemetrySink({ id: ' first ', record: first });
    registerSharedSearchTelemetrySink({ id: 'second', record: second });

    const deliveries = await recordSharedSearchTelemetry(event);
    expect(first).toHaveBeenCalledWith(event);
    expect(second).toHaveBeenCalledWith(event);
    expect(deliveries).toEqual([
      { id: 'first', status: 'fulfilled' },
      { id: 'second', status: 'fulfilled' },
    ]);
  });

  it('isolates rejected sinks and reports their errors', async () => {
    registerSharedSearchTelemetrySink({
      id: 'failure',
      record: () => Promise.reject(new Error('database unavailable')),
    });
    registerSharedSearchTelemetrySink({ id: 'success', record: () => undefined });

    expect(await recordSharedSearchTelemetry(event)).toEqual([
      { id: 'failure', status: 'rejected', error: 'database unavailable' },
      { id: 'success', status: 'fulfilled' },
    ]);
  });

  it('supports unregistering sinks', () => {
    const unregister = registerSharedSearchTelemetrySink({ id: 'temporary', record: () => undefined });
    expect(registeredSharedSearchTelemetrySinks()).toHaveLength(1);
    unregister();
    expect(registeredSharedSearchTelemetrySinks()).toHaveLength(0);
  });

  it('rejects empty and duplicate sink ids', () => {
    expect(() => registerSharedSearchTelemetrySink({ id: ' ', record: () => undefined })).toThrow('cannot be empty');
    registerSharedSearchTelemetrySink({ id: 'duplicate', record: () => undefined });
    expect(() => registerSharedSearchTelemetrySink({ id: ' duplicate ', record: () => undefined })).toThrow('already registered');
  });
});
