import { TEAM_BY_SLUG, detectTeams, type LeagueSlug } from "./texas-teams";

export const SPORTS_TOPIC_SLUGS = [
  "latest",
  "trending",
  "football",
  "baseball",
  "basketball",
  "hockey",
  "soccer",
  "college",
  "recruiting",
  "nil",
  "business-policy",
  "stadiums",
  "motorsports",
  "postseason",
  "transactions",
  "injuries",
  "rivalries",
] as const;

export type SportsTopicSlug = (typeof SPORTS_TOPIC_SLUGS)[number];

export type SportsClassification = {
  teams: string[];
  leagues: LeagueSlug[];
  topics: SportsTopicSlug[];
  cities: string[];
  texasRelevanceScore: number;
  isSports: boolean;
};

const TOPIC_KEYWORDS: Record<Exclude<SportsTopicSlug, "latest" | "trending">, string[]> = {
  football: ["football", "touchdown", "quarterback", "nfl", "cfb", "bowl game", "playoff"],
  baseball: ["baseball", "mlb", "pitcher", "home run", "bullpen", "world series"],
  basketball: ["basketball", "nba", "wnba", "hoops", "three-pointer", "playoffs"],
  hockey: ["hockey", "nhl", "puck", "stanley cup"],
  soccer: ["soccer", "mls", "nwsl", "goalkeeper", "world cup"],
  college: ["college football", "college basketball", "ncaa", "conference", "big 12", "sec", "acc", "aac", "sun belt"],
  recruiting: ["recruiting", "recruit", "commitment", "signing day", "prospect"],
  nil: ["name image likeness", "nil", "revenue sharing", "collective"],
  "business-policy": ["sports betting", "sportsbook", "stadium financing", "public funding", "tax incentive", "economic impact", "athletic spending", "legislation", "lawmakers", "policy"],
  stadiums: ["stadium", "arena", "ballpark", "venue", "public financing", "bond election"],
  motorsports: ["nascar", "formula 1", "f1", "indycar", "motorsport", "circuit of the americas", "cota", "texas motor speedway", "drag racing"],
  postseason: ["postseason", "playoffs", "bowl", "championship", "world series", "stanley cup", "finals"],
  transactions: ["trade", "traded", "signing", "signed", "free agent", "waiver", "roster move", "transfer portal"],
  injuries: ["injury", "injured", "injury report", "disabled list", "injured reserve"],
  rivalries: ["rivalry", "rival", "lone star series", "red river", "texas triangle"],
};

const LEAGUE_KEYWORDS: Record<LeagueSlug, string[]> = {
  nfl: ["nfl", "national football league"],
  mlb: ["mlb", "major league baseball"],
  nba: ["nba", "national basketball association"],
  nhl: ["nhl", "national hockey league"],
  mls: ["mls", "major league soccer"],
  nwsl: ["nwsl", "national women's soccer league"],
  wnba: ["wnba", "women's national basketball association"],
  cfb: ["college football", "ncaa football", "big 12", "sec football", "acc football", "aac football", "sun belt football"],
};

const LEAGUE_TOPIC: Record<LeagueSlug, SportsTopicSlug> = {
  nfl: "football",
  mlb: "baseball",
  nba: "basketball",
  nhl: "hockey",
  mls: "soccer",
  nwsl: "soccer",
  wnba: "basketball",
  cfb: "football",
};

const TEXAS_CITIES = ["houston", "dallas", "arlington", "austin", "san antonio", "fort worth", "frisco", "college station", "waco", "lubbock", "denton", "san marcos"];

function includesPhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}

export function classifySportsText(text: string): SportsClassification {
  const haystack = text.toLowerCase();
  const teams = detectTeams(text);
  const leagueSet = new Set<LeagueSlug>();
  for (const slug of teams) leagueSet.add(TEAM_BY_SLUG[slug].league);
  for (const [league, keywords] of Object.entries(LEAGUE_KEYWORDS) as [LeagueSlug, string[]][]) {
    if (keywords.some((keyword) => includesPhrase(haystack, keyword))) leagueSet.add(league);
  }

  const topics = (Object.entries(TOPIC_KEYWORDS) as [Exclude<SportsTopicSlug, "latest" | "trending">, string[]][])
    .filter(([, keywords]) => keywords.some((keyword) => includesPhrase(haystack, keyword)))
    .map(([topic]) => topic);

  for (const league of leagueSet) topics.push(LEAGUE_TOPIC[league]);
  if (teams.some((slug) => TEAM_BY_SLUG[slug].kind === "college")) topics.push("college");

  const cities = TEXAS_CITIES.filter((city) => includesPhrase(haystack, city));
  let score = 0;
  if (teams.length) score += 65;
  if (leagueSet.size) score += 20;
  if (cities.length) score += 10;
  if (/\btexas\b/i.test(text)) score += 10;
  if (topics.includes("business-policy") || topics.includes("nil")) score += 5;

  return {
    teams,
    leagues: [...leagueSet],
    topics: [...new Set(topics)],
    cities,
    texasRelevanceScore: Math.min(score, 100),
    isSports: teams.length > 0 || leagueSet.size > 0 || topics.some((topic) => topic !== "business-policy"),
  };
}

export function sportsKindForLeague(league: LeagueSlug): string {
  return `sports-${league}`;
}

export function sportsKindForText(text: string): string | null {
  const classification = classifySportsText(text);
  if (!classification.isSports) return null;
  if (classification.topics.includes("motorsports")) return "sports-motorsports";
  if (classification.topics.includes("business-policy") || classification.topics.includes("nil")) return "sports-policy";
  if (classification.leagues.length === 1) return sportsKindForLeague(classification.leagues[0]);
  return "sports-general";
}

export function sportsTopicsForText(text: string): SportsTopicSlug[] {
  return classifySportsText(text).topics;
}
