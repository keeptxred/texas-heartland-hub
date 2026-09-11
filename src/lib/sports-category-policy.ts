import { LEAGUE_META, type LeagueSlug } from "./texas-teams";

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
): string {
  const current = (existing ?? "").trim();
  if (taxonomyLocked && current) return current;
  return sportsCategoryFor(kind, leagues);
}
