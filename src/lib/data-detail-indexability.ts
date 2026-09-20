import type { TexasDataSet } from "@/data/texas-data-catalog";

export const MIN_DATA_DETAIL_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function dataDetailWordCount(dataset: TexasDataSet) {
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

export function isDataDetailIndexable(dataset: TexasDataSet | null | undefined): dataset is TexasDataSet {
  return Boolean(dataset)
    && dataDetailWordCount(dataset!) >= MIN_DATA_DETAIL_WORDS
    && dataset!.sources.length >= 3
    && dataset!.whatAvailable.length >= 4
    && dataset!.methodology.length >= 3
    && dataset!.useCases.length >= 3
    && words(dataset!.quickAnswer) >= 25;
}
