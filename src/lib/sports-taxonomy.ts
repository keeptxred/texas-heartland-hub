import { TEAM_BY_SLUG, detectTeams, type LeagueSlug } from "./texas-teams";

export const SPORTS_TOPIC_SLUGS = ["latest","trending","football","baseball","basketball","hockey","soccer","college","recruiting","nil","business-policy","stadiums","motorsports","postseason","transactions","injuries","rivalries"] as const;
export type SportsTopicSlug = (typeof SPORTS_TOPIC_SLUGS)[number];
export type SportsClassification = { teams: string[]; leagues: LeagueSlug[]; topics: SportsTopicSlug[]; cities: string[]; texasRelevanceScore: number; isSports: boolean };

const TOPIC_KEYWORDS: Record<Exclude<SportsTopicSlug, "latest" | "trending">, string[]> = {
  football: ["football", "touchdown", "quarterback", "nfl", "cfb", "bowl game", "kickoff", "playoff"],
  baseball: ["baseball", "mlb", "pitcher", "home run", "homer", "bullpen", "world series"],
  basketball: ["basketball", "nba", "wnba", "hoops", "three-pointer", "tipoff", "playoffs"],
  hockey: ["hockey", "nhl", "puck", "stanley cup"],
  soccer: ["soccer", "mls", "nwsl", "goalkeeper", "world cup"],
  college: ["college football", "college basketball", "college baseball", "ncaa", "big 12", "southeastern conference", "atlantic coast conference", "american athletic conference", "sun belt conference"],
  recruiting: ["recruiting", "recruit", "commitment", "signing day", "prospect"],
  nil: ["name image likeness", "name, image and likeness", "nil law", "nil rules", "nil policy", "nil deal", "nil collective", "nil revenue", "nil compensation", "revenue sharing"],
  "business-policy": ["sports betting", "sportsbook", "stadium financing", "public funding", "tax incentive", "economic impact", "athletic spending", "legislation", "lawmakers", "policy"],
  stadiums: ["stadium", "arena", "ballpark", "sports venue", "public financing", "bond election"],
  motorsports: ["nascar", "formula 1", "f1", "indycar", "motorsport", "circuit of the americas", "cota", "texas motor speedway", "drag racing"],
  postseason: ["postseason", "playoffs", "bowl game", "championship game", "world series", "stanley cup", "nba finals", "wnba finals"],
  transactions: ["trade", "traded", "free agent", "waiver", "roster move", "transfer portal"],
  injuries: ["sports injury", "injury report", "injured reserve", "disabled list", "out for season"],
  rivalries: ["rivalry", "rival", "lone star series", "red river rivalry", "texas triangle"],
};

const LEAGUE_KEYWORDS: Record<LeagueSlug, string[]> = {
  nfl: ["nfl", "national football league"], mlb: ["mlb", "major league baseball"], nba: ["nba", "national basketball association"], nhl: ["nhl", "national hockey league"], mls: ["mls", "major league soccer"], nwsl: ["nwsl", "national women's soccer league"], wnba: ["wnba", "women's national basketball association"], cfb: ["college football", "ncaa football", "big 12 football", "sec football", "acc football", "aac football", "sun belt football"],
};
const LEAGUE_TOPIC: Record<LeagueSlug, SportsTopicSlug> = { nfl: "football", mlb: "baseball", nba: "basketball", nhl: "hockey", mls: "soccer", nwsl: "soccer", wnba: "basketball", cfb: "football" };
const TEXAS_CITIES = ["houston", "dallas", "arlington", "austin", "san antonio", "fort worth", "frisco", "college station", "waco", "lubbock", "denton", "san marcos"];
const COLLEGE_SPORTS_CONTEXT = /\b(football|basketball|baseball|softball|volleyball|soccer|athletics?|athletic|sports?|game|matchup|season|coach|player|recruit(?:ing)?|commit(?:ment)?|nil|name image likeness|revenue sharing|stadium|arena|conference|ncaa|bowl|playoff|championship|roster|score|touchdown|quarterback|transfer portal|ranked|ranking|kickoff|tipoff|tournament|practice|schedule)\b/i;
const TEXAS_AM_BRANCH_CAMPUS = /\b(?:texas a&m[-–— ](?:texarkana|corpus christi|san antonio|commerce|kingsville|international)|west texas a&m)\b/i;
const STRONG_SPORTS_POLICY_CONTEXT = /\b(sports betting|sportsbook|stadium financing|athletic spending|college athlete compensation)\b/i;
const GENERIC_SPORTS_CONTEXT = /\b(sports?|athletics)\b/i;
const INCIDENTAL_MEDIA_TICKET_CONTEXT = /\b(anchor|journalis(?:m|t|ts)|reporting|news station|station)\b[\s\S]{0,180}\b(?:complimentary|free)?\s*tickets?\b|\b(?:complimentary|free)?\s*tickets?\b[\s\S]{0,180}\b(anchor|journalis(?:m|t|ts)|reporting|news station|station)\b/i;
const RANGERS_LAW_ENFORCEMENT_CONTEXT = /\b(law enforcement|police|sheriff|constable|dps|department of public safety|state police|trooper|criminal investigation|investigator|public safety|game warden|peace officer)\b/i;
const RANGERS_BASEBALL_CONTEXT = /\b(baseball|mlb|major league baseball|pitcher|home run|homer|bullpen|inning|innings|al west|american league|ballpark|world series|lineup|batting|de[gG]rom)\b/i;
const SAFE_STANDALONE_TOPICS = new Set<SportsTopicSlug>(["football", "baseball", "basketball", "hockey", "soccer", "college", "nil", "motorsports", "postseason"]);

function includesPhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}
function filterTeamMentions(text: string, slugs: string[]): string[] {
  return slugs.filter((slug) => {
    const team = TEAM_BY_SLUG[slug];
    if (!team || team.kind !== "college") {
      if (slug === "rangers" && RANGERS_LAW_ENFORCEMENT_CONTEXT.test(text) && !RANGERS_BASEBALL_CONTEXT.test(text)) return false;
      return true;
    }
    if (slug === "texas-am" && TEXAS_AM_BRANCH_CAMPUS.test(text)) return false;
    return COLLEGE_SPORTS_CONTEXT.test(text);
  });
}

export function classifySportsText(text: string): SportsClassification {
  const haystack = text.toLowerCase();
  const teams = filterTeamMentions(text, detectTeams(text));
  const leagueSet = new Set<LeagueSlug>();
  for (const slug of teams) leagueSet.add(TEAM_BY_SLUG[slug].league);
  for (const [league, keywords] of Object.entries(LEAGUE_KEYWORDS) as [LeagueSlug, string[]][]) if (keywords.some((keyword) => includesPhrase(haystack, keyword))) leagueSet.add(league);
  const topics: SportsTopicSlug[] = (Object.entries(TOPIC_KEYWORDS) as [Exclude<SportsTopicSlug, "latest" | "trending">, string[]][]).filter(([, keywords]) => keywords.some((keyword) => includesPhrase(haystack, keyword))).map(([topic]) => topic);
  for (const league of leagueSet) topics.push(LEAGUE_TOPIC[league]);
  if (teams.some((slug) => TEAM_BY_SLUG[slug].kind === "college")) topics.push("college");
  const uniqueTopics: SportsTopicSlug[] = [...new Set(topics)];
  const cities = TEXAS_CITIES.filter((city) => includesPhrase(haystack, city));
  let score = 0;
  if (teams.length) score += 65;
  if (leagueSet.size) score += 20;
  if (cities.length) score += 10;
  if (/\btexas\b/i.test(text)) score += 10;
  if (uniqueTopics.includes("business-policy") || uniqueTopics.includes("nil")) score += 5;
  const incidentalMediaTickets = INCIDENTAL_MEDIA_TICKET_CONTEXT.test(text) && teams.length === 0 && leagueSet.size === 0;
  const isSportsSignal = teams.length > 0 || leagueSet.size > 0 || uniqueTopics.some((topic) => SAFE_STANDALONE_TOPICS.has(topic)) || STRONG_SPORTS_POLICY_CONTEXT.test(text) || GENERIC_SPORTS_CONTEXT.test(text);
  return { teams, leagues: [...leagueSet], topics: uniqueTopics, cities, texasRelevanceScore: Math.min(score, 100), isSports: isSportsSignal && !incidentalMediaTickets };
}

export function sportsKindForLeague(league: LeagueSlug): string { return `sports-${league}`; }
export function sportsKindForText(text: string): string | null {
  const classification = classifySportsText(text);
  if (!classification.isSports) return null;
  if (classification.topics.includes("motorsports")) return "sports-motorsports";
  if (classification.topics.includes("business-policy") || classification.topics.includes("nil")) return "sports-policy";
  if (classification.leagues.length === 1) return sportsKindForLeague(classification.leagues[0]);
  return "sports-general";
}
export function sportsTopicsForText(text: string): SportsTopicSlug[] { return classifySportsText(text).topics; }
