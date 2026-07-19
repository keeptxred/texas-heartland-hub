// Pure, dependency-free viral scoring for texas_news_feed rows.
// Reuses the existing NLP entity dictionary and category vocabulary — it
// never invents a new category, never mutates articles, and never publishes.
// The output is advisory: a numeric score, a confidence, and the reasons.

import { extractEntities, inferCategory } from "@/lib/nlp";

export type ViralSignals = {
  reasons: string[];
  texasRelevance: number; // 0-40
  breakoutVelocity: number; // 0-30
  socialHooks: number; // 0-30
  entities: string[];
  category: string;
};

export type ViralResult = {
  viralScore: number; // 0-100, integer
  classificationConfidence: number; // 0-1
  texasRelevanceScore: number; // 0-100, normalized
  sourceReputationScore: number; // 0-100
  sourceReputationReason: string;
  routingType: RoutingType;
  signals: ViralSignals;
};

export type RoutingType = "SEO_ARTICLE" | "FACEBOOK_ONLY" | "REEL_CANDIDATE" | "BOTH";

// Reputation classifier — pure & deterministic. Overridable via content_sources.
const HIGH_REP =
  /\b(governor|texas\.gov|attorney general|state of texas|dps|department of public safety|sheriff|police department|police dept|city of |county of |texas tribune|houston chronicle|dallas morning news|austin american-statesman|san antonio express|fort worth star-telegram|texas monthly|kxan|khou|wfaa|kens5|abc13|nbc dfw|cbs austin|fox 4|fox 7|associated press|reuters|espn|mlb\.com|nba\.com|nfl\.com|nhl\.com)\b/i;
const MED_REP =
  /\b(community impact|patch\.com|local ?news|gazette|herald|tribune|chronicle|journal|star|times|post|record|observer|beacon|weekly|kut|kera|tpr)\b/i;

export function classifySourceReputation(source: string): { score: number; reason: string } {
  const s = source ?? "";
  if (HIGH_REP.test(s)) return { score: 90, reason: "Official/major outlet" };
  if (MED_REP.test(s)) return { score: 65, reason: "Established local source" };
  if (!s.trim()) return { score: 30, reason: "Unknown source" };
  return { score: 45, reason: "Unclassified source" };
}

export const SOURCE_REPUTATION_FLOOR = 55;
export const TEXAS_RELEVANCE_MIN = 40;
export const TEXAS_RELEVANCE_AUTO = 85;

const TEXAS_STRONG = /\btexas\b|\btexan\b|\bt\.x\.\b/i;
const TEXAS_CITIES = /\b(houston|dallas|austin|san antonio|fort worth|el paso|rgv|rio grande|mcallen|brownsville|lubbock|amarillo|corpus christi|waco|arlington|plano|frisco|midland|odessa|beaumont|galveston)\b/i;
const OFFICIAL_SOURCE = /(governor|texas\.gov|office of the governor|attorney general|state of texas)/i;
// Texas officials and political figures — presence alone strongly implies TX relevance.
const TEXAS_OFFICIALS = /\b(abbott|dan patrick|lt\.? gov(?:ernor)? patrick|ken paxton|paxton|ted cruz|john cornyn|greg abbott|dade phelan|glenn hegar|george p\.? bush|sid miller|wayne christian|chip roy|dan crenshaw|colin allred|wesley hunt|ronny jackson|jodey arrington|beto o'?rourke|sylvester turner|john whitmire|eric johnson|kirk watson|ron nirenberg|mattie parker)\b/i;
// Texas state agencies / bodies frequently appearing in source or body.
const TEXAS_AGENCIES = /\b(txdot|tceq|tea\b|twdb|tdcj|tabc|tdi|tpwd|tdlr|puc(?: of texas)?|ercot|texas rangers dps|texas dps|department of public safety|texas national guard|texas military department|texas workforce commission|texas health and human services|hhsc|texas education agency|texas department of transportation|texas commission on environmental quality|texas legislature|texas house|texas senate|texas supreme court|court of criminal appeals of texas|texas a&m|university of texas|ut austin|texas tech)\b/i;
// Categories that inherently imply Texas coverage on this site.
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
]);

const BREAKING_WORDS =
  /\b(breaking|signs|declares|announces|emergency|ruling|indicted|arrested|veto|appoints|filed|passes|approves|dies|killed|shooting|storm|hurricane|flood|tornado|evacuation|recall|impeach)\b/i;

