import { describe, expect, it, vi } from 'vitest';
import { createSharedSearchTelemetryEvent } from './search-telemetry';
import { createBufferedSearchTelemetrySink } from './search-telemetry-buffer';

const event = (query: string) => createSharedSearchTelemetryEvent({
  query,
  resultCount: 1,
  selectedType: 'all',
  occurredAt: '2026-08-03T23:00:00.000Z',
});

describe('buffered search telemetry sink', () => {
  it('flushes when the batch size is reached', async () => {
    const batches: string[][] = [];
    const buffered = createBufferedSearchTelemetrySink({
      id: 'batch-test',
      batchSize: 2,
      flushIntervalMs: 1000,
      write: (events) => batches.push(events.map((item) => item.query)),
    });

    await buffered.sink.record(event('property taxes'));
    await buffered.sink.record(event('mortgage'));

    expect(batches).toEqual([['property taxes', 'mortgage']]);
    expect(buffered.pendingCount()).toBe(0);
  });

  it('supports manual flushing', async () => {
    const write = vi.fn();
    const buffered = createBufferedSearchTelemetrySink({
      id: 'manual-test',
      batchSize: 10,
      flushIntervalMs: 1000,
      write,
    });

    await buffered.sink.record(event('moving'));
    expect(await buffered.flush()).toBe(1);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('restores failed batches for a later retry', async () => {
    let attempts = 0;
    const buffered = createBufferedSearchTelemetrySink({
      id: 'retry-test',
      batchSize: 10,
      flushIntervalMs: 1000,
      write: () => {
        attempts += 1;
        if (attempts === 1) throw new Error('temporary failure');
      },
    });

    await buffered.sink.record(event('parks'));
    await expect(buffered.flush()).rejects.toThrow('temporary failure');
    expect(buffered.pendingCount()).toBe(1);
    await expect(buffered.flush()).resolves.toBe(1);
  });

  it('flushes remaining events when disposed', async () => {
    const write = vi.fn();
    const buffered = createBufferedSearchTelemetrySink({
      id: 'dispose-test',
      batchSize: 10,
      flushIntervalMs: 1000,
      write,
    });

    await buffered.sink.record(event('schools'));
    expect(await buffered.dispose()).toBe(1);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('validates its configuration', () => {
    expect(() => createBufferedSearchTelemetrySink({ id: '', write: () => undefined })).toThrow();
    expect(() => createBufferedSearchTelemetrySink({ id: 'bad', batchSize: 0, write: () => undefined })).toThrow();
    expect(() => createBufferedSearchTelemetrySink({ id: 'bad', flushIntervalMs: 0, write: () => undefined })).toThrow();
  });
});
