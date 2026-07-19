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
  signals: ViralSignals;
};

const TEXAS_STRONG = /\btexas\b|\btexan\b|\bt\.x\.\b/i;
const TEXAS_CITIES = /\b(houston|dallas|austin|san antonio|fort worth|el paso|rgv|rio grande|mcallen|brownsville|lubbock|amarillo|corpus christi|waco|arlington|plano|frisco|midland|odessa|beaumont|galveston)\b/i;
const OFFICIAL_SOURCE = /(governor|texas\.gov|office of the governor|attorney general|state of texas)/i;

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
}): ViralResult {
  const title = item.title ?? "";
  const source = item.source ?? "";
  const desc = item.description ?? "";
  const hay = `${title} ${desc}`;
  const hrs = hoursSince(item.pub_date);
  const reasons: string[] = [];

  // Texas relevance (0-40)
  let texas = 0;
  if (TEXAS_STRONG.test(title)) { texas += 20; reasons.push("Texas in headline"); }
  else if (TEXAS_STRONG.test(desc)) { texas += 10; reasons.push("Texas in body"); }
  if (TEXAS_CITIES.test(hay)) { texas += 10; reasons.push("Texas city named"); }
  if (OFFICIAL_SOURCE.test(source)) { texas += 10; reasons.push("Official Texas source"); }
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

  const entities = extractEntities(hay);
  const category = inferCategory(entities);

  // Classification confidence — reuses existing category vocabulary only.
  // Higher when the story matches a Texas topic AND has strong entities.
  let confidence = 0;
  if (entities.length >= 2) confidence += 0.4;
  else if (entities.length === 1) confidence += 0.25;
  if (category !== "Non-Political") confidence += 0.35;
  if (texas >= 20) confidence += 0.25;
  confidence = Math.min(1, Number(confidence.toFixed(2)));

  const viralScore = Math.min(100, Math.round(texas + velocity + social));

  return {
    viralScore,
    classificationConfidence: confidence,
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

export function qualifiesForAutoRewrite(r: ViralResult): boolean {
  return (
    r.viralScore >= VIRAL_AUTO_REWRITE_MIN_SCORE &&
    r.classificationConfidence >= VIRAL_AUTO_REWRITE_MIN_CONFIDENCE
  );
}