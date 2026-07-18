// Lifecycle rules for sports-breaking articles.
//
// Only articles whose `kind` starts with "sports-breaking" age out. Weekly
// team analysis (kind = "sports-nfl" | "sports-mlb" | "sports-nba" | ...)
// and pillar guides are evergreen and never filtered by these helpers.
//
// Age windows (based on published_at):
//   0–30 days   → show everywhere (team, league, sports index, happening now)
//   31–90 days  → remove from happening now; keep on team + league pages
//   91–365 days → remove from team + league pages; still indexable/searchable
//   365+ days   → archive only

const DAY_MS = 24 * 60 * 60 * 1000;

export type SportsSurface =
  | "happening-now"
  | "team"
  | "league"
  | "sports-index"
  | "archive";

export function isBreakingSportsKind(kind: string | null | undefined): boolean {
  return typeof kind === "string" && kind.startsWith("sports-breaking");
}

function ageInDays(publishedAt: string | null | undefined): number {
  if (!publishedAt) return 0;
  const t = Date.parse(publishedAt);
  if (Number.isNaN(t)) return 0;
  return (Date.now() - t) / DAY_MS;
}

/** True when a sports-breaking article is within the initial 30-day window. */
export function isRecentBreakingSports(
  kind: string | null | undefined,
  publishedAt: string | null | undefined,
): boolean {
  if (!isBreakingSportsKind(kind)) return false;
  return ageInDays(publishedAt) <= 30;
}

/** Surface-aware visibility gate for sports-breaking articles.
 *  Non-breaking sports content (weekly analysis, pillars) is always allowed. */
export function shouldDisplayBreakingSports(
  kind: string | null | undefined,
  publishedAt: string | null | undefined,
  surface: SportsSurface,
): boolean {
  if (!isBreakingSportsKind(kind)) return true;
  const age = ageInDays(publishedAt);
  switch (surface) {
    case "happening-now":
    case "sports-index":
      return age <= 30;
    case "team":
    case "league":
      return age <= 90;
    case "archive":
      return true;
    default:
      return age <= 30;
  }
}