const SOCIAL_HOOK_WORDS =
  /\b(election|elections|abbott|paxton|border|invasion|tax|taxes|shooting|hurricane|storm|flood|crime|police|ice|migrant|school|parents|woke|drag|guns|gun|abortion|trump|biden|harris)\b/i;

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

  // Entities/category computed first so Texas relevance can consult them.
  const entities = extractEntities(hay);
  const category = inferCategory(entities);

  // Texas relevance (0-40) — do NOT require the literal word "Texas" in title.
  let texas = 0;
  if (TEXAS_STRONG.test(title)) { texas += 20; reasons.push("Texas in headline"); }
  else if (TEXAS_STRONG.test(desc)) { texas += 10; reasons.push("Texas in body"); }
  if (TEXAS_CITIES.test(hay)) { texas += 12; reasons.push("Texas city named"); }
  if (OFFICIAL_SOURCE.test(sourceHay) || TEXAS_STRONG.test(sourceHay) || TEXAS_AGENCIES.test(sourceHay)) {
    texas += 20; reasons.push("Texas government/agency source");
  }
  if (TEXAS_OFFICIALS.test(hay)) { texas += 20; reasons.push("Texas official named"); }
  if (TEXAS_AGENCIES.test(hay)) { texas += 15; reasons.push("Texas agency named"); }
  if (TEXAS_CATEGORIES.has(category)) { texas += 8; reasons.push(`TX category: ${category}`); }
  if (entities.some((e) => TEXAS_OFFICIALS.test(e) || TEXAS_CITIES.test(e) || TEXAS_STRONG.test(e))) {
    texas += 8; reasons.push("TX entity match");
  }
  texas = Math.min(40, texas);

  // Breakout velocity (0-30) — recency + breaking-verb weight
  let velocity = 0;
  if (hrs <= 3) { velocity += 20; reasons.push("Very fresh (<3h)"); }
  else if (hrs <= 12) { velocity += 12; reasons.push("Fresh (<12h)"); }
  else if (hrs <= 24) { velocity += 6; reasons.push("Same-day"); }
  if (BREAKING_WORDS.test(title)) { velocity += 10; reasons.push("Breaking verb"); }
  velocity = Math.min(30, velocity);

  // Social hooks (0-30) — topics that historically drive engagement
  let social = 0;
  const hookMatches = title.match(new RegExp(SOCIAL_HOOK_WORDS, "gi")) ?? [];
  const firstHook = hookMatches[0];
  if (firstHook) { social += 15; reasons.push(`Hook: ${firstHook.toLowerCase()}`); }
  if (hookMatches.length >= 2) { social += 10; reasons.push("Multi-hook headline"); }
  if (/[?!]/.test(title)) { social += 5; reasons.push("Emotive punctuation"); }
  social = Math.min(30, social);

  // Classification confidence — reuses existing category vocabulary only.
  // Higher when the story matches a Texas topic AND has strong entities.
  let confidence = 0;
  if (entities.length >= 2) confidence += 0.4;
  else if (entities.length === 1) confidence += 0.25;
  if (category !== "Non-Political") confidence += 0.35;
  if (texas >= 20) confidence += 0.25;
  confidence = Math.min(1, Number(confidence.toFixed(2)));

  // Source reputation acts as a multiplier (0.5x - 1.0x) on the raw score.
  const rep = item.source_reputation_score != null
    ? { score: item.source_reputation_score, reason: item.source_reputation_reason || "From content_sources" }
    : classifySourceReputation(source);
  const repMultiplier = 0.5 + (Math.max(0, Math.min(100, rep.score)) / 200); // 0.5..1.0
  const rawScore = texas + velocity + social;
  const viralScore = Math.min(100, Math.round(rawScore * repMultiplier));
  if (rep.score >= 85) reasons.push("High-reputation source");
  else if (rep.score < SOURCE_REPUTATION_FLOOR) reasons.push("Low-reputation source");

  // Normalize Texas relevance to 0-100 (raw is 0-40).
  const texasRelevanceScore = Math.round((texas / 40) * 100);

  // Routing decision.
  const hasVideo = !!item.has_video;
  const searchWorthy = viralScore >= 60 && texasRelevanceScore >= 50 && category !== "Non-Political";
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
    signals: {
      reasons,
      texasRelevance: texas,
      breakoutVelocity: velocity,
      socialHooks: social,
      entities,
      category,
    },
  };
}

// Gate for automatic rewrite. Score threshold + confidence floor keep
// low-confidence items in the panel for manual review.
export const VIRAL_AUTO_REWRITE_MIN_SCORE = 70;
export const VIRAL_AUTO_REWRITE_MIN_CONFIDENCE = 0.6;
// Stricter "Ready for Rewrite" auto-flag gate.
export const VIRAL_READY_MIN_SCORE = 90;
export const VIRAL_READY_MIN_CONFIDENCE = 0.8;

export function qualifiesForAutoRewrite(r: ViralResult): boolean {
  return (
    r.viralScore >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
    r.classificationConfidence >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE &&
    r.texasRelevanceScore >= TEXAS_RELEVANCE_MIN &&
    r.sourceReputationScore >= SOURCE_REPUTATION_FLOOR
  );
}

export function qualifiesReadyForRewrite(r: ViralResult): boolean {
  return (
    r.viralScore >= VIRAL_READY_MIN_SCORE &&
    r.classificationConfidence >= VIRAL_READY_MIN_CONFIDENCE &&
    r.texasRelevanceScore >= TEXAS_RELEVANCE_AUTO &&
    r.sourceReputationScore >= SOURCE_REPUTATION_FLOOR
  );
}