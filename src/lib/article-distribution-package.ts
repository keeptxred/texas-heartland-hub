export type DistributionArticle = {
  slug: string;
  title: string;
  seo_headline?: string | null;
  dek?: string | null;
  category?: string | null;
  published_at?: string | null;
  keywords?: unknown;
  seo_keywords?: unknown;
  body_json?: unknown;
  featured_image_url?: string | null;
};

export type ArticleDistributionPackage = {
  sourceTitle: string;
  sourceUrl: string;
  category: string | null;
  facebook: {
    hook: string;
    body: string;
    cta: string;
    hashtags: string;
  };
  instagram: {
    hook: string;
    script: string;
    caption: string;
    hashtags: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  assetUrl: string | null;
  assetNotes: string;
};

type ArticleBodyShape = {
  intro?: unknown;
  keyTakeaways?: unknown;
};

const SITE_URL = "https://keeptxred.com";

function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const sliced = value.slice(0, Math.max(0, max - 1)).replace(/\s+\S*$/, "").trim();
  return `${sliced || value.slice(0, max - 1).trim()}…`;
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(clean).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/[,;|]/).map(clean).filter(Boolean);
  }
  return [];
}

function bodyShape(value: unknown): ArticleBodyShape {
  return value && typeof value === "object" ? value as ArticleBodyShape : {};
}

function articleSummary(article: DistributionArticle): string {
  const dek = clean(article.dek);
  if (dek) return truncate(dek, 420);
  const body = bodyShape(article.body_json);
  if (Array.isArray(body.intro)) {
    const first = body.intro.map(clean).find(Boolean);
    if (first) return truncate(first, 420);
  }
  return clean(article.seo_headline) || clean(article.title);
}

function articleTakeaways(article: DistributionArticle): string[] {
  const body = bodyShape(article.body_json);
  if (!Array.isArray(body.keyTakeaways)) return [];
  return body.keyTakeaways.map(clean).filter(Boolean).slice(0, 3);
}

function hashtagFromCategory(category: string | null | undefined): string | null {
  const cleaned = clean(category).replace(/[^a-z0-9]+/gi, "");
  if (!cleaned || cleaned.length > 28) return null;
  return `#${cleaned}`;
}

function distributionHashtags(category: string | null | undefined): string {
  const values = ["#Texas", "#TexasNews", "#KeepTXRed", hashtagFromCategory(category)].filter(
    (value): value is string => Boolean(value),
  );
  return [...new Set(values)].join(" ");
}

function distributionKeywords(article: DistributionArticle): string {
  const values = [
    ...stringList(article.seo_keywords),
    ...stringList(article.keywords),
    clean(article.category),
    "Texas",
  ].filter(Boolean);
  return [...new Set(values.map((value) => value.toLowerCase()))].slice(0, 8).join(", ");
}

/**
 * Create a factual, reusable distribution package without another AI call.
 * Every sentence comes directly from article metadata or reviewed takeaways.
 */
export function buildArticleDistributionPackage(article: DistributionArticle): ArticleDistributionPackage {
  const sourceTitle = clean(article.seo_headline) || clean(article.title);
  const sourceUrl = `${SITE_URL}/news/${encodeURIComponent(article.slug)}`;
  const summary = articleSummary(article);
  const takeaways = articleTakeaways(article);
  const hashtags = distributionHashtags(article.category);
  const reelMiddle = takeaways.length > 0
    ? takeaways.map((takeaway, index) => `${index + 1}. ${takeaway}`).join(" ")
    : summary;

  return {
    sourceTitle,
    sourceUrl,
    category: clean(article.category) || null,
    facebook: {
      hook: sourceTitle,
      body: summary,
      cta: "Read the full sourced report and supporting links.",
      hashtags,
    },
    instagram: {
      hook: truncate(sourceTitle, 120),
      script: [
        `[0-3s] ${sourceTitle}`,
        `[3-15s] ${summary}`,
        `[15-35s] ${truncate(reelMiddle, 520)}`,
        "[35-45s] Full context and source links are available on KeepTXRed.com.",
      ].join("\n"),
      caption: truncate(`${sourceTitle} — ${summary}`, 200),
      hashtags,
    },
    seo: {
      title: truncate(sourceTitle, 60),
      description: truncate(summary, 158),
      keywords: distributionKeywords(article),
    },
    assetUrl: clean(article.featured_image_url) || null,
    assetNotes: "Automatically prepared from the published article's reviewed metadata and takeaways; no additional factual claims were generated.",
  };
}
