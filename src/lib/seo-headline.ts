// Content-optimization layer that runs BEFORE image selection and rendering.
// - Chooses the best display headline (AI-rewritten SEO headline > original)
// - Detects a Google Discover-style category from headline + dek
// - Preserves canonical article imagery ahead of broad topical fallbacks
//
// No AI calls happen in this file. Batch AI rewriting is done once per
// ingestion batch by the server hook and cached in daily_articles.seo_headline.

import { getArticleImage, type ArticleImageInput } from "@/lib/fallback-images";

export type DiscoverCategory =
  | "food"
  | "sports"
  | "politics"
  | "business"
  | "weather"
  | "technology"
  | "other";

const DISCOVER_KEYWORDS: Record<Exclude<DiscoverCategory, "other">, string[]> = {
  food: ["bbq", "barbecue", "recipe", "chef", "restaurant", "brisket", "taco", "grill", "kitchen", "cooking"],
  sports: ["nfl", "nba", "mlb", "cowboys", "texans", "astros", "rangers", "spurs", "mavericks", "rockets", "playoff", "coach", "quarterback", "game", "score", "team"],
  politics: ["senate", "congress", "vote", "election", "bill", "governor", "abbott", "paxton", "patrick", "legislature", "capitol", "campaign", "ballot", "primary", "law", "policy"],
  business: ["economy", "market", "stocks", "jobs", "company", "revenue", "earnings", "layoffs", "ceo", "investment", "startup", "tax", "energy", "oil"],
  weather: ["storm", "rain", "hurricane", "tornado", "flood", "heat", "freeze", "snow", "drought", "forecast"],
  technology: ["ai", "software", "iphone", "chip", "cyber", "data center", "semiconductor", "app", "tech"],
};

