import type { ArticleBodyShape } from "@/lib/article-dedupe";

export const NON_EVERGREEN_MIN_MAIN_WORDS = 2000;
export const EVERGREEN_MIN_MAIN_WORDS = 5000;

const EXCLUDED_SECTION_RE =
  /\b(texas\s+relevance|source\s+attribution|sources?|faq|frequently\s+asked\s+questions|key\s+takeaways?|reader\s+questions?)\b/i;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isExcludedSectionHeading(heading?: string | null): boolean {
  return EXCLUDED_SECTION_RE.test((heading ?? "").trim());
}

export function articleMainText(body: ArticleBodyShape | null | undefined): string {
  if (!body || typeof body !== "object") return "";
  const parts: string[] = [];

  // Count only the actual story body. Metadata, source attribution, FAQs,
  // key takeaways, and boilerplate Texas-relevance sections do not count.
  (Array.isArray(body.intro) ? body.intro : []).forEach((p) => parts.push(p));
  (Array.isArray(body.sections) ? body.sections : []).forEach((section) => {
    if (!section || isExcludedSectionHeading(section.heading)) return;
    (Array.isArray(section.paragraphs) ? section.paragraphs : []).forEach((p) => parts.push(p));
    (Array.isArray(section.bullets) ? section.bullets : []).forEach((p) => parts.push(p));
  });

  return parts.join(" ");
}

export function articleMainWordCount(body: ArticleBodyShape | null | undefined): number {
  return wordCount(articleMainText(body));
}

export function requiredMainWordCountForKind(kind?: string | null): number {
  return kind === "evergreen" ? EVERGREEN_MIN_MAIN_WORDS : NON_EVERGREEN_MIN_MAIN_WORDS;
}

export function meetsArticleMainWordCount(kind: string | null | undefined, body: ArticleBodyShape | null | undefined): boolean {
  return articleMainWordCount(body) >= requiredMainWordCountForKind(kind);
}

export function assertArticleMainWordCount(kind: string | null | undefined, body: ArticleBodyShape | null | undefined): void {
  const count = articleMainWordCount(body);
  const required = requiredMainWordCountForKind(kind);
  if (count < required) {
    throw new Error(`Article main body is too short: ${count}/${required} words`);
  }
}