// Central registry for every Texas team surfaced under /texas-sports.
// A team's `slug` is the URL segment (/texas-sports/team/$team) AND the
// value stored in `daily_articles.teams[]` for cross-posting.

export type TeamKind = "pro" | "college";
export type LeagueSlug = "nfl" | "mlb" | "nba" | "cfb";

export type TeamMeta = {
  slug: string;
  name: string;         // display name
  short: string;        // short label ("Cowboys")
  league: LeagueSlug;
  kind: TeamKind;
  city: string;
  // Keywords used to detect the team in an article's title/dek for
  // cross-posting AND for backfilling legacy rows that predate teams[].
  keywords: string[];
};

export const TEAMS: readonly TeamMeta[] = [
  // NFL
  { slug: "texans", name: "Houston Texans", short: "Texans", league: "nfl", kind: "pro", city: "Houston",
    keywords: ["texans", "houston texans", "nrg stadium"] },
  { slug: "cowboys", name: "Dallas Cowboys", short: "Cowboys", league: "nfl", kind: "pro", city: "Dallas",
    keywords: ["cowboys", "dallas cowboys", "at&t stadium", "america's team"] },
  // MLB
  { slug: "astros", name: "Houston Astros", short: "Astros", league: "mlb", kind: "pro", city: "Houston",
    keywords: ["astros", "houston astros", "minute maid park", "'stros"] },
  { slug: "rangers", name: "Texas Rangers", short: "Rangers", league: "mlb", kind: "pro", city: "Arlington",
    keywords: ["texas rangers", "globe life field", "rangers baseball"] },
  // NBA
  { slug: "spurs", name: "San Antonio Spurs", short: "Spurs", league: "nba", kind: "pro", city: "San Antonio",
    keywords: ["spurs", "san antonio spurs", "frost bank center"] },
  { slug: "rockets", name: "Houston Rockets", short: "Rockets", league: "nba", kind: "pro", city: "Houston",
    keywords: ["rockets", "houston rockets", "toyota center"] },
  { slug: "mavericks", name: "Dallas Mavericks", short: "Mavericks", league: "nba", kind: "pro", city: "Dallas",
    keywords: ["mavericks", "dallas mavericks", "mavs", "american airlines center"] },
  // College football
  { slug: "longhorns", name: "Texas Longhorns", short: "Longhorns", league: "cfb", kind: "college", city: "Austin",
    keywords: ["longhorns", "texas longhorns", "hook 'em", "ut football", "darrell k royal"] },
  { slug: "aggies", name: "Texas A&M Aggies", short: "Aggies", league: "cfb", kind: "college", city: "College Station",
    keywords: ["aggies", "texas a&m", "12th man", "kyle field"] },
  { slug: "horned-frogs", name: "TCU Horned Frogs", short: "Horned Frogs", league: "cfb", kind: "college", city: "Fort Worth",
    keywords: ["tcu", "horned frogs", "amon g. carter stadium"] },
  { slug: "bears", name: "Baylor Bears", short: "Bears", league: "cfb", kind: "college", city: "Waco",
    keywords: ["baylor bears", "baylor football", "mclane stadium"] },
  { slug: "red-raiders", name: "Texas Tech Red Raiders", short: "Red Raiders", league: "cfb", kind: "college", city: "Lubbock",
    keywords: ["texas tech", "red raiders", "jones at&t stadium", "wreck 'em"] },
] as const;

export const TEAM_BY_SLUG: Record<string, TeamMeta> = Object.fromEntries(
  TEAMS.map((t) => [t.slug, t]),
);

export function isTeamSlug(v: string): boolean {
  return Object.prototype.hasOwnProperty.call(TEAM_BY_SLUG, v);
}

export function teamsForLeague(league: LeagueSlug): TeamMeta[] {
  return TEAMS.filter((t) => t.league === league);
}

export const LEAGUE_META: Record<LeagueSlug, { name: string; long: string }> = {
  nfl: { name: "NFL", long: "NFL — Texans & Cowboys" },
  mlb: { name: "MLB", long: "MLB — Astros & Rangers" },
  nba: { name: "NBA", long: "NBA — Spurs, Rockets & Mavericks" },
  cfb: { name: "College Football", long: "Texas College Football" },
};

/** Detect every team mentioned in a piece of text. Used both at ingest time
 *  (tag teams[]) and at query time (backfill legacy rows without teams[]). */
export function detectTeams(text: string): string[] {
  const hay = ` ${text.toLowerCase()} `;
  const hits: string[] = [];
  for (const t of TEAMS) {
    if (t.keywords.some((k) => hay.includes(k.toLowerCase()))) hits.push(t.slug);
  }
  return hits;
}