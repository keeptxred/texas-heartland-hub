export type ReadabilityArticleShape = {
  summary?: string;
  relevance?: string;
  sections?: { heading?: string; paragraphs?: string[] }[];
};

export const READABILITY_LIMITS = {
  warningParagraphWords: 130,
  hardParagraphWords: 150,
  hardParagraphSentences: 5,
  longArticleWords: 700,
  longArticleMinSections: 2,
  veryLongArticleWords: 1200,
  veryLongArticleMinSections: 3,
} as const;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g);
  return matches?.filter((sentence) => sentence.trim().length > 0).length ?? 0;
}

function hasEmbeddedParagraphBreak(value: string): boolean {
  return /\n\s*\n/.test(value);
}

function isGenericHeading(value: string): boolean {
  return /^(the story|overview|background|details|more information|conclusion|summary)$/i.test(value.trim());
}

const NORMALIZED_SECTION_HEADINGS = [
  "What happened",
  "Why it matters",
  "How the story developed",
  "Who is affected",
  "What officials are watching",
  "What comes next",
  "What readers should know",
  "Key context",
] as const;

function normalizeGenericHeading(value: string, sectionIndex: number): string {
  if (!isGenericHeading(value)) return value.trim();
  return NORMALIZED_SECTION_HEADINGS[sectionIndex % NORMALIZED_SECTION_HEADINGS.length];
}

function splitSentences(value: string): string[] {
  return value.trim().match(/[^.!?]+(?:[.!?]+[”’"']?|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [value.trim()];
}

function looksStructural(value: string): boolean {
  const trimmed = value.trim();
  return /^(?:[-*+]\s|\d+[.)]\s|>\s|#{1,6}\s|```|<[^>]+>)/.test(trimmed);
}

function splitOversizedProse(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed || looksStructural(trimmed) || wordCount(trimmed) <= READABILITY_LIMITS.hardParagraphWords) return [trimmed];

  const sentences = splitSentences(trimmed);
  if (sentences.length < 2) return [trimmed];

  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const sentence of sentences) {
    const sentenceWords = wordCount(sentence);
    const exceedsTarget = current.length > 0 && currentWords + sentenceWords > READABILITY_LIMITS.warningParagraphWords;
    const exceedsSentenceTarget = current.length >= 4;
    if (exceedsTarget || exceedsSentenceTarget) {
      chunks.push(current.join(" "));
      current = [];
      currentWords = 0;
    }
    current.push(sentence);
    currentWords += sentenceWords;
  }
  if (current.length) chunks.push(current.join(" "));

  if (chunks.length > 1 && wordCount(chunks[chunks.length - 1]) < 25) {
    const tail = chunks.pop()!;
    const previous = chunks[chunks.length - 1];
    if (wordCount(previous) + wordCount(tail) <= READABILITY_LIMITS.hardParagraphWords) chunks[chunks.length - 1] = `${previous} ${tail}`;
    else chunks.push(tail);
  }
  return chunks;
}

function repairParagraph(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap(splitOversizedProse);
}

/**
 * Conservatively repairs malformed paragraph-array boundaries without rewriting
 * article wording. Headings and all non-paragraph fields are preserved.
 */
export function repairArticleReadability<T extends ReadabilityArticleShape>(article: T): T {
  if (!Array.isArray(article.sections)) return article;
  let changed = false;
  const sections = article.sections.map((section) => {
    const original = Array.isArray(section?.paragraphs) ? section.paragraphs : [];
    const repaired = original.flatMap((paragraph) => repairParagraph(paragraph ?? ""));
    const sectionChanged = repaired.length !== original.length || repaired.some((paragraph, index) => paragraph !== original[index]);
    if (!sectionChanged) return section;
    changed = true;
    return { ...section, paragraphs: repaired };
  });
  return changed ? ({ ...article, sections } as T) : article;
}

export function validateArticleReadability(article: ReadabilityArticleShape): string[] {
  const reasons: string[] = [];
  const paragraphs: { label: string; text: string }[] = [];

  if (article.summary?.trim()) paragraphs.push({ label: "summary", text: article.summary.trim() });
  if (article.relevance?.trim()) paragraphs.push({ label: "relevance", text: article.relevance.trim() });

  const sections = Array.isArray(article.sections) ? article.sections : [];
  sections.forEach((section, sectionIndex) => {
    const originalHeading = (section?.heading ?? "").trim();
    if (!originalHeading) {
      reasons.push(`readability_missing_section_heading:${sectionIndex + 1}`);
    } else {
      const heading = normalizeGenericHeading(originalHeading, sectionIndex);
      if (heading !== originalHeading && section) section.heading = heading;
      if (isGenericHeading(heading)) reasons.push(`readability_generic_section_heading:${sectionIndex + 1}`);
    }

    (section?.paragraphs ?? []).forEach((paragraph, paragraphIndex) => {
      const text = (paragraph ?? "").trim();
      if (!text) return;
      paragraphs.push({ label: `section_${sectionIndex + 1}_paragraph_${paragraphIndex + 1}`, text });
    });
  });

  for (const paragraph of paragraphs) {
    const words = wordCount(paragraph.text);
    const sentences = sentenceCount(paragraph.text);

    if (hasEmbeddedParagraphBreak(paragraph.text)) {
      reasons.push(`readability_embedded_paragraph_break:${paragraph.label}`);
    }
    if (words > READABILITY_LIMITS.hardParagraphWords) {
      reasons.push(`readability_paragraph_too_long:${paragraph.label}:${words}`);
    }
    if (sentences > READABILITY_LIMITS.hardParagraphSentences && words > READABILITY_LIMITS.warningParagraphWords) {
      reasons.push(`readability_paragraph_too_many_sentences:${paragraph.label}:${sentences}`);
    }
  }

  const totalWords = paragraphs.reduce((total, paragraph) => total + wordCount(paragraph.text), 0);
  const substantiveSections = sections.filter((section) =>
    (section?.paragraphs ?? []).some((paragraph) => wordCount(paragraph ?? "") >= 20),
  ).length;

  if (totalWords >= READABILITY_LIMITS.longArticleWords && substantiveSections < READABILITY_LIMITS.longArticleMinSections) {
    reasons.push(`readability_too_few_sections:${substantiveSections}:${totalWords}`);
  }
  if (totalWords >= READABILITY_LIMITS.veryLongArticleWords && substantiveSections < READABILITY_LIMITS.veryLongArticleMinSections) {
    reasons.push(`readability_too_few_sections_for_long_article:${substantiveSections}:${totalWords}`);
  }

  return reasons;
}