const CLOUD_ARTICLE_IMAGE_FAIL_CLOSED = "/og/default.jpg";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWholeKeyword(text: string, keyword: string): boolean {
  const term = keyword.trim().toLowerCase();
  if (!term) return false;
  const pattern = escapeRegExp(term).replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${pattern}(?=$|[^a-z0-9])`, "i").test(text);
}

/**
 * Lightweight keyword detection over the SEO headline (preferred) or title.
 * Returns "other" when nothing matches so callers can fall back safely.
 * Whole-token matching is intentional: short terms such as `ai` must never
 * classify unrelated words such as `air`, `said`, or `chair` as technology.
 */
export function detectDiscoverCategory(text: string | null | undefined): DiscoverCategory {
  const normalized = (text ?? "").toLowerCase();
  if (!normalized.trim()) return "other";
  for (const [cat, words] of Object.entries(DISCOVER_KEYWORDS) as [Exclude<DiscoverCategory, "other">, string[]][]) {
    if (words.some((word) => hasWholeKeyword(normalized, word))) return cat;
  }
  return "other";
}

export type ArticleLike = {
  slug: string;
  title: string;
  dek?: string | null;
  seo_headline?: string | null;
  discover_category?: string | null;
  image_url?: string | null;
  image_category?: string | null;
  category?: string | null;
  keywords?: string[] | null;
  seo_keywords?: string[] | null;
  featured_image_url?: string | null;
  image_alt_text?: string | null;
};

/**
 * Legacy ChatGPT publication migrations briefly wrote generated-news hero
 * references as SVG even when the matching raster PNG was committed beside
 * them. Upgrade only that generated-news path at render time so stale database
 * rows cannot keep serving the placeholder SVG while production migrations are
 * catching up. Subject-specific SVG assets elsewhere (for example military
 * honors) are intentionally left untouched.
 */
export function upgradeGeneratedNewsSvgUrl(value: string | null | undefined): string | null {
  const url = (value ?? "").trim();
  if (!url) return null;
  const isGeneratedNews =
    url.includes("/images/news/generated/") ||
    url.includes("/public/images/news/generated/");
  if (!isGeneratedNews || !/\.svg([?#].*)?$/i.test(url)) return url;
  return url.replace(/\.svg(?=([?#].*)?$)/i, ".png");
}

/**
 * Google Discover-facing headline. Prefers the AI-rewritten seo_headline
 * (cached in the DB) and falls back to the original title.
 */
export function getDisplayTitle(article: ArticleLike): string {
  const s = (article.seo_headline ?? "").trim();
  return s.length > 0 ? s : article.title;
}

/**
 * Image input builder for legacy/static fallback selection.
 *
 * A stored `image_category` remains authoritative. Discover classification is
 * deliberately NOT promoted into `image_category`: doing so would let a broad
 * or mistaken headline classification outrank the article's actual site
 * category. Fallback-images.ts can still infer from the headline/keywords when
 * the explicit site category does not map to a known image bucket.
 */
export function toImageInput(article: ArticleLike): ArticleImageInput {
  const headline = getDisplayTitle(article);
  return {
    slug: article.slug,
    image_url: upgradeGeneratedNewsSvgUrl(article.image_url),
    image_category: article.image_category ?? null,
    category: article.category,
    title: headline,
    dek: article.dek,
    keywords: article.seo_keywords ?? article.keywords ?? null,
  };
}

/**
 * Published articles with dedicated, editorially verified subject art should
 * never regress to a stale DB image or a generic fallback during SSR/hydration.
 */
function resolveSubjectImage(article: ArticleLike): string | null {
  const slug = article.slug.trim().toLowerCase();
  if (slug === "texas-policing-agencies-compared") {
    return "/images/news/texas-policing-agencies-compared-seven-role-0c284fef115e.webp";
  }

  const subject = `${article.slug} ${article.title} ${article.seo_headline ?? ""}`.toLowerCase();
  if (subject.includes("purple heart") || subject.includes("purple-heart")) {
    return "/images/military-honors/purple-heart.svg";
  }
  return null;
}

/**
 * Resolve the image displayed for an article.
 *
 * Dynamic/cloud article objects carry the `featured_image_url` field even when
 * its value is null. Those rows must fail closed to the neutral Keep TX Red OG
 * image when no canonical featured image exists. They must never fall through
 * to generic category stock, because a superficially related sports, politics,
 * business, or technology photo can misrepresent the article's primary subject.
 *
 * Static legacy articles that do not carry a canonical-featured-image field keep
 * the historical fallback behavior until they are migrated to governed imagery.
 */
export function resolveArticleImage(article: ArticleLike): string {
  const subjectImage = resolveSubjectImage(article);
  if (subjectImage) return subjectImage;

  const featured = upgradeGeneratedNewsSvgUrl(article.featured_image_url);
  if (featured) return featured;

  const isCloudArticle = Object.prototype.hasOwnProperty.call(article, "featured_image_url");
  if (isCloudArticle) return CLOUD_ARTICLE_IMAGE_FAIL_CLOSED;

  return getArticleImage(toImageInput(article));
}

/**
 * Unified headline set builder. Extends the existing SEO pipeline with a
 * single call that returns the four canonical variants used across the
 * site. Existing per-field callers keep working — this is additive.
 *
 *  - seo_headline: keyword-rich, Texas-relevant, front-loads the entity
 *  - reader_headline: friendly / conversational display headline
 *  - variant_a: Discover A (SEO focus)
 *  - variant_b: Discover B (direct / punchy)
 *
 * When only a title is available (no AI output), it falls back to the
 * original title for every slot so downstream code always has something
 * to render.
 */
export function buildHeadlineSet(input: {
  title: string;
  seo?: string | null;
  reader?: string | null;
  variants?: { a?: string | null; b?: string | null } | null;
}): { seo_headline: string; reader_headline: string; variant_a: string; variant_b: string } {
  const clean = (s?: string | null) => (s ?? "").trim();
  const base = clean(input.title);
  const seo = clean(input.seo) || base;
  const reader = clean(input.reader) || seo;
  const a = clean(input.variants?.a) || seo;
  const b = clean(input.variants?.b) || reader;
  return {
    seo_headline: seo,
    reader_headline: reader,
    variant_a: a,
    variant_b: b,
  };
}
