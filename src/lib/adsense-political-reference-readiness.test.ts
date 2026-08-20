import { describe, expect, it } from "vitest";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";

const MIN_WORDS = 700;
const MIN_PRIMARY_SOURCES = 2;
const MIN_KEY_FACTS = 4;
const MIN_CONTEXT_PARAGRAPHS = 2;
const MIN_WATCH_ITEMS = 3;
const MIN_QUICK_ANSWER_WORDS = 25;
const MIN_STATUS_WORDS = 25;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function guideWordCount(guide: (typeof POLITICAL_SEARCH_GUIDES)[number]) {
  return [
    guide.searchQuery,
    guide.title,
    guide.dek,
    guide.quickAnswer,
    guide.status,
    ...guide.keyFacts,
    ...guide.context,
    ...guide.watchFor,
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense political-reference readiness inventory", () => {
  it("keeps every sitemap-advertised political reference page substantive and source-backed", () => {
    const violations = POLITICAL_SEARCH_GUIDES.flatMap((guide) => {
      const blockers: string[] = [];
      const count = guideWordCount(guide);
      const primarySources = guide.sources.filter((source) => source.primary).length;
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (primarySources < MIN_PRIMARY_SOURCES) blockers.push(`primarySources=${primarySources}<${MIN_PRIMARY_SOURCES}`);
      if (guide.keyFacts.length < MIN_KEY_FACTS) blockers.push(`keyFacts=${guide.keyFacts.length}<${MIN_KEY_FACTS}`);
      if (guide.context.length < MIN_CONTEXT_PARAGRAPHS) blockers.push(`context=${guide.context.length}<${MIN_CONTEXT_PARAGRAPHS}`);
      if (guide.watchFor.length < MIN_WATCH_ITEMS) blockers.push(`watch=${guide.watchFor.length}<${MIN_WATCH_ITEMS}`);
      if (words(guide.quickAnswer) < MIN_QUICK_ANSWER_WORDS) blockers.push(`quickAnswer=${words(guide.quickAnswer)}<${MIN_QUICK_ANSWER_WORDS}`);
      if (words(guide.status) < MIN_STATUS_WORDS) blockers.push(`status=${words(guide.status)}<${MIN_STATUS_WORDS}`);
      return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
