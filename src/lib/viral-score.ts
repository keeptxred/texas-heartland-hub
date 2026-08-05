// Pure, dependency-free viral scoring for texas_news_feed rows.
// The scorer is used both by ingestion and Viral Radar, so coverage decisions
// must be based on Texas public interest rather than political category alone.

import { extractEntities, inferCategory } from "@/lib/nlp";

export type ViralSignals = {
  reasons: string[];
  texasRelevance: number;
  breakoutVelocity: number;
  socialHooks: number;
  entities: string[];
  category: string;
};

export type ViralResult = {
  viralScore: number;
  classificationConfidence: number;
  texasRelevanceScore: number;
  sourceReputationScore: number;
  sourceReputationReason: string;
  routingType: RoutingType;
  signals: ViralSignals;
};

export type RoutingType = "SEO_ARTICLE" | "FACEBOOK_ONLY" | "REEL_CANDIDATE" | "BOTH";

const HIGH_REP =
  /\b(governor|texas\.gov|attorney general|state of texas|dps|department of public safety|sheriff|police department|police dept|city of |county of |texas tribune|houston chronicle|dallas morning news|austin american-statesman|san antonio express|fort worth star-telegram|texas monthly|texas standard|community impact|kxan|khou|wfaa|kens5|abc13|nbc dfw|cbs austin|fox 4|fox 7|associated press|reuters|u\.s\. news|us news|houston methodist|ut southwestern|baylor university medical center|texas a&m|university of texas|texas tech|u-haul|tdlr|texas workforce commission|workforce solutions|espn|mlb\.com|nba\.com|nfl\.com|nhl\.com)\b/i;
const MED_REP =
  /\b(patch\.com|local ?news|gazette|herald|tribune|chronicle|journal|star|times|post|record|observer|beacon|weekly|kut|kera|tpr|museum|hospital|university|college|school district|isd)\b/i;
const TEXAS_DISCOVERY_SOURCE =
  /(?:texas|moving to texas).*(?:google news|statewide)|(?:google news).*(?:texas|moving to texas)/i;
