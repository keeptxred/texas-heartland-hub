/**
 * Write gate for periodic newsroom rankings. Recency and relative rank can
 * fluctuate even when the underlying publisher evidence does not change.
 * Keep ranking calculations every run, but do not generate WAL for those
 * cosmetic fluctuations. Material signal, status, urgency-band and larger
 * score changes are still persisted.
 */
type Breakdown = Record<string, unknown> | null | undefined;
const EPHEMERAL = new Set([
  "recency", "baseEditorialScore", "selectionRank", "selectionReasons",
  "selectionScore", "selectionTier",
]);

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "undefined";
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stable(record[key])}`).join(",")}}`;
}

function urgencyBand(score: number, breakdown: Breakdown): string {
  if (breakdown?.breakingOverride === true || score >= 90) return "urgent";
  if (score >= 75) return "high";
  return "normal";
}

export function shouldPersistNewsroomScore(
  previous: { score: number; breakdown: Breakdown; status?: string | null } | null,
  next: { score: number; breakdown: Breakdown; status?: string | null },
): boolean {
  if (!previous) return true;
  if ((previous.status ?? null) !== (next.status ?? null)) return true;

  // A change in verified sources, editorial merit, breaking status, duplication,
  // or another non-ephemeral field is always material, regardless of size.
  const fields = new Set([
    ...Object.keys(previous.breakdown ?? {}),
    ...Object.keys(next.breakdown ?? {}),
  ]);
  for (const field of fields) {
    if (EPHEMERAL.has(field)) continue;
    if (stable(previous.breakdown?.[field]) !== stable(next.breakdown?.[field])) return true;
  }
  if (urgencyBand(previous.score, previous.breakdown) !== urgencyBand(next.score, next.breakdown)) return true;

  // Bound score drift to two points; source refreshes and urgency transitions
  // still write immediately, but hourly recency ticks do not churn full rows.
  return Math.abs(Number(next.score) - Number(previous.score)) >= 3;
}
