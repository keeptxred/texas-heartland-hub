import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { WAVE2_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave2-upgrades";
import {
  isIssueGuideIndexable,
  issueGuideWordCount,
  MIN_ISSUE_GUIDE_WORDS,
} from "@/lib/issue-guide-indexability";

const wave2 = new Set(WAVE2_ISSUE_GUIDE_SLUGS);

describe("AdSense second-wave issue-guide readiness", () => {
  it("makes exactly five second-wave issue guides publication-ready", () => {
    const failures = issueGuides
      .filter((guide) => wave2.has(guide.slug))
      .flatMap((guide) => {
        const blockers: string[] = [];
        const count = issueGuideWordCount(guide);
        if (count < MIN_ISSUE_GUIDE_WORDS) blockers.push(`words=${count}<${MIN_ISSUE_GUIDE_WORDS}`);
        if (guide.sections.length < 4) blockers.push(`sections=${guide.sections.length}<4`);
        if (guide.sources.length < 3) blockers.push(`sources=${guide.sources.length}<3`);
        if (!isIssueGuideIndexable(guide)) blockers.push("not-indexable");
        return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
      });

    expect(WAVE2_ISSUE_GUIDE_SLUGS).toHaveLength(5);
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("hydrates visible sections on the same objects consumed by public routes", () => {
    for (const guide of issueGuides.filter((candidate) => wave2.has(candidate.slug))) {
      expect(isIssueGuideIndexable(guide)).toBe(true);
      expect(issueGuideWordCount(guide)).toBeGreaterThanOrEqual(MIN_ISSUE_GUIDE_WORDS);
      expect(guide.sections.length).toBeGreaterThan(4);
      expect(guide.sections.every((section) => section.heading.trim().length > 0 && section.body.length > 0)).toBe(true);
    }
  });
});
