// Central registry for every Texas team surfaced under /texas-sports.
// A team's `slug` is the URL segment (/texas-sports/team/$team) AND the
// value stored in `daily_articles.teams[]` for cross-posting.

export type TeamKind = "pro" | "college";
export type LeagueSlug = "nfl" | "mlb" | "nba" | "nhl" | "mls" | "nwsl" | "wnba" | "cfb";

export type TeamMeta = {
  slug: string;
  name: string;
  short: string;
  league: LeagueSlug;
  kind: TeamKind;
  city: string;
  state?: string;
  conference?: string;
  keywords: string[];
};

export const TEAMS: readonly TeamMeta[] = [
  { slug: "texans", name: "Houston Texans", short: "Texans", league: "nfl", kind: "pro", city: "Houston", keywords: ["houston texans", "texans football", "texans nfl"] },
  { slug: "cowboys", name: "Dallas Cowboys", short: "Cowboys", league: "nfl", kind: "pro", city: "Arlington", keywords: ["dallas cowboys", "cowboys", "america's team"] },
  { slug: "astros", name: "Houston Astros", short: "Astros", league: "mlb", kind: "pro", city: "Houston", keywords: ["houston astros", "astros", "'stros"] },
  { slug: "rangers", name: "Texas Rangers", short: "Rangers", league: "mlb", kind: "pro", city: "Arlington", keywords: ["texas rangers", "rangers baseball"] },
  { slug: "spurs", name: "San Antonio Spurs", short: "Spurs", league: "nba", kind: "pro", city: "San Antonio", keywords: ["san antonio spurs"] },
  { slug: "rockets", name: "Houston Rockets", short: "Rockets", league: "nba", kind: "pro", city: "Houston", keywords: ["houston rockets"] },
  { slug: "mavericks", name: "Dallas Mavericks", short: "Mavericks", league: "nba", kind: "pro", city: "Dallas", keywords: ["dallas mavericks"] },
  { slug: "stars", name: "Dallas Stars", short: "Stars", league: "nhl", kind: "pro", city: "Dallas", keywords: ["dallas stars", "stars hockey", "nhl stars"] },
  { slug: "austin-fc", name: "Austin FC", short: "Austin FC", league: "mls", kind: "pro", city: "Austin", keywords: ["austin fc"] },
  { slug: "fc-dallas", name: "FC Dallas", short: "FC Dallas", league: "mls", kind: "pro", city: "Frisco", keywords: ["fc dallas"] },
  { slug: "houston-dynamo", name: "Houston Dynamo FC", short: "Dynamo", league: "mls", kind: "pro", city: "Houston", keywords: ["houston dynamo", "dynamo fc"] },
  { slug: "houston-dash", name: "Houston Dash", short: "Dash", league: "nwsl", kind: "pro", city: "Houston", keywords: ["houston dash", "nwsl dash"] },
  { slug: "dallas-wings", name: "Dallas Wings", short: "Wings", league: "wnba", kind: "pro", city: "Arlington", keywords: ["dallas wings", "wnba wings"] },
  { slug: "longhorns", name: "Texas Longhorns", short: "Longhorns", league: "cfb", kind: "college", city: "Austin", conference: "SEC", keywords: ["texas longhorns", "longhorns", "hook 'em", "ut athletics", "ut football"] },
  { slug: "texas-am", name: "Texas A&M Aggies", short: "Texas A&M", league: "cfb", kind: "college", city: "College Station", conference: "SEC", keywords: ["texas a&m", "aggies", "12th man", "12thman.com"] },
  { slug: "tcu", name: "TCU Horned Frogs", short: "TCU", league: "cfb", kind: "college", city: "Fort Worth", conference: "Big 12", keywords: ["tcu horned frogs", "tcu football", "horned frogs"] },
  { slug: "baylor", name: "Baylor Bears", short: "Baylor", league: "cfb", kind: "college", city: "Waco", conference: "Big 12", keywords: ["baylor bears", "baylor football"] },
  { slug: "texas-tech", name: "Texas Tech Red Raiders", short: "Texas Tech", league: "cfb", kind: "college", city: "Lubbock", conference: "Big 12", keywords: ["texas tech", "red raiders", "wreck 'em"] },
  { slug: "houston-cougars", name: "Houston Cougars", short: "Houston", league: "cfb", kind: "college", city: "Houston", conference: "Big 12", keywords: ["houston cougars", "uh cougars", "houston football"] },
  { slug: "smu", name: "SMU Mustangs", short: "SMU", league: "cfb", kind: "college", city: "Dallas", conference: "ACC", keywords: ["smu mustangs", "smu football", "mustangs football"] },
  { slug: "utsa", name: "UTSA Roadrunners", short: "UTSA", league: "cfb", kind: "college", city: "San Antonio", conference: "AAC", keywords: ["utsa roadrunners", "utsa football", "roadrunners football"] },
  { slug: "north-texas", name: "North Texas Mean Green", short: "North Texas", league: "cfb", kind: "college", city: "Denton", conference: "AAC", keywords: ["north texas mean green", "unt football", "mean green football"] },
  { slug: "texas-state", name: "Texas State Bobcats", short: "Texas State", league: "cfb", kind: "college", city: "San Marcos", conference: "Sun Belt", keywords: ["texas state bobcats", "texas state football", "bobcats football"] },
] as const;

