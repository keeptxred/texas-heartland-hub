import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";

const MIN_ISSUE_GUIDE_WORDS = 1000;
const MIN_ISSUE_GUIDE_SECTIONS = 4;
const MIN_ISSUE_GUIDE_SOURCES = 3;

function issueGuideWordCount(guide: (typeof issueGuides)[number]): number {
  return [
    guide.title,
    guide.dek,
    guide.quickAnswer,
    ...guide.sections.flatMap((section) => [section.heading, ...section.body]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

describe("AdSense issue guide readiness inventory", () => {
  it("keeps every sitemap-advertised issue guide substantive and source-backed", () => {
    const violations = issueGuides.flatMap((guide) => {
      const issues: string[] = [];
      const words = issueGuideWordCount(guide);
      if (words < MIN_ISSUE_GUIDE_WORDS) issues.push(`words=${words}<${MIN_ISSUE_GUIDE_WORDS}`);
      if (guide.sections.length < MIN_ISSUE_GUIDE_SECTIONS) issues.push(`sections=${guide.sections.length}<${MIN_ISSUE_GUIDE_SECTIONS}`);
      if (guide.sources.length < MIN_ISSUE_GUIDE_SOURCES) issues.push(`sources=${guide.sources.length}<${MIN_ISSUE_GUIDE_SOURCES}`);
      if (guide.quickAnswer.trim().split(/\s+/).length < 25) issues.push("quick-answer-too-short");
      return issues.length ? [`${guide.slug}: ${issues.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
