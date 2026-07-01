// Google Discover CTR optimization: deterministic scoring + A/B variant
// selection. No AI or randomness at render time — all AI (headline variants,
// image category) is done in one batch call at ingestion.

import type { ArticleLike } from "@/lib/seo-headline";
import { detectDiscoverCategory, getDisplayTitle } from "@/lib/seo-headline";
import { CATEGORY_IMAGE_POOLS, type ImageCategory } from "@/lib/fallback-images";

export type HeadlineVariants = { a: string; b: string };

const LOCATION_WORDS = [
  "texas",
  "houston",
  "dallas",
  "austin",
  "san antonio",
  "fort worth",
  "el paso",
  "lubbock",
  "waco",
  "amarillo",
  "corpus christi",
  "rio grande",
  "border",
  "lone star",
];

const VAGUE_WORDS = ["thing", "stuff", "situation", "update", "news", "story", "breaking"];

function hasClearSubject(text: string): boolean {
  // A clear subject has a capitalized proper noun or a specific noun phrase.
  // Heuristic: at least one word 4+ chars starting with a capital, OR contains
  // a known Texas entity/location.
  if (/\b[A-Z][a-z]{3,}\b/.test(text)) return true;
  const lower = text.toLowerCase();
  return LOCATION_WORDS.some((w) => lower.includes(w));
}

function hasLocationOrEntity(text: string): boolean {
  const lower = text.toLowerCase();
  return LOCATION_WORDS.some((w) => lower.includes(w));
}

function isVague(text: string): boolean {
  const lower = ` ${text.toLowerCase()} `;
  return VAGUE_WORDS.some((w) => lower.includes(` ${w} `));
}

function isImageFromCategoryPool(imageUrl: string | null | undefined, cat: ImageCategory): boolean {
  if (!imageUrl) return false;
  const pool = CATEGORY_IMAGE_POOLS[cat] ?? [];
  return pool.some((u) => u === imageUrl);
}

function isDefaultPoolImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;
  return CATEGORY_IMAGE_POOLS.default.includes(imageUrl);
}

/**
 * Deterministic 0–100 CTR score. No randomness. Safe to call at render time
 * OR at ingestion time — same inputs always produce the same score.
 *
 * Breakdown:
 *  A) Headline quality (0–40)
 *  B) Category alignment (0–30)
 *  C) Image relevance (0–30)
 *  Penalty: image bucket != discover_category → -10
 */
export function scoreDiscoverMatch(
  article: ArticleLike & { resolvedImageUrl?: string | null }
): number {
  const headline = getDisplayTitle(article);
  const usingSeo = !!article.seo_headline?.trim();

  // A. Headline quality (0–40)
  let headlineScore = 0;
  if (hasClearSubject(headline)) headlineScore += 12;
  if (hasLocationOrEntity(headline)) headlineScore += 12;
  if (!isVague(headline)) headlineScore += 8;
  if (usingSeo) headlineScore += 8;
  headlineScore = Math.min(40, headlineScore);

  // B. Category alignment (0–30)
  const discover = (article.discover_category ?? "").trim().toLowerCase() ||
    detectDiscoverCategory(`${headline} ${article.dek ?? ""}`);
  const kwCategory = detectDiscoverCategory(`${headline} ${article.dek ?? ""}`);
  let alignScore = 0;
  if (discover && discover !== "other") alignScore += 15;
  if (discover === kwCategory) alignScore += 10;
  const aiBucket = (article.image_category ?? "").toLowerCase();
  if (aiBucket && aiBucket === discover) alignScore += 5;
  alignScore = Math.min(30, alignScore);

  // C. Image relevance (0–30)
  const resolvedImage = article.resolvedImageUrl ?? article.image_url ?? null;
  let imageScore = 0;
  const imageBucket = (aiBucket in CATEGORY_IMAGE_POOLS ? aiBucket : discover) as ImageCategory;
  if (imageBucket && imageBucket !== "default" && isImageFromCategoryPool(resolvedImage, imageBucket)) {
    imageScore += 20;
  } else if (article.image_url && !isDefaultPoolImage(resolvedImage)) {
    // Publisher-provided hero image — assume topical.
    imageScore += 15;
  }
  if (!isDefaultPoolImage(resolvedImage)) imageScore += 10;
  imageScore = Math.min(30, imageScore);

  let total = headlineScore + alignScore + imageScore;

  // Penalty: mismatched image bucket vs discover_category.
  if (
    aiBucket &&
    aiBucket !== "default" &&
    discover &&
    discover !== "other" &&
    aiBucket !== discover
  ) {
    total -= 10;
  }

  return Math.max(0, Math.min(100, total));
}

/**
 * Deterministic A/B rotation. NO randomness at render time — we hash the slug
 * so a given article always shows the same variant to every viewer, which
 * keeps the impression/click ratios per variant clean.
 *
 * Rule:
 *  - ctr_score >= 60  → always variant A
 *  - ctr_score <  60  → 30% of articles show variant B (bucketed by slug)
 *  - No variants stored → variant A (fallback = display title).
 */
export function pickDisplayVariant(article: {
  slug: string;
  ctr_score?: number | null;
  headline_variants?: HeadlineVariants | null;
}): "a" | "b" {
  const variants = article.headline_variants;
  if (!variants || !variants.b) return "a";
  const score = article.ctr_score ?? 0;
  if (score >= 60) return "a";
  // Deterministic 30% B bucket by slug hash.
  let h = 0;
  for (let i = 0; i < article.slug.length; i++) h = (h * 31 + article.slug.charCodeAt(i)) >>> 0;
  return h % 10 < 3 ? "b" : "a";
}

/**
 * Chooses the actual headline text based on the picked variant, falling back
 * to seo_headline / title. Also returns which variant was used so callers can
 * forward it to analytics.
 */
export function resolveDisplayHeadline(article: ArticleLike & {
  ctr_score?: number | null;
  headline_variants?: HeadlineVariants | null;
}): { headline: string; variant: "a" | "b" } {
  const variant = pickDisplayVariant(article);
  const variants = article.headline_variants;
  if (variant === "b" && variants?.b) return { headline: variants.b, variant };
  if (variants?.a) return { headline: variants.a, variant: "a" };
  return { headline: getDisplayTitle(article), variant: "a" };
}