export const TEAM_BY_SLUG: Record<string, TeamMeta> = Object.fromEntries(TEAMS.map((team) => [team.slug, team]));
export const TEAM_SLUG_ALIASES: Readonly<Record<string, string>> = { aggies: "texas-am", mavs: "mavericks", dynamo: "houston-dynamo", wings: "dallas-wings", unt: "north-texas" };
export function isTeamSlug(value: string): boolean { return Object.prototype.hasOwnProperty.call(TEAM_BY_SLUG, value); }
export function canonicalTeamSlug(value: string): string | null { const normalized = value.toLowerCase(); return isTeamSlug(normalized) ? normalized : TEAM_SLUG_ALIASES[normalized] ?? null; }
export function teamsForLeague(league: LeagueSlug): TeamMeta[] { return TEAMS.filter((team) => team.league === league); }
export function proTeams(): TeamMeta[] { return TEAMS.filter((team) => team.kind === "pro"); }
export function collegeTeams(): TeamMeta[] { return TEAMS.filter((team) => team.kind === "college"); }

export const LEAGUE_META: Record<LeagueSlug, { name: string; long: string }> = {
  nfl: { name: "NFL", long: "NFL — Texans & Cowboys" }, mlb: { name: "MLB", long: "MLB — Astros & Rangers" }, nba: { name: "NBA", long: "NBA — Spurs, Rockets & Mavericks" }, nhl: { name: "NHL", long: "NHL — Dallas Stars" }, mls: { name: "MLS", long: "MLS — Austin FC, FC Dallas & Houston Dynamo" }, nwsl: { name: "NWSL", long: "NWSL — Houston Dash" }, wnba: { name: "WNBA", long: "WNBA — Dallas Wings" }, cfb: { name: "College Sports", long: "Texas College Sports" },
};

function containsKeyword(haystack: string, keyword: string): boolean {
  const needle = keyword.toLowerCase().trim();
  if (!needle) return false;
  if (needle.length <= 4 && /^[a-z0-9]+$/i.test(needle)) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(haystack);
  }
  return haystack.includes(needle);
}

const FOOTBALL_CONTEXT = /\b(football|nfl|touchdown|quarterback|kickoff|training camp|preseason|regular season|playoffs?)\b/i;
const BASEBALL_CONTEXT = /\b(baseball|mlb|pitcher|homer|home run|bullpen|al west|american league|world series|inning|degrom)\b/i;
const BASKETBALL_CONTEXT = /\b(basketball|nba|wnba|hoops|three-pointer|tipoff|playoffs?|draft|rookie|arena|court|season)\b/i;
const HOCKEY_CONTEXT = /\b(hockey|nhl|puck|stanley cup)\b/i;

export function detectTeams(text: string): string[] {
  const haystack = ` ${text.toLowerCase()} `;
  const slugs = new Set(TEAMS.filter((team) => team.keywords.some((keyword) => containsKeyword(haystack, keyword))).map((team) => team.slug));
  if (/\btexans\b/i.test(text) && FOOTBALL_CONTEXT.test(text)) slugs.add("texans");
  if (/\brangers\b/i.test(text) && BASEBALL_CONTEXT.test(text)) slugs.add("rangers");
  if (/\bspurs\b/i.test(text) && BASKETBALL_CONTEXT.test(text)) slugs.add("spurs");
  if (/\brockets\b/i.test(text) && BASKETBALL_CONTEXT.test(text)) slugs.add("rockets");
  if (/\b(?:mavericks|mavs)\b/i.test(text) && BASKETBALL_CONTEXT.test(text)) slugs.add("mavericks");
  if (/\bstars\b/i.test(text) && HOCKEY_CONTEXT.test(text)) slugs.add("stars");
  return [...slugs];
}
