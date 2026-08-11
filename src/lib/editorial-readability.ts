export type ReadabilityArticleShape = {
  summary?: string;
  relevance?: string;
  sections?: { heading?: string; paragraphs?: string[] }[];
};

export const READABILITY_LIMITS = {
  warningParagraphWords: 130,
  hardParagraphWords: 180,
  hardParagraphSentences: 6,
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

export function validateArticleReadability(article: ReadabilityArticleShape): string[] {
  const reasons: string[] = [];
  const paragraphs: { label: string; text: string }[] = [];

  if (article.summary?.trim()) paragraphs.push({ label: "summary", text: article.summary.trim() });
  if (article.relevance?.trim()) paragraphs.push({ label: "relevance", text: article.relevance.trim() });

  const sections = Array.isArray(article.sections) ? article.sections : [];
  sections.forEach((section, sectionIndex) => {
    const heading = (section?.heading ?? "").trim();
    if (!heading) reasons.push(`readability_missing_section_heading:${sectionIndex + 1}`);
    else if (isGenericHeading(heading)) reasons.push(`readability_generic_section_heading:${sectionIndex + 1}`);

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
