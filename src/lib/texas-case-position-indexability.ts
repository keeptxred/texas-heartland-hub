import type { TexasCasePosition } from "@/data/texas-case";

export const MIN_TEXAS_CASE_POSITION_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function texasCasePositionWordCount(position: TexasCasePosition) {
  return words([
    position.title,
    position.dek,
    position.stance,
    ...position.keyPoints,
    ...position.intro,
    ...position.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
    ...position.sources.map((source) => source.label),
  ].join(" "));
}

export function isTexasCasePositionIndexable(position: TexasCasePosition | null | undefined): position is TexasCasePosition {
  return Boolean(position)
    && texasCasePositionWordCount(position!) >= MIN_TEXAS_CASE_POSITION_WORDS
    && position!.sources.length >= 3
    && position!.sections.length >= 4
    && position!.intro.length >= 2
    && position!.keyPoints.length >= 3;
}
