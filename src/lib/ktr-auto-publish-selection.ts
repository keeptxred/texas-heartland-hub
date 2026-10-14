/** KeepTXRed auto-publishing is restricted to its own explicit route.
 * Rows held for source corroboration use a durable retry cooldown; normal
 * ingest and manual publication are never blocked by this selector.
 */
export function shouldAttemptKtrAutoPublish(row: {
  eligible: boolean;
  targetSite: string | null;
  internalSlug: string | null;
  retryAfter?: unknown;
}, nowMs = Date.now()): boolean {
  if (!row.eligible || row.targetSite !== "keeptxred" || row.internalSlug) return false;
  if (typeof row.retryAfter !== "string") return true;
  const retryAtMs = Date.parse(row.retryAfter);
  return !Number.isFinite(retryAtMs) || nowMs >= retryAtMs;
}