const OFFICIAL_LOCAL_SOURCE = /\b(?:city of [a-z .'-]+|[a-z .'-]+ county|[a-z .'-]+ isd)\b/i;

export function classifySourceReputation(source: string): { score: number; reason: string } {
  const s = source ?? "";
  if (HIGH_REP.test(s)) return { score: 90, reason: "Official/major outlet" };
  if (TEXAS_DISCOVERY_SOURCE.test(s)) return { score: 75, reason: "Configured Texas discovery feed" };
  if (OFFICIAL_LOCAL_SOURCE.test(s)) return { score: 75, reason: "Official local-government source" };
  if (MED_REP.test(s)) return { score: 65, reason: "Established local or institutional source" };
  if (!s.trim()) return { score: 30, reason: "Unknown source" };
  return { score: 45, reason: "Unclassified source" };
}

export const SOURCE_REPUTATION_FLOOR = 55;
export const TEXAS_RELEVANCE_MIN = 40;
export const TEXAS_RELEVANCE_AUTO = 75;

const TEXAS_STRONG = /\btexas\b|\btexans?\b|\bt\.x\.\b/i;
const TEXAS_CITIES = /\b(houston|dallas|austin|san antonio|fort worth|el paso|rgv|rio grande valley|rio grande|mcallen|brownsville|laredo|lubbock|amarillo|corpus christi|waco|arlington|plano|frisco|mckinney|denton|irving|garland|richardson|round rock|tyler|abilene|midland|odessa|beaumont|galveston|killeen|college station|bryan|san marcos|new braunfels|conroe|the woodlands|sugar land|katy|pearland|pasadena|humble|spring|harlingen|lampasas|pecos|fort stockton|san angelo|big spring)\b/i;
const TEXAS_COUNTIES = /\b(harris county|dallas county|tarrant county|bexar county|travis county|collin county|denton county|fort bend county|montgomery county|williamson county|hidalgo county|el paso county|nueces county|cameron county|galveston county|brazoria county|jefferson county|lubbock county|mclennan county|pecos county|howard county|glasscock county|lampasas county)\b/i;
const OFFICIAL_SOURCE = /(governor|texas\.gov|office of the governor|attorney general|state of texas|texas department|texas commission|texas division|texas workforce|tdlr|tdem|dps)/i;
const TEXAS_OFFICIALS = /\b(abbott|greg abbott|dan patrick|lt\.? gov(?:ernor)? patrick|ken paxton|ted cruz|john cornyn|dade phelan|dustin burrows|glenn hegar|sid miller|wayne christian|chip roy|dan crenshaw|colin allred|wesley hunt|ronny jackson|jodey arrington|beto o'?rourke|john whitmire|eric johnson|kirk watson|ron nirenberg|mattie parker|lina hidalgo|clay jenkins|tim o'?hare)\b/i;
const TEXAS_AGENCIES = /\b(txdot|tceq|tea\b|twdb|tdcj|tabc|tdi|tpwd|tdlr|tdem|puc(?: of texas)?|ercot|texas dps|department of public safety|texas national guard|texas military department|texas workforce commission|workforce solutions|texas health and human services|hhsc|texas education agency|texas department of transportation|texas division of emergency management|texas a&m forest service|texas commission on environmental quality|texas legislature|texas house|texas senate|texas supreme court|court of criminal appeals of texas|texas a&m|university of texas|ut austin|ut southwestern|texas tech|tdlr)\b/i;
const TEXAS_INSTITUTIONS = /\b(houston methodist|baylor university medical center|perot museum|whataburger|space ?x|lampasas isd|tarrant county commissioners|dallas police|houston texans|dallas cowboys|fc dallas|texas hospital|texas university|texas school district)\b/i;
const TEXAS_SPORTS = /\b(astros|cowboys|texans|rangers baseball|texas rangers|mavericks|mavs|rockets|spurs|stars|fc dallas|houston dynamo|longhorns|aggies|red raiders|horned frogs|baylor bears|smu mustangs|utep miners|dallas wings)\b/i;
const STATEWIDE_PUBLIC_INTEREST = /\b(hospital ranking|best hospitals?|migration report|moving destination|moves? to texas|wildfire|fire danger|teaching restrictions?|first amendment|ten commandments|religious freedom|polling locations?|voting sites?|skills development fund|workforce grant|museum expansion|anniversary|birthday deals?|jobs?|layoffs?|back wages|child labor|public safety|school policy|healthcare workers?|commissioners?|city council|county judge|proposed reduction|cuts? the number)\b/i;
const TEXAS_CATEGORIES = new Set([
  "Texas Politics",
  "Texas Economy",
  "Texas Law & Policy",
  "Elections",
  "Border",
  "Energy",
  "Public Safety",
  "Education",
  "Weather",
  "Local",
  "Business",
  "Sports",
  "Non-Political",
]);

const BREAKING_WORDS = /\b(breaking|signs|declares|activates|announces|emergency|ruling|sues?|lawsuit|indicted|arrested|veto|appoints|filed|passes|approves|dies|killed|shooting|storm|hurricane|flood|tornado|wildfire|evacuation|recall|impeach|tops?|ranks?|awards?|bans?|fires?|lays? off|expands?|plans?|turns?|marks?|considers?|proposes?|reduces?|cuts?)\b/i;
const SOCIAL_HOOK_WORDS = /\b(election|elections|abbott|paxton|border|tax|taxes|shooting|hurricane|storm|flood|wildfire|crime|police|ice|migrant|migration|school|parents|hospital|jobs|layoffs|guns|gun|abortion|trump|biden|harris|whataburger|cowboys|texans)\b/i;

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Infinity;
  return (Date.now() - t) / 3_600_000;
}

export function scoreFeedItem(item: {
  title: string;
  source: string;
  pub_date: string;
  description?: string | null;
  has_video?: boolean | null;
  source_reputation_score?: number | null;
  source_reputation_reason?: string | null;
}): ViralResult {
  const title = item.title ?? "";
  const source = item.source ?? "";
  const desc = item.description ?? "";
  const hay = `${title} ${desc}`;
  const sourceHay = source;
  const hrs = hoursSince(item.pub_date);
  const reasons: string[] = [];
  const entities = extractEntities(hay);
  const category = inferCategory(entities, `${hay} ${sourceHay}`);

  let texas = 0;
  if (TEXAS_STRONG.test(title)) { texas += 20; reasons.push("Texas in headline"); }
  else if (TEXAS_STRONG.test(desc)) { texas += 10; reasons.push("Texas in body"); }
  if (TEXAS_CITIES.test(hay)) { texas += 12; reasons.push("Texas city named"); }
  if (TEXAS_COUNTIES.test(hay)) { texas += 10; reasons.push("Texas county named"); }
  const confirmedTexasLocalSource =
    TEXAS_CITIES.test(sourceHay) || TEXAS_COUNTIES.test(sourceHay) || TEXAS_INSTITUTIONS.test(sourceHay);
  if (
    OFFICIAL_SOURCE.test(sourceHay) ||
    TEXAS_STRONG.test(sourceHay) ||
    TEXAS_AGENCIES.test(sourceHay) ||
    confirmedTexasLocalSource
  ) {
    texas += 20; reasons.push("Texas government/agency source");
  }
  if (TEXAS_OFFICIALS.test(hay)) { texas += 20; reasons.push("Texas official named"); }
  if (TEXAS_AGENCIES.test(hay)) { texas += 15; reasons.push("Texas agency named"); }
  if (TEXAS_INSTITUTIONS.test(hay) || TEXAS_INSTITUTIONS.test(sourceHay)) {
    texas += 15; reasons.push("Texas institution named");
  }
  if (TEXAS_SPORTS.test(hay)) { texas += 15; reasons.push("Texas sports team"); }
  if (STATEWIDE_PUBLIC_INTEREST.test(hay) && (TEXAS_STRONG.test(hay) || TEXAS_CITIES.test(hay) || TEXAS_AGENCIES.test(hay))) {
    texas += 10; reasons.push("Statewide public-interest topic");
  }
  if (TEXAS_CATEGORIES.has(category)) { texas += 8; reasons.push(`TX category: ${category}`); }
  if (entities.some((e) => TEXAS_OFFICIALS.test(e) || TEXAS_CITIES.test(e) || TEXAS_STRONG.test(e))) {
    texas += 8; reasons.push("TX entity match");
  }
  if (texas === 0) reasons.push("No Texas signals found");
  texas = Math.min(40, texas);

  let velocity = 0;
  if (hrs <= 3) { velocity += 20; reasons.push("Very fresh (<3h)"); }
  else if (hrs <= 12) { velocity += 12; reasons.push("Fresh (<12h)"); }
  else if (hrs <= 24) { velocity += 6; reasons.push("Same-day"); }
  if (BREAKING_WORDS.test(title)) { velocity += 10; reasons.push("Breaking/news verb"); }
  velocity = Math.min(30, velocity);

  let social = 0;
  const hookMatches = title.match(new RegExp(SOCIAL_HOOK_WORDS, "gi")) ?? [];
  const firstHook = hookMatches[0];
  if (firstHook) { social += 15; reasons.push(`Hook: ${firstHook.toLowerCase()}`); }
  if (hookMatches.length >= 2) { social += 10; reasons.push("Multi-hook headline"); }
  if (/[?!]/.test(title)) { social += 5; reasons.push("Emotive punctuation"); }
  social = Math.min(30, social);

  let confidence = 0;
  if (entities.length >= 2) confidence += 0.4;
  else if (entities.length === 1) confidence += 0.25;
  if (category !== "Non-Political") confidence += 0.35;
  else if (TEXAS_INSTITUTIONS.test(hay) || STATEWIDE_PUBLIC_INTEREST.test(hay)) confidence += 0.35;
  if (texas >= 20) confidence += 0.25;
  confidence = Math.min(1, Number(confidence.toFixed(2)));

  const rep = item.source_reputation_score != null
    ? { score: item.source_reputation_score, reason: item.source_reputation_reason || "From content_sources" }
    : classifySourceReputation(source);
  const repMultiplier = 0.5 + Math.max(0, Math.min(100, rep.score)) / 200;
  const rawScore = texas + velocity + social;
  const viralScore = Math.min(100, Math.round(rawScore * repMultiplier));
  if (rep.score >= 85) reasons.push("High-reputation source");
  else if (rep.score < SOURCE_REPUTATION_FLOOR) reasons.push("Low-reputation source");

  const texasRelevanceScore = Math.round((texas / 40) * 100);
  const hasVideo = !!item.has_video;
  // Texas culture, health, education, migration, business and institutions are
  // valid native articles. Category must never be used as a political-only veto.
  const searchWorthy = viralScore >= 55 && texasRelevanceScore >= 50 && rep.score >= SOURCE_REPUTATION_FLOOR;
  let routingType: RoutingType;
  if (hasVideo && viralScore >= 70 && searchWorthy) routingType = "BOTH";
  else if (hasVideo && viralScore >= 70) routingType = "REEL_CANDIDATE";
  else if (searchWorthy) routingType = "SEO_ARTICLE";
  else routingType = "FACEBOOK_ONLY";

  return {
    viralScore,
    classificationConfidence: confidence,
    texasRelevanceScore,
    sourceReputationScore: rep.score,
    sourceReputationReason: rep.reason,
    routingType,
    signals: { reasons, texasRelevance: texas, breakoutVelocity: velocity, socialHooks: social, entities, category },
  };
}

export const VIRAL_AUTO_REWRITE_MIN_SCORE = 65;
export const VIRAL_AUTO_REWRITE_MIN_CONFIDENCE = 0.6;
export const VIRAL_READY_MIN_SCORE = 60;
export const VIRAL_READY_MIN_CONFIDENCE = 0.6;

export function qualifiesForAutoRewrite(r: ViralResult): boolean {
  return r.viralScore >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
    r.classificationConfidence >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE &&
    r.texasRelevanceScore >= TEXAS_RELEVANCE_MIN &&
    r.sourceReputationScore >= SOURCE_REPUTATION_FLOOR;
}

export function qualifiesReadyForRewrite(r: ViralResult): boolean {
  return r.viralScore >= VIRAL_READY_MIN_SCORE &&
    r.classificationConfidence >= VIRAL_READY_MIN_CONFIDENCE &&
    r.texasRelevanceScore >= TEXAS_RELEVANCE_AUTO &&
    r.sourceReputationScore >= SOURCE_REPUTATION_FLOOR;
}
