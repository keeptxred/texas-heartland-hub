import { describe, expect, it } from "vitest";
import { SUPPORTING_GUIDES } from "@/data/all-guides";

const MIN_GUIDE_WORDS = 1200;
const MIN_FAQ_ITEMS = 3;
const MIN_PRIMARY_SOURCES = 2;

function guideWordCount(guide: (typeof SUPPORTING_GUIDES)[string]): number {
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

describe("AdSense supporting guide readiness inventory", () => {
  it("keeps every sitemap-advertised supporting guide substantive and sourced", () => {
    const violations = Object.values(SUPPORTING_GUIDES).flatMap((guide) => {
      const issues: string[] = [];
      const words = guideWordCount(guide);
      if (words < MIN_GUIDE_WORDS) issues.push(`words=${words}<${MIN_GUIDE_WORDS}`);
      if (guide.faq.length < MIN_FAQ_ITEMS) issues.push(`faq=${guide.faq.length}<${MIN_FAQ_ITEMS}`);
      if (guide.sources.length < MIN_PRIMARY_SOURCES) issues.push(`sources=${guide.sources.length}<${MIN_PRIMARY_SOURCES}`);
      if (!guide.keyTakeaways.length) issues.push("missing-key-takeaways");
      if (!guide.sections.length) issues.push("missing-sections");
      return issues.length ? [`${guide.slug}: ${issues.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
