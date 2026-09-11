import { LEAGUE_META, type LeagueSlug } from "./texas-teams";

const CIVIC_CATEGORIES = new Set(["politics", "elections", "laws", "legislature"]);
const CIVIC_PRIMARY_CONTEXT = /\b(ballot|voters?|election|mayor|city council|council members?|commissioners?|legislation|legislative|senate|senator|house bill|senate bill|\bbill\b|lawmakers?|\blaw\b|court|judge|lawsuit|ordinance|referendum)\b/i;

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
