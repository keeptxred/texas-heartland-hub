import type { SharedSearchTelemetryEvent } from './search-telemetry';
import type { SharedSearchTelemetrySink } from './search-telemetry-store';

export type SearchTelemetryBatchWriter = (
  events: ReadonlyArray<SharedSearchTelemetryEvent>,
) => void | Promise<void>;

export type BufferedSearchTelemetryOptions = {
  id: string;
  batchSize?: number;
  flushIntervalMs?: number;
  write: SearchTelemetryBatchWriter;
};

export type BufferedSearchTelemetrySink = {
  sink: SharedSearchTelemetrySink;
  flush: () => Promise<number>;
  pendingCount: () => number;
  dispose: () => Promise<number>;
};

export function createBufferedSearchTelemetrySink(
  options: BufferedSearchTelemetryOptions,
): BufferedSearchTelemetrySink {
  const id = options.id.trim();
  if (!id) throw new Error('Buffered search telemetry sink id cannot be empty.');
  const batchSize = options.batchSize ?? 20;
  const flushIntervalMs = options.flushIntervalMs ?? 5000;
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error('Buffered search telemetry batch size must be a positive integer.');
  }
  if (!Number.isFinite(flushIntervalMs) || flushIntervalMs <= 0) {
    throw new Error('Buffered search telemetry flush interval must be greater than zero.');
  }

  let queue: SharedSearchTelemetryEvent[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let inFlight: Promise<number> | undefined;
  let disposed = false;

  function scheduleFlush() {
    if (disposed || timer || !queue.length) return;
    timer = setTimeout(() => {
      timer = undefined;
      void flush();
    }, flushIntervalMs);
  }

  async function flush(): Promise<number> {
    if (inFlight) return inFlight;
    if (!queue.length) return 0;
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }

    const batch = queue.slice(0, batchSize);
    queue = queue.slice(batch.length);
    inFlight = Promise.resolve(options.write(batch))
      .then(() => batch.length)
      .catch((error) => {
        queue = [...batch, ...queue];
        throw error;
      })
      .finally(() => {
        inFlight = undefined;
        scheduleFlush();
      });
    return inFlight;
  }

  const sink: SharedSearchTelemetrySink = {
    id,
    record(event) {
      if (disposed) return;
      queue.push(event);
      if (queue.length >= batchSize) return flush().then(() => undefined);
      scheduleFlush();
    },
  };

  return {
    sink,
    flush,
    pendingCount: () => queue.length,
    async dispose() {
      disposed = true;
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      let written = 0;
      while (queue.length) written += await flush();
      return written;
    },
  };
}
