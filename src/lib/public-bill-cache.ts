/**
 * Small per-isolate cache for public Texas legislative records. Only use for
 * published, non-personalized data. Shared in-flight promises collapse
 * simultaneous server-rendered requests; TTL and max entries prevent stale or
 * unbounded Worker memory. Errors and partial responses are never cached.
 */
const MAX_PUBLIC_BILL_ENTRIES = 250;
type CacheEntry = { expiresAt: number; promise: Promise<unknown> };
const entries = new Map<string, CacheEntry>();

export async function cachedPublicBill<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs = 120_000,
  canCache: (value: T) => boolean = () => true,
): Promise<T> {
  const now = Date.now();
  const previous = entries.get(key);
  if (previous && previous.expiresAt > now) return previous.promise as Promise<T>;
  if (previous) entries.delete(key);

  const promise = Promise.resolve().then(loader);
  const entry: CacheEntry = { expiresAt: now + ttlMs, promise };
  entries.set(key, entry);
  while (entries.size > MAX_PUBLIC_BILL_ENTRIES) {
    const first = entries.keys().next().value;
    if (first === undefined) break;
    entries.delete(first);
  }

  try {
    const value = await promise;
    if (!canCache(value) && entries.get(key) === entry) entries.delete(key);
    return value;
  } catch (error) {
    if (entries.get(key) === entry) entries.delete(key);
    throw error;
  }
}

/** Test-only cache isolation; not needed by application consumers. */
export function clearPublicBillCache(): void {
  entries.clear();
}
