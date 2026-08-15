import type { LeagueSlug } from "./texas-teams";

export type SportsSourceMode = "rss" | "html-links";

export type SportsSource = {
  name: string;
  url: string;
  mode: SportsSourceMode;
  include?: string;
  team?: string;
  league?: LeagueSlug;
  topic?: "college" | "motorsports" | "policy" | "statewide";
  priority: 1 | 2 | 3;
  reputation: number;
};

/**
 * Primary-source-first registry for KTR Sports discovery. The standalone
 * ingest hook uses this list, while the existing general ingest pipeline can
 * continue to run unchanged. HTML entries intentionally provide an include
 * regex rather than pretending a non-existent RSS feed exists.
 */
export const SPORTS_SOURCES: readonly SportsSource[] = [
  { name: "Dallas Cowboys", url: "https://www.dallascowboys.com/rss/news", mode: "rss", team: "cowboys", league: "nfl", priority: 1, reputation: 95 },
  { name: "Houston Texans", url: "https://www.houstontexans.com/rss/news", mode: "rss", team: "texans", league: "nfl", priority: 1, reputation: 95 },
  { name: "Houston Astros", url: "https://www.mlb.com/astros/feeds/news/rss.xml", mode: "rss", team: "astros", league: "mlb", priority: 1, reputation: 95 },
  { name: "Texas Rangers", url: "https://www.mlb.com/rangers/feeds/news/rss.xml", mode: "rss", team: "rangers", league: "mlb", priority: 1, reputation: 95 },

  // NBA team news pages are JS-rendered and consistently return zero usable
  // anchors to the server-side HTML fetcher. Keep them out of the standalone
  // source loop until a stable first-party machine-readable endpoint exists;
  // the general statewide discovery pipeline still captures NBA coverage.
  { name: "Dallas Stars", url: "https://www.nhl.com/stars/news/", mode: "html-links", include: "^/stars/news/", team: "stars", league: "nhl", priority: 1, reputation: 94 },
  { name: "Austin FC", url: "https://www.austinfc.com/news/", mode: "html-links", include: "^/news/", team: "austin-fc", league: "mls", priority: 1, reputation: 94 },
  { name: "FC Dallas", url: "https://www.fcdallas.com/news/", mode: "html-links", include: "^/news/", team: "fc-dallas", league: "mls", priority: 1, reputation: 94 },
  { name: "Houston Dynamo FC", url: "https://www.houstondynamofc.com/news/", mode: "html-links", include: "^/news/", team: "houston-dynamo", league: "mls", priority: 1, reputation: 94 },
  { name: "Houston Dash", url: "https://www.houstondynamofc.com/houstondash/news/", mode: "html-links", include: "^/houstondash/news/", team: "houston-dash", league: "nwsl", priority: 1, reputation: 94 },
  { name: "Dallas Wings", url: "https://wings.wnba.com/news/", mode: "html-links", include: "^/news/", team: "dallas-wings", league: "wnba", priority: 1, reputation: 94 },

  // Sidearm schools expose either a first-party RSS feed or a stable story
  // archive. Prefer those over /news/ landing pages, which can return 404s or
  // redirect loops to server-side fetchers even though individual stories work.
  { name: "Texas Longhorns Athletics", url: "https://texaslonghorns.com/rss?path=general", mode: "rss", team: "longhorns", league: "cfb", topic: "college", priority: 1, reputation: 94 },
  { name: "Texas A&M Athletics", url: "https://12thman.com/news/", mode: "html-links", include: "^/news/20\\d{2}/", team: "texas-am", league: "cfb", topic: "college", priority: 1, reputation: 94 },
  { name: "TCU Athletics", url: "https://gofrogs.com/archives", mode: "html-links", include: "^/news/20\\d{2}/", team: "tcu", league: "cfb", topic: "college", priority: 1, reputation: 92 },
  { name: "Baylor Athletics", url: "https://baylorbears.com/archives", mode: "html-links", include: "^/news/20\\d{2}/", team: "baylor", league: "cfb", topic: "college", priority: 1, reputation: 92 },
  { name: "Texas Tech Athletics", url: "https://texastech.com/rss?path=general", mode: "rss", team: "texas-tech", league: "cfb", topic: "college", priority: 1, reputation: 92 },
  { name: "Houston Cougars Athletics", url: "https://uhcougars.com/archives", mode: "html-links", include: "^/news/20\\d{2}/", team: "houston-cougars", league: "cfb", topic: "college", priority: 1, reputation: 92 },

  // SMU and Texas State currently redirect-loop under the production
  // server-side fetcher, including their archive/RSS URLs, even though the
  // pages can load interactively. Keep them out of this standalone loop until
  // either school exposes a stable machine-readable endpoint. Their stories
  // still arrive through the broader statewide discovery pipeline.
  { name: "UTSA Athletics", url: "https://goutsa.com/news/", mode: "html-links", include: "^/news/20\\d{2}/", team: "utsa", league: "cfb", topic: "college", priority: 1, reputation: 92 },
  { name: "North Texas Athletics", url: "https://meangreensports.com/archives", mode: "html-links", include: "^/news/20\\d{2}/", team: "north-texas", league: "cfb", topic: "college", priority: 2, reputation: 90 },

  { name: "University Interscholastic League", url: "https://feeds.feedburner.com/uil-press-releases", mode: "rss", topic: "statewide", priority: 1, reputation: 96 },
  { name: "Circuit of the Americas", url: "https://circuitoftheamericas.com/blog/", mode: "html-links", include: "^/blog/", topic: "motorsports", priority: 1, reputation: 92 },
  { name: "Texas Motor Speedway", url: "https://www.texasmotorspeedway.com/media/news/", mode: "html-links", include: "^/media/news/", topic: "motorsports", priority: 1, reputation: 92 },
] as const;

export function sportsSourcesForTeam(team: string): SportsSource[] {
  return SPORTS_SOURCES.filter((source) => source.team === team);
}

export function sportsSourcesForLeague(league: LeagueSlug): SportsSource[] {
  return SPORTS_SOURCES.filter((source) => source.league === league);
}
