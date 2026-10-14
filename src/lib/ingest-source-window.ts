/**
 * A scheduled source window keeps every configured feed discoverable without
 * asking one Cloudflare Worker request to fetch 70+ remote origins.
 *
 * First-party/direct backbone feeds are always included; supplemental
 * sources are partitioned across consecutive 30-minute invocations.
 * Windows are deterministic, bounded, non-overlapping and exhaustive.
 */
export function selectRotatedSourceWindow<T extends { url: string }>(
  sources: readonly T[],
  coreUrls: ReadonlySet<string>,
  supplementalPerRun: number,
  slot: number,
): { selected: T[]; deferred: number; windows: number } {
  if (!Number.isSafeInteger(supplementalPerRun) || supplementalPerRun <= 0) {
    throw new Error("supplementalPerRun must be a positive integer");
  }
  if (!Number.isSafeInteger(slot) || slot < 0) {
    throw new Error("slot must be a nonnegative integer");
  }
  const core = sources.filter((source) => coreUrls.has(source.url.toLowerCase()));
  // URL ordering (not insertion order) keeps slices predictable as feeds are
  // added, removed or returned by PostgREST in a different order.
  const supplemental = sources
    .filter((source) => !coreUrls.has(source.url.toLowerCase()))
    .sort((a, b) => a.url.localeCompare(b.url));
  const windows = Math.max(1, Math.ceil(supplemental.length / supplementalPerRun));
  const start = (slot % windows) * supplementalPerRun;
  const rotated = supplemental.slice(start, start + supplementalPerRun);
  return {
    selected: [...core, ...rotated],
    deferred: supplemental.length - rotated.length,
    windows,
  };
}
