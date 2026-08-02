import type { ArticleBodyShape } from "@/lib/article-dedupe";

export const NON_EVERGREEN_MIN_MAIN_WORDS = 2000;
export const EVERGREEN_MIN_MAIN_WORDS = 5000;
export const SPORTS_BREAKING_MIN_MAIN_WORDS = 800;
export const SPORTS_ANALYSIS_MIN_MAIN_WORDS = 1200;
export const SPORTS_MIN_MAIN_WORDS = SPORTS_ANALYSIS_MIN_MAIN_WORDS;
// Ingested RSS rewrites (kind = "ingested" or "news") are gated at the
// breaking-news floor used by the ingestion pipeline. The publish path in
// src/routes/api/public/hooks/ingest-feeds.ts commits rows above this
// threshold, so the read/visibility gate MUST match — otherwise articles
// that publish successfully (and get posted to Facebook) would 404 on
// /news/{slug}. Evergreen and generic long-form (tools/guides) still use
// the higher NON_EVERGREEN_MIN_MAIN_WORDS / EVERGREEN_MIN_MAIN_WORDS.
export const INGESTED_MIN_MAIN_WORDS = 800;

const EXCLUDED_SECTION_RE =
  /\b(texas\s+relevance|source\s+attribution|sources?|faq|frequently\s+asked\s+questions|key\s+takeaways?|reader\s+questions?)\b/i;

const GENERIC_CONTENT_PATTERNS = [
  /keep tx red is tracking this story/i,
  /check back for updates/i,
  /affects texans and is being tracked/i,
  /this story is developing/i,
  /more information will be added as it becomes available/i,
  /see our category page for related/i,
];

const GENERIC_FAQ_PATTERNS = [
  /where can i read more/i,
  /where can i learn more/i,
  /how can i stay updated/i,
  /when will more information be available/i,
  /check back for updates/i,
];

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isExcludedSectionHeading(heading?: string | null): boolean {
  return EXCLUDED_SECTION_RE.test((heading ?? "").trim());
}

function normalizedText(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function isGenericText(value: string): boolean {
  return GENERIC_CONTENT_PATTERNS.some((pattern) => pattern.test(value));
}

export function isSpecificArticleFaq(faq: { q?: string | null; a?: string | null }): boolean {
  const question = normalizedText(faq.q);
  const answer = normalizedText(faq.a);
  if (question.length < 12 || answer.length < 30) return false;
  return !GENERIC_FAQ_PATTERNS.some((pattern) => pattern.test(`${question} ${answer}`));
}

export function sanitizeArticleFaqs<T extends { q?: string | null; a?: string | null }>(faqs: T[] | null | undefined): T[] {
  if (!Array.isArray(faqs)) return [];
  const seen = new Set<string>();
  return faqs.filter((faq) => {
    if (!isSpecificArticleFaq(faq)) return false;
    const key = `${normalizedText(faq.q).toLowerCase()}|${normalizedText(faq.a).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function articleMainText(body: ArticleBodyShape | null | undefined): string {
  if (!body || typeof body !== "object") return "";
  const parts: string[] = [];

  // Count the complete substantive story body, including descriptive section
  // headings. Headings are reader-facing editorial content and are counted by
  // normal page word-count tools. Metadata, source attribution, FAQs, key
  // takeaways, and boilerplate Texas-relevance sections remain excluded.
  (Array.isArray(body.intro) ? body.intro : []).forEach((p) => {
    const text = normalizedText(p);
    if (text && !isGenericText(text)) parts.push(text);
  });
  (Array.isArray(body.sections) ? body.sections : []).forEach((section) => {
    if (!section || isExcludedSectionHeading(section.heading)) return;
    const heading = normalizedText(section.heading);
    const paragraphs = (Array.isArray(section.paragraphs) ? section.paragraphs : [])
      .map(normalizedText)
      .filter((p) => p && !isGenericText(p));
    const bullets = (Array.isArray(section.bullets) ? section.bullets : [])
      .map(normalizedText)
      .filter((p) => p && !isGenericText(p));
    if (paragraphs.length === 0 && bullets.length === 0) return;
    if (heading) parts.push(heading);
    parts.push(...paragraphs, ...bullets);
  });

  return parts.join(" ");
}

export function articleMainWordCount(body: ArticleBodyShape | null | undefined): number {
  return wordCount(articleMainText(body));
}

export function requiredMainWordCountForKind(kind?: string | null): number {
  if (kind === "evergreen") return EVERGREEN_MIN_MAIN_WORDS;
  if (kind?.startsWith("sports-breaking")) return SPORTS_BREAKING_MIN_MAIN_WORDS;
  if (kind?.startsWith("sports-")) return SPORTS_ANALYSIS_MIN_MAIN_WORDS;
  if (kind === "ingested" || kind === "news") return INGESTED_MIN_MAIN_WORDS;
  return NON_EVERGREEN_MIN_MAIN_WORDS;
}

export function hasMeaningfulArticleStructure(body: ArticleBodyShape | null | undefined): boolean {
  if (!body || typeof body !== "object") return false;
  const intro = (Array.isArray(body.intro) ? body.intro : [])
    .map(normalizedText)
    .filter((p) => p && !isGenericText(p));
  const meaningfulSections = (Array.isArray(body.sections) ? body.sections : []).filter((section) => {
    if (!section || isExcludedSectionHeading(section.heading)) return false;
    const paragraphs = (Array.isArray(section.paragraphs) ? section.paragraphs : [])
      .map(normalizedText)
      .filter((p) => p && !isGenericText(p));
    const bullets = (Array.isArray(section.bullets) ? section.bullets : [])
      .map(normalizedText)
      .filter((p) => p && !isGenericText(p));
    return paragraphs.join(" ").length >= 180 || bullets.join(" ").length >= 120;
  });
  const introWords = wordCount(intro.join(" "));
  return introWords >= 35 && meaningfulSections.length >= 2;
}

export function hasValidArticleSources(body: ArticleBodyShape | null | undefined): boolean {
  if (!body || typeof body !== "object") return false;
  const sources = "sources" in body && Array.isArray(body.sources) ? body.sources : [];
  if (sources.length === 0) return false;
  return sources.some((source) => {
    if (!source || typeof source !== "object") return false;
    const label = normalizedText("label" in source ? source.label : "");
    const url = normalizedText("url" in source ? source.url : "");
    if (label.length < 3) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  });
}

export function meetsArticleMainWordCount(kind: string | null | undefined, body: ArticleBodyShape | null | undefined): boolean {
  return articleMainWordCount(body) >= requiredMainWordCountForKind(kind)
    && hasMeaningfulArticleStructure(body)
    && hasValidArticleSources(body);
}

export function assertArticleMainWordCount(kind: string | null | undefined, body: ArticleBodyShape | null | undefined): void {
  const count = articleMainWordCount(body);
  const required = requiredMainWordCountForKind(kind);
  if (count < required) {
    throw new Error(`Article main body is too short: ${count}/${required} words`);
  }
  if (!hasMeaningfulArticleStructure(body)) {
    throw new Error("Article body lacks a substantive introduction and at least two meaningful sections");
  }
  if (!hasValidArticleSources(body)) {
    throw new Error("Article body must include at least one valid source URL");
  }
}
