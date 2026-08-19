import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const MIN_SUPPORTING_GUIDE_WORDS = 1200;
export const MIN_SUPPORTING_GUIDE_FAQS = 3;
export const MIN_SUPPORTING_GUIDE_SOURCES = 2;

export function supportingGuideWordCount(guide: CornerstoneGuide): number {
  return [
    guide.title,
    guide.dek,
    ...guide.keyTakeaways,
    ...guide.intro,
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
    ...guide.faq.flatMap((item) => [item.q, item.a]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function isSupportingGuideIndexable(guide: CornerstoneGuide | null | undefined): guide is CornerstoneGuide {
  if (!guide) return false;
  return supportingGuideWordCount(guide) >= MIN_SUPPORTING_GUIDE_WORDS
    && guide.faq.length >= MIN_SUPPORTING_GUIDE_FAQS
    && guide.sources.length >= MIN_SUPPORTING_GUIDE_SOURCES
    && guide.keyTakeaways.length > 0
    && guide.sections.length > 0;
}
