import type { TexasCaseFacts } from "@/data/texas-case-facts";
import { getTexasCasePosition } from "@/data/texas-case-all";

export const MIN_TEXAS_CASE_FACTS_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function texasCaseFactsWordCount(facts: TexasCaseFacts) {
  return words([
    facts.title,
    facts.dek,
    ...facts.overview,
    ...facts.framework,
    ...facts.keyQuestions,
  ].join(" "));
}

export function isTexasCaseFactsIndexable(facts: TexasCaseFacts | null | undefined): facts is TexasCaseFacts {
  if (!facts) return false;
  const position = getTexasCasePosition(facts.slug);
  return texasCaseFactsWordCount(facts) >= MIN_TEXAS_CASE_FACTS_WORDS
    && Boolean(position)
    && (position?.sources.length ?? 0) >= 3
    && facts.overview.length >= 3
    && facts.framework.length >= 4
    && facts.keyQuestions.length >= 4;
}
