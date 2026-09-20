import { LEAGUE_META, type LeagueSlug } from "./texas-teams";

const CIVIC_CATEGORIES = new Set(["politics", "elections", "laws", "legislature"]);
const CIVIC_PRIMARY_CONTEXT = /\b(ballot|voters?|election|mayor|city council|council members?|commissioners?|legislation|legislative|senate|senator|house bill|senate bill|\bbill\b|lawmakers?|\blaw\b|court|judge|lawsuit|ordinance|referendum)\b/i;
const SPORTS_VISIBLE_CATEGORIES = new Set([
  "sports",
  "nfl",
  "mlb",
  "nba",
  "nhl",
  "mls",
  "nwsl",
  "wnba",
  "college sports",
  "motorsports",
  "sports business & policy",
]);
const SPORTS_AUTO_LOCK_FLAG = "sports_taxonomy_auto_locked";
const TAXONOMY_LOCK_FLAG = "taxonomy_locked";

export function sportsCategoryFor(kind: string | null | undefined, leagues: LeagueSlug[]): string {
  if (kind === "sports-policy") return "Sports Business & Policy";
  if (kind === "sports-motorsports") return "Motorsports";
  if (leagues.length === 1 && leagues[0] in LEAGUE_META) {
    return leagues[0] === "cfb" ? "College Sports" : LEAGUE_META[leagues[0]].name;
  }
  return "Sports";
}

export function resolveSportsCategory(
  existing: string | null | undefined,
  kind: string | null | undefined,
  leagues: LeagueSlug[],
  taxonomyLocked = false,
  editorialIdentityText = "",
): string {
  const current = (existing ?? "").trim();
  if (taxonomyLocked && current) return current;

  const normalized = current.toLowerCase();
  if (CIVIC_CATEGORIES.has(normalized) && CIVIC_PRIMARY_CONTEXT.test(editorialIdentityText)) {
    return current;
  }

  return sportsCategoryFor(kind, leagues);
}

export function applySportsTaxonomyAutoLock(
  flags: string[] | null | undefined,
  resolvedCategory: string | null | undefined,
): string[] {
  const current = [...(flags ?? [])];
  const normalized = (resolvedCategory ?? "").trim().toLowerCase();
  if (!SPORTS_VISIBLE_CATEGORIES.has(normalized)) return current;
  if (current.includes(TAXONOMY_LOCK_FLAG)) return current;
  return Array.from(new Set([...current, TAXONOMY_LOCK_FLAG, SPORTS_AUTO_LOCK_FLAG]));
}

export function clearSportsTaxonomyAutoLock(flags: string[] | null | undefined): string[] {
  const current = [...(flags ?? [])];
  if (!current.includes(SPORTS_AUTO_LOCK_FLAG)) return current;
  return current.filter((flag) => flag !== SPORTS_AUTO_LOCK_FLAG && flag !== TAXONOMY_LOCK_FLAG);
}
