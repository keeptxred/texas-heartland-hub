import type { PoliticalSearchGuide } from "@/data/political-search-guides";

export const MIN_POLITICAL_REFERENCE_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function politicalReferenceWordCount(guide: PoliticalSearchGuide) {
  return words([guide.searchQuery, guide.title, guide.dek, guide.quickAnswer, guide.status, ...guide.keyFacts, ...guide.context, ...guide.watchFor].join(" "));
}

export function isPoliticalReferenceIndexable(guide: PoliticalSearchGuide | null | undefined): guide is PoliticalSearchGuide {
  return Boolean(guide)
    && politicalReferenceWordCount(guide!) >= MIN_POLITICAL_REFERENCE_WORDS
    && guide!.sources.filter((source) => source.primary).length >= 2
    && guide!.keyFacts.length >= 4
    && guide!.context.length >= 2
    && guide!.watchFor.length >= 3
    && words(guide!.quickAnswer) >= 25
    && words(guide!.status) >= 25;
}
