import { describe, expect, it } from "vitest";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";

const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const MIN_WORDS = 700;
const MIN_SOURCES = 3;
const MIN_AVAILABLE = 4;
const MIN_METHODOLOGY = 3;
const MIN_USE_CASES = 3;
const MIN_QUICK_ANSWER_WORDS = 25;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function dataSetWordCount(dataset: (typeof ALL_DATA_SETS)[number]) {
  return words([
    dataset.title,
    dataset.dek,
    dataset.quickAnswer,
    ...dataset.whatAvailable,
    ...dataset.methodology,
    ...dataset.useCases,
    ...dataset.sources.flatMap((source) => [source.label, source.publisher, source.scope]),
  ].join(" "));
}

describe("AdSense data-detail readiness inventory", () => {
  it("keeps every sitemap-advertised data page substantive and source-backed", () => {
    const violations = ALL_DATA_SETS.flatMap((dataset) => {
      const blockers: string[] = [];
      const count = dataSetWordCount(dataset);
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (dataset.sources.length < MIN_SOURCES) blockers.push(`sources=${dataset.sources.length}<${MIN_SOURCES}`);
      if (dataset.whatAvailable.length < MIN_AVAILABLE) blockers.push(`available=${dataset.whatAvailable.length}<${MIN_AVAILABLE}`);
      if (dataset.methodology.length < MIN_METHODOLOGY) blockers.push(`methodology=${dataset.methodology.length}<${MIN_METHODOLOGY}`);
      if (dataset.useCases.length < MIN_USE_CASES) blockers.push(`useCases=${dataset.useCases.length}<${MIN_USE_CASES}`);
      if (words(dataset.quickAnswer) < MIN_QUICK_ANSWER_WORDS) blockers.push(`quickAnswer=${words(dataset.quickAnswer)}<${MIN_QUICK_ANSWER_WORDS}`);
      return blockers.length ? [`${dataset.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
