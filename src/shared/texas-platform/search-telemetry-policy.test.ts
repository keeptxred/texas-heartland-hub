import { describe, expect, it, vi } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { createPolicyControlledSearchTelemetrySink } from './search-telemetry-policy';

describe('search telemetry policy', () => {
  const event = createSharedSearchTelemetryEvent({
    query: 'property taxes',
    resultCount: 3,
    selectedType: 'all',
  });

  it('passes accepted events to the wrapped sink', async () => {
    const record = vi.fn();
    const controlled = createPolicyControlledSearchTelemetrySink(
      { id: 'test', record },
      { random: () => 0, sampleRate: 1 },
    );
    await controlled.sink.record(event);
    expect(record).toHaveBeenCalledWith(event);
    expect(controlled.stats()).toEqual({ accepted: 1, sampledOut: 0, rateLimited: 0 });
  });

  it('samples events without calling the wrapped sink', async () => {
    const record = vi.fn();
    const controlled = createPolicyControlledSearchTelemetrySink(
      { id: 'test', record },
      { random: () => 0.8, sampleRate: 0.5 },
    );
    await controlled.sink.record(event);
    expect(record).not.toHaveBeenCalled();
    expect(controlled.stats().sampledOut).toBe(1);
  });

  it('limits events within a rolling minute window', async () => {
    let now = 1_000;
    const record = vi.fn();
    const controlled = createPolicyControlledSearchTelemetrySink(
      { id: 'test', record },
      { random: () => 0, maxEventsPerMinute: 1, now: () => now },
    );
    await controlled.sink.record(event);
    await controlled.sink.record(event);
    expect(record).toHaveBeenCalledTimes(1);
    expect(controlled.stats().rateLimited).toBe(1);

    now += 60_000;
    await controlled.sink.record(event);
    expect(record).toHaveBeenCalledTimes(2);
  });

  it('validates policy configuration', () => {
    expect(() => createPolicyControlledSearchTelemetrySink(
      { id: 'test', record: () => undefined },
      { sampleRate: 2 },
    )).toThrow('sample rate');
    expect(() => createPolicyControlledSearchTelemetrySink(
      { id: 'test', record: () => undefined },
      { maxEventsPerMinute: 0 },
    )).toThrow('event limit');
  });
});
