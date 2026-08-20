import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { issueGuideWordCount, MIN_ISSUE_GUIDE_WORDS } from "@/lib/issue-guide-indexability";

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

describe("AdSense issue-guide readiness inventory", () => {
  it("reports every guide that is not yet publication-indexable", () => {
    const violations = issueGuides.flatMap((guide) => {
      const blockers: string[] = [];
      const wordCount = issueGuideWordCount(guide);
      if (wordCount < MIN_ISSUE_GUIDE_WORDS) blockers.push(`words=${wordCount}<${MIN_ISSUE_GUIDE_WORDS}`);
      if (guide.sections.length < 4) blockers.push(`sections=${guide.sections.length}<4`);
      if (guide.sources.length < 3) blockers.push(`sources=${guide.sources.length}<3`);
      const quickAnswerWords = words(guide.quickAnswer);
      if (quickAnswerWords < 25) blockers.push(`quickAnswer=${quickAnswerWords}<25`);
      return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
