// Curated Texas source library. Presets are inserted into the existing
// `content_sources` table on demand — no schema changes, no ingestion changes.
// `enabled` state is derived from row presence (source_name match).

export type SourcePreset = {
  group: SourceGroup;
  platform: string;
  source_name: string;
  source_url: string;
  rss_url?: string;
  category: string;
  priority: 1 | 2 | 3;
  source_reputation_score: number; // 0-100
  source_quality_reason: string;
  /**
   * Optional viral discovery metadata. These fields extend existing preset
   * objects only — no schema changes. `source_type` classifies the signal
   * shape so the admin UI and future ViralRadar filters can prioritize
   * video/community sources; `viral_weight` (0-100) is a soft hint the
   * scorer may consult when a matching row exists. Sources without RSS
   * are marked `discovery_mode: "manual"` — no fake feeds.
   */
  source_type?: "news" | "official" | "social" | "video" | "community" | "politics" | "culture";
  viral_weight?: number;
  discovery_mode?: "rss" | "manual";
};

export type SourceGroup =
  | "Government"
  | "Local News"
  | "Public Safety"
  | "Sports"
  | "Weather"
  | "Business"
  | "Viral Discovery"
  | "Viral Watch";

export const SOURCE_GROUPS: SourceGroup[] = [
  "Government",
  "Local News",
  "Public Safety",
  "Sports",
  "Weather",
  "Business",
  "Viral Discovery",
  "Viral Watch",
];

