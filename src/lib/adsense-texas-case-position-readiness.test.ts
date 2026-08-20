import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";

const MIN_WORDS = 1000;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense Texas Case position readiness inventory", () => {
  it("keeps every sitemap-advertised position substantive and source-backed", () => {
    const violations = TEXAS_CASE_POSITIONS.flatMap((position) => {
      const count = words([
        position.title,
        position.dek,
        position.stance,
        ...position.keyPoints,
        ...position.intro,
        ...position.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? [])]),
        ...position.sources.map((source) => source.label),
      ].join(" "));
      const blockers: string[] = [];
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (position.sources.length < 3) blockers.push(`sources=${position.sources.length}<3`);
      if (position.sections.length < 4) blockers.push(`sections=${position.sections.length}<4`);
      if (position.intro.length < 2) blockers.push(`intro=${position.intro.length}<2`);
      return blockers.length ? [`${position.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
