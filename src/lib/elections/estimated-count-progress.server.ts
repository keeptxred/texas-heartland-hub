/**
 * Optional, separately sourced estimated-votes-counted data. This is NOT
 * Texas SOS polling-location progress, and is never derived from it.
 *
 * Upstream feeds must be authorized for republication and list the actual
 * methodology/source for each estimate; overlapping underlying providers
 * are deduplicated by sourceFamily before calculating a mean.
 */
export interface EstimatedCountSource {
  sourceName: string;
  sourceFamily: string;
  sourceUrl: string;
  updatedAt: string;
  percent: number;
}
export interface EstimatedCountProgress {
  percent: number;
  method: "single_provider" | "independent_mean";
  sources: EstimatedCountSource[];
  updatedAt: string;
}
export type EstimatedCountIndex = Record<string, EstimatedCountProgress>;

const MAX_SOURCE_AGE_MS = 30 * 60_000;
const FUTURE_TOLERANCE_MS = 2 * 60_000;
const MAX_ENTRIES = 2000;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function safeUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.username === "" && url.password === "";
  } catch { return false; }
}
/**
 * Only a dated, per-race, verified 2026 general election provider feed is
 * accepted. A stale or missing feed produces no misleading estimate.
 */
export function parseEstimatedCountFeed(
  input: unknown,
  raceIds: readonly string[],
  now = Date.now(),
): EstimatedCountIndex {
  if (!isObject(input) || input.electionDate !== "2026-11-03" ||
      !Array.isArray(input.estimates) || input.estimates.length > MAX_ENTRIES) {
    return {};
  }
  const allowedIds = new Set(raceIds);
  const byRace = new Map<string, Map<string, EstimatedCountSource>>();
  for (const item of input.estimates) {
    if (!isObject(item)) continue;
    const { raceId, sourceName, sourceFamily, sourceUrl, updatedAt, percent } = item;
    if (typeof raceId !== "string" || !allowedIds.has(raceId) ||
        typeof sourceName !== "string" || sourceName.trim().length < 2 || sourceName.length > 100 ||
        typeof sourceFamily !== "string" || !/^[a-z0-9_-]{1,40}$/i.test(sourceFamily) ||
        !safeUrl(sourceUrl) || typeof updatedAt !== "string" ||
        typeof percent !== "number" || !Number.isFinite(percent) || percent < 0 || percent > 100) {
      continue;
    }
    const time = Date.parse(updatedAt);
    if (!Number.isFinite(time) || time < now - MAX_SOURCE_AGE_MS || time > now + FUTURE_TOLERANCE_MS) {
      continue;
    }
    const entry: EstimatedCountSource = {sourceName: sourceName.trim(), sourceFamily: sourceFamily.toLowerCase(), sourceUrl, updatedAt, percent};
    const familyMap = byRace.get(raceId) ?? new Map<string, EstimatedCountSource>();
    const previous = familyMap.get(entry.sourceFamily);
    if (!previous || Date.parse(previous.updatedAt) < time) familyMap.set(entry.sourceFamily, entry);
    byRace.set(raceId, familyMap);
  }
  const result: EstimatedCountIndex = {};
  for (const [raceId, families] of byRace) {
    const sources = [...families.values()].sort((a, b) => a.sourceFamily.localeCompare(b.sourceFamily));
    if (sources.length === 0) continue;
    const average = sources.reduce((sum, source) => sum + source.percent, 0) / sources.length;
    result[raceId] = {
      percent: Math.round(average * 10) / 10,
      method: sources.length > 1 ? "independent_mean" : "single_provider",
      sources,
      updatedAt: new Date(Math.max(...sources.map((source) => Date.parse(source.updatedAt)))).toISOString(),
    };
  }
  return result;
}

export async function loadEstimatedCountFeed(
  raceIds: readonly string[],
): Promise<{ state: "not_configured" | "available" | "unavailable"; byRace: EstimatedCountIndex }> {
  const configuredUrl = process.env.ELECTION_ESTIMATES_FEED_URL?.trim();
  if (!configuredUrl) return { state: "not_configured", byRace: {} };
  if (!safeUrl(configuredUrl)) return { state: "unavailable", byRace: {} };
  try {
    const token = process.env.ELECTION_ESTIMATES_FEED_TOKEN?.trim();
    const response = await fetch(configuredUrl, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      redirect: "error",
      signal: AbortSignal.timeout(2_500),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Estimate provider HTTP " + response.status);
    if (Number(response.headers.get("content-length") || 0) > 300_000) throw new Error("Estimate provider payload too large");
    const body = await response.text();
    if (body.length > 300_000) throw new Error("Estimate provider payload too large");
    const byRace = parseEstimatedCountFeed(JSON.parse(body), raceIds);
    return { state: Object.keys(byRace).length > 0 ? "available" : "unavailable", byRace };
  } catch (error) {
    console.error("[election-estimate-progress] Authorized estimate provider unavailable:", error instanceof Error ? error.message : String(error));
    return { state: "unavailable", byRace: {} };
  }
}