export const SOURCE_PRESETS: SourcePreset[] = [
  // -------------------- GOVERNMENT --------------------
  { group: "Government", platform: "Website", source_name: "Office of the Texas Governor", source_url: "https://gov.texas.gov/news", rss_url: "https://gov.texas.gov/news/rss", category: "Government", priority: 1, source_reputation_score: 95, source_quality_reason: "Official primary source" },
  { group: "Government", platform: "Website", source_name: "Texas Attorney General", source_url: "https://www.texasattorneygeneral.gov/news/releases", category: "Government", priority: 1, source_reputation_score: 95, source_quality_reason: "Official primary source" },
  { group: "Government", platform: "Website", source_name: "Texas Department of Public Safety", source_url: "https://www.dps.texas.gov/news", category: "Public Safety", priority: 1, source_reputation_score: 92, source_quality_reason: "Official primary source" },
  { group: "Government", platform: "Website", source_name: "Texas Legislature Online", source_url: "https://capitol.texas.gov", category: "Legislature", priority: 1, source_reputation_score: 95, source_quality_reason: "Official bill tracking" },
  { group: "Government", platform: "Website", source_name: "Texas Parks and Wildlife", source_url: "https://tpwd.texas.gov/newsmedia/releases/", category: "Parks", priority: 2, source_reputation_score: 88, source_quality_reason: "Official state agency" },
  { group: "Government", platform: "Website", source_name: "TxDOT", source_url: "https://www.txdot.gov/about/newsroom.html", category: "Transportation", priority: 2, source_reputation_score: 88, source_quality_reason: "Official state agency" },
  { group: "Government", platform: "Website", source_name: "Texas Education Agency", source_url: "https://tea.texas.gov/about-tea/news-and-multimedia/news-releases", category: "Education", priority: 2, source_reputation_score: 90, source_quality_reason: "Official state agency" },
  { group: "Government", platform: "Website", source_name: "Texas Secretary of State - Elections", source_url: "https://www.sos.state.tx.us/elections/", rss_url: "https://www.sos.state.tx.us/rss/press.xml", category: "Elections", priority: 1, source_reputation_score: 94, source_quality_reason: "Official elections authority" },
  { group: "Government", platform: "Website", source_name: "Texas Ethics Commission", source_url: "https://www.ethics.state.tx.us", category: "Elections", priority: 2, source_reputation_score: 88, source_quality_reason: "Campaign finance disclosures" },
  { group: "Government", platform: "Website", source_name: "City of Houston", source_url: "https://www.houstontx.gov/news/", category: "City Government", priority: 2, source_reputation_score: 82, source_quality_reason: "Municipal press releases" },
  { group: "Government", platform: "Website", source_name: "City of Dallas", source_url: "https://dallascityhall.com/Pages/press-releases.aspx", category: "City Government", priority: 2, source_reputation_score: 82, source_quality_reason: "Municipal press releases" },
  { group: "Government", platform: "Website", source_name: "City of Austin", source_url: "https://www.austintexas.gov/news", category: "City Government", priority: 2, source_reputation_score: 82, source_quality_reason: "Municipal press releases" },
  { group: "Government", platform: "Website", source_name: "City of San Antonio", source_url: "https://www.sa.gov/Directory/News", category: "City Government", priority: 2, source_reputation_score: 82, source_quality_reason: "Municipal press releases" },
  { group: "Government", platform: "Website", source_name: "City of Fort Worth", source_url: "https://www.fortworthtexas.gov/news", category: "City Government", priority: 2, source_reputation_score: 82, source_quality_reason: "Municipal press releases" },

  // -------------------- LOCAL NEWS --------------------
  { group: "Local News", platform: "Website", source_name: "Houston Chronicle", source_url: "https://www.houstonchronicle.com", rss_url: "https://www.houstonchronicle.com/rss/", category: "Houston", priority: 1, source_reputation_score: 88, source_quality_reason: "Major metro daily" },
  { group: "Local News", platform: "Website", source_name: "Houston Public Media", source_url: "https://www.houstonpublicmedia.org/news/", rss_url: "https://www.houstonpublicmedia.org/feed/", category: "Houston", priority: 2, source_reputation_score: 82, source_quality_reason: "NPR affiliate" },
  { group: "Local News", platform: "Website", source_name: "Dallas Morning News", source_url: "https://www.dallasnews.com", rss_url: "https://www.dallasnews.com/arc/outboundfeeds/rss/?outputType=xml", category: "Dallas", priority: 1, source_reputation_score: 88, source_quality_reason: "Major metro daily" },
  { group: "Local News", platform: "Website", source_name: "Fort Worth Star-Telegram", source_url: "https://www.star-telegram.com", category: "Dallas", priority: 2, source_reputation_score: 82, source_quality_reason: "Major metro daily" },
  { group: "Local News", platform: "Website", source_name: "Austin American-Statesman", source_url: "https://www.statesman.com", category: "Austin", priority: 1, source_reputation_score: 84, source_quality_reason: "Major metro daily" },
  { group: "Local News", platform: "Website", source_name: "KUT Austin", source_url: "https://www.kut.org", rss_url: "https://www.kut.org/news.rss", category: "Austin", priority: 2, source_reputation_score: 82, source_quality_reason: "NPR affiliate" },
  { group: "Local News", platform: "Website", source_name: "San Antonio Express-News", source_url: "https://www.expressnews.com", category: "San Antonio", priority: 1, source_reputation_score: 84, source_quality_reason: "Major metro daily" },
  { group: "Local News", platform: "Website", source_name: "El Paso Times", source_url: "https://www.elpasotimes.com", category: "El Paso", priority: 2, source_reputation_score: 80, source_quality_reason: "Regional daily" },
  { group: "Local News", platform: "Website", source_name: "The Monitor (RGV)", source_url: "https://myrgv.com", category: "Rio Grande Valley", priority: 2, source_reputation_score: 78, source_quality_reason: "RGV daily of record" },
  { group: "Local News", platform: "Website", source_name: "Texas Tribune", source_url: "https://www.texastribune.org", rss_url: "https://www.texastribune.org/feeds/main/", category: "Statewide", priority: 1, source_reputation_score: 90, source_quality_reason: "Nonprofit statewide investigative" },

  // -------------------- PUBLIC SAFETY --------------------
  { group: "Public Safety", platform: "Website", source_name: "Houston Police Department", source_url: "https://www.houstontx.gov/police/nr/", category: "Police", priority: 2, source_reputation_score: 85, source_quality_reason: "Official police PIO" },
  { group: "Public Safety", platform: "Website", source_name: "Dallas Police Department", source_url: "https://dallaspolice.net", category: "Police", priority: 2, source_reputation_score: 85, source_quality_reason: "Official police PIO" },
  { group: "Public Safety", platform: "Website", source_name: "Austin Police Department", source_url: "https://www.austintexas.gov/department/police", category: "Police", priority: 2, source_reputation_score: 85, source_quality_reason: "Official police PIO" },
  { group: "Public Safety", platform: "Website", source_name: "Harris County Sheriff", source_url: "https://www.harriscountyso.org", category: "Sheriff", priority: 2, source_reputation_score: 85, source_quality_reason: "Official sheriff PIO" },
  { group: "Public Safety", platform: "Website", source_name: "Dallas County Sheriff", source_url: "https://www.dallascounty.org/departments/sheriff/", category: "Sheriff", priority: 2, source_reputation_score: 85, source_quality_reason: "Official sheriff PIO" },
  { group: "Public Safety", platform: "Website", source_name: "Houston Fire Department", source_url: "https://www.houstontx.gov/fire/", category: "Fire", priority: 3, source_reputation_score: 82, source_quality_reason: "Official fire dept" },
  { group: "Public Safety", platform: "Website", source_name: "Texas Division of Emergency Management", source_url: "https://www.tdem.texas.gov", category: "Emergency Management", priority: 1, source_reputation_score: 92, source_quality_reason: "State disaster response" },

  // -------------------- SPORTS --------------------
  { group: "Sports", platform: "Website", source_name: "Dallas Cowboys", source_url: "https://www.dallascowboys.com", rss_url: "https://www.dallascowboys.com/rss/news", category: "NFL", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Houston Texans", source_url: "https://www.houstontexans.com", rss_url: "https://www.houstontexans.com/rss/news", category: "NFL", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Houston Astros", source_url: "https://www.mlb.com/astros", category: "MLB", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Texas Rangers", source_url: "https://www.mlb.com/rangers", category: "MLB", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Dallas Mavericks", source_url: "https://www.mavs.com", category: "NBA", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Houston Rockets", source_url: "https://www.nba.com/rockets", category: "NBA", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "San Antonio Spurs", source_url: "https://www.nba.com/spurs", category: "NBA", priority: 1, source_reputation_score: 90, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Dallas Stars", source_url: "https://www.nhl.com/stars", category: "NHL", priority: 2, source_reputation_score: 88, source_quality_reason: "Official team site" },
  { group: "Sports", platform: "Website", source_name: "Texas Longhorns", source_url: "https://texassports.com", category: "College", priority: 1, source_reputation_score: 88, source_quality_reason: "Official athletics" },
  { group: "Sports", platform: "Website", source_name: "Texas A&M Aggies", source_url: "https://12thman.com", category: "College", priority: 1, source_reputation_score: 88, source_quality_reason: "Official athletics" },
  { group: "Sports", platform: "Website", source_name: "TCU Horned Frogs", source_url: "https://gofrogs.com", category: "College", priority: 2, source_reputation_score: 86, source_quality_reason: "Official athletics" },
  { group: "Sports", platform: "Website", source_name: "Baylor Bears", source_url: "https://baylorbears.com", category: "College", priority: 2, source_reputation_score: 86, source_quality_reason: "Official athletics" },
  { group: "Sports", platform: "Website", source_name: "Texas Tech Red Raiders", source_url: "https://texastech.com", category: "College", priority: 2, source_reputation_score: 86, source_quality_reason: "Official athletics" },

  // -------------------- WEATHER --------------------
  { group: "Weather", platform: "Website", source_name: "National Weather Service - Fort Worth", source_url: "https://www.weather.gov/fwd/", category: "Weather", priority: 1, source_reputation_score: 95, source_quality_reason: "Official NWS forecast office" },
  { group: "Weather", platform: "Website", source_name: "National Weather Service - Houston", source_url: "https://www.weather.gov/hgx/", category: "Weather", priority: 1, source_reputation_score: 95, source_quality_reason: "Official NWS forecast office" },
  { group: "Weather", platform: "Website", source_name: "National Weather Service - Austin/San Antonio", source_url: "https://www.weather.gov/ewx/", category: "Weather", priority: 1, source_reputation_score: 95, source_quality_reason: "Official NWS forecast office" },
  { group: "Weather", platform: "Website", source_name: "National Hurricane Center", source_url: "https://www.nhc.noaa.gov", rss_url: "https://www.nhc.noaa.gov/index-at.xml", category: "Weather", priority: 1, source_reputation_score: 96, source_quality_reason: "Tropical weather authority" },

  // -------------------- BUSINESS --------------------
  { group: "Business", platform: "Website", source_name: "Dallas Business Journal", source_url: "https://www.bizjournals.com/dallas/", category: "Business", priority: 2, source_reputation_score: 84, source_quality_reason: "Metro business daily" },
  { group: "Business", platform: "Website", source_name: "Houston Business Journal", source_url: "https://www.bizjournals.com/houston/", category: "Business", priority: 2, source_reputation_score: 84, source_quality_reason: "Metro business daily" },
  { group: "Business", platform: "Website", source_name: "Austin Business Journal", source_url: "https://www.bizjournals.com/austin/", category: "Business", priority: 2, source_reputation_score: 84, source_quality_reason: "Metro business daily" },
  { group: "Business", platform: "Website", source_name: "Texas Comptroller", source_url: "https://comptroller.texas.gov/about/media-center/news/", category: "Business", priority: 2, source_reputation_score: 90, source_quality_reason: "State economic data" },
  { group: "Business", platform: "Website", source_name: "Railroad Commission of Texas", source_url: "https://www.rrc.texas.gov/news/", category: "Energy", priority: 1, source_reputation_score: 92, source_quality_reason: "Oil & gas regulator" },
  { group: "Business", platform: "Website", source_name: "ERCOT", source_url: "https://www.ercot.com/news", category: "Energy", priority: 1, source_reputation_score: 92, source_quality_reason: "Texas power grid operator" },
  { group: "Business", platform: "Website", source_name: "Texas Oil & Gas Association", source_url: "https://www.txoga.org/news/", category: "Energy", priority: 2, source_reputation_score: 82, source_quality_reason: "Industry trade group" },

  // -------------------- VIRAL DISCOVERY --------------------
  // These sources exist to surface content that is already gaining engagement.
  // Most social/video platforms do not expose stable public RSS, so entries
  // without `rss_url` are flagged `discovery_mode: "manual"` — an operator
  // logs viral candidates through the existing ViralRadar / reel_candidates
  // flow rather than the automated ingester. No fake feeds.

  // Video / social discovery
  { group: "Viral Discovery", platform: "TikTok", source_name: "TikTok — Texas Trends", source_url: "https://www.tiktok.com/tag/texas", category: "Social Video", priority: 1, source_reputation_score: 60, source_quality_reason: "Statewide TikTok trend discovery", source_type: "social", viral_weight: 90, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "TikTok", source_name: "TikTok — Houston Trends", source_url: "https://www.tiktok.com/tag/houston", category: "Social Video", priority: 2, source_reputation_score: 58, source_quality_reason: "Metro TikTok trend discovery", source_type: "social", viral_weight: 85, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "TikTok", source_name: "TikTok — Dallas Trends", source_url: "https://www.tiktok.com/tag/dallas", category: "Social Video", priority: 2, source_reputation_score: 58, source_quality_reason: "Metro TikTok trend discovery", source_type: "social", viral_weight: 85, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "TikTok", source_name: "TikTok — Austin Trends", source_url: "https://www.tiktok.com/tag/austin", category: "Social Video", priority: 2, source_reputation_score: 58, source_quality_reason: "Metro TikTok trend discovery", source_type: "social", viral_weight: 85, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "YouTube Shorts — Texas Search", source_url: "https://www.youtube.com/results?search_query=texas&sp=EgIYAQ%253D%253D", category: "Short Video", priority: 1, source_reputation_score: 62, source_quality_reason: "Statewide Shorts discovery", source_type: "video", viral_weight: 85, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "KHOU 11 Houston (YouTube)", source_url: "https://www.youtube.com/@KHOU11", rss_url: "https://www.youtube.com/feeds/videos.xml?user=KHOU11News", category: "Local News Video", priority: 1, source_reputation_score: 85, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "ABC13 Houston (YouTube)", source_url: "https://www.youtube.com/@abc13houston", rss_url: "https://www.youtube.com/feeds/videos.xml?user=abc13houston", category: "Local News Video", priority: 1, source_reputation_score: 85, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "WFAA Dallas (YouTube)", source_url: "https://www.youtube.com/@wfaa", rss_url: "https://www.youtube.com/feeds/videos.xml?user=wfaa8", category: "Local News Video", priority: 1, source_reputation_score: 85, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "NBC 5 Dallas-Fort Worth (YouTube)", source_url: "https://www.youtube.com/@nbcdfw", category: "Local News Video", priority: 2, source_reputation_score: 82, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 72, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "KVUE Austin (YouTube)", source_url: "https://www.youtube.com/@KVUE", rss_url: "https://www.youtube.com/feeds/videos.xml?user=KVUEnews", category: "Local News Video", priority: 2, source_reputation_score: 82, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 72, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "KSAT 12 San Antonio (YouTube)", source_url: "https://www.youtube.com/@ksat12", category: "Local News Video", priority: 2, source_reputation_score: 82, source_quality_reason: "TV station video feed", source_type: "video", viral_weight: 72, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Reed Timmer — Texas Weather Chasing", source_url: "https://www.youtube.com/@ReedTimmerAccu", category: "Weather Video", priority: 2, source_reputation_score: 78, source_quality_reason: "Storm chaser video coverage", source_type: "video", viral_weight: 80, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Ryan Hall, Y'all — Severe Weather", source_url: "https://www.youtube.com/@RyanHallYall", category: "Weather Video", priority: 2, source_reputation_score: 78, source_quality_reason: "Severe weather livestream", source_type: "video", viral_weight: 82, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Texas Storm Chasers", source_url: "https://www.youtube.com/@TexasStormChasers", category: "Weather Video", priority: 2, source_reputation_score: 78, source_quality_reason: "Texas-focused storm coverage", source_type: "video", viral_weight: 82, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Dallas Cowboys (YouTube)", source_url: "https://www.youtube.com/@dallascowboys", category: "Sports Highlights", priority: 2, source_reputation_score: 88, source_quality_reason: "Official highlights channel", source_type: "video", viral_weight: 78, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Houston Texans (YouTube)", source_url: "https://www.youtube.com/@HoustonTexans", category: "Sports Highlights", priority: 2, source_reputation_score: 88, source_quality_reason: "Official highlights channel", source_type: "video", viral_weight: 78, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "Texas Longhorns (YouTube)", source_url: "https://www.youtube.com/@TexasLonghorns", category: "Sports Highlights", priority: 2, source_reputation_score: 86, source_quality_reason: "Official highlights channel", source_type: "video", viral_weight: 76, discovery_mode: "manual" },

  // Emergency / incident video sources
  { group: "Viral Discovery", platform: "YouTube", source_name: "Texas DPS (YouTube)", source_url: "https://www.youtube.com/@TxDPS", category: "Emergency Video", priority: 2, source_reputation_score: 90, source_quality_reason: "Official public safety video", source_type: "video", viral_weight: 70, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "YouTube", source_name: "TDEM (YouTube)", source_url: "https://www.youtube.com/@TexasDivisionofEmergencyMgmt", category: "Emergency Video", priority: 2, source_reputation_score: 92, source_quality_reason: "Official state disaster response video", source_type: "video", viral_weight: 72, discovery_mode: "manual" },

  // Community signals
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/texas", source_url: "https://www.reddit.com/r/texas/", rss_url: "https://www.reddit.com/r/texas/.rss", category: "Community", priority: 1, source_reputation_score: 65, source_quality_reason: "Statewide subreddit — trend signal", source_type: "community", viral_weight: 80, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/houston", source_url: "https://www.reddit.com/r/houston/", rss_url: "https://www.reddit.com/r/houston/.rss", category: "Community", priority: 2, source_reputation_score: 62, source_quality_reason: "Metro subreddit — trend signal", source_type: "community", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/dallas", source_url: "https://www.reddit.com/r/dallas/", rss_url: "https://www.reddit.com/r/dallas/.rss", category: "Community", priority: 2, source_reputation_score: 62, source_quality_reason: "Metro subreddit — trend signal", source_type: "community", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/austin", source_url: "https://www.reddit.com/r/austin/", rss_url: "https://www.reddit.com/r/austin/.rss", category: "Community", priority: 2, source_reputation_score: 62, source_quality_reason: "Metro subreddit — trend signal", source_type: "community", viral_weight: 75, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/sanantonio", source_url: "https://www.reddit.com/r/sanantonio/", rss_url: "https://www.reddit.com/r/sanantonio/.rss", category: "Community", priority: 2, source_reputation_score: 62, source_quality_reason: "Metro subreddit — trend signal", source_type: "community", viral_weight: 72, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/fortworth", source_url: "https://www.reddit.com/r/fortworth/", rss_url: "https://www.reddit.com/r/fortworth/.rss", category: "Community", priority: 3, source_reputation_score: 60, source_quality_reason: "Metro subreddit — trend signal", source_type: "community", viral_weight: 70, discovery_mode: "rss" },
  { group: "Viral Discovery", platform: "Reddit", source_name: "r/TexasPolitics", source_url: "https://www.reddit.com/r/TexasPolitics/", rss_url: "https://www.reddit.com/r/TexasPolitics/.rss", category: "Community", priority: 2, source_reputation_score: 64, source_quality_reason: "Texas politics discussion", source_type: "community", viral_weight: 78, discovery_mode: "rss" },

  // Public incident feeds
  { group: "Viral Discovery", platform: "Website", source_name: "PulsePoint — Texas Incidents", source_url: "https://web.pulsepoint.org", category: "Incident Feed", priority: 3, source_reputation_score: 75, source_quality_reason: "Live fire/EMS incident data", source_type: "community", viral_weight: 68, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "Website", source_name: "Broadcastify — Texas Scanners", source_url: "https://www.broadcastify.com/listen/stid/48", category: "Incident Feed", priority: 3, source_reputation_score: 72, source_quality_reason: "Live public safety audio", source_type: "community", viral_weight: 65, discovery_mode: "manual" },
  { group: "Viral Discovery", platform: "Website", source_name: "USGS Earthquakes — Texas", source_url: "https://earthquake.usgs.gov/earthquakes/map/", rss_url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.atom", category: "Incident Feed", priority: 2, source_reputation_score: 95, source_quality_reason: "Official seismic events", source_type: "official", viral_weight: 74, discovery_mode: "rss" },
];

export function presetsByGroup(): Record<SourceGroup, SourcePreset[]> {
  const out = {} as Record<SourceGroup, SourcePreset[]>;
  for (const g of SOURCE_GROUPS) out[g] = [];
  for (const p of SOURCE_PRESETS) out[p.group].push(p);
  return out;
}

export function presetNotes(p: SourcePreset): string {
  const parts: string[] = [`priority:${p.priority}`];
  if (p.source_type) parts.push(`type:${p.source_type}`);
  if (typeof p.viral_weight === "number") parts.push(`viral:${p.viral_weight}`);
  if (p.discovery_mode === "manual") parts.push("manual discovery");
  if (p.rss_url) parts.push(`rss:${p.rss_url}`);
  parts.push(p.source_quality_reason);
  return parts.join(" · ");
}