import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { PRIORITY_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-priority-upgrades";
import {
  isIssueGuideIndexable,
  issueGuideWordCount,
  MIN_ISSUE_GUIDE_WORDS,
} from "@/lib/issue-guide-indexability";

const priority = new Set(PRIORITY_ISSUE_GUIDE_SLUGS);

describe("AdSense priority issue-guide readiness", () => {
  it("makes the five priority issue guides genuinely publication-ready", () => {
    const failures = issueGuides
      .filter((guide) => priority.has(guide.slug))
      .flatMap((guide) => {
        const blockers: string[] = [];
        const count = issueGuideWordCount(guide);
        if (count < MIN_ISSUE_GUIDE_WORDS) blockers.push(`words=${count}<${MIN_ISSUE_GUIDE_WORDS}`);
        if (guide.sections.length < 4) blockers.push(`sections=${guide.sections.length}<4`);
        if (guide.sources.length < 3) blockers.push(`sources=${guide.sources.length}<3`);
        if (!isIssueGuideIndexable(guide)) blockers.push("not-indexable");
        return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
      });

    expect(PRIORITY_ISSUE_GUIDE_SLUGS).toHaveLength(5);
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("does not accidentally promote the remaining thin issue guides", () => {
    const promoted = issueGuides
      .filter((guide) => !priority.has(guide.slug))
      .filter(isIssueGuideIndexable)
      .map((guide) => `${guide.slug}:${issueGuideWordCount(guide)}`);

    expect(promoted).toEqual([]);
  });

  it("hydrates the same guide objects used by the public route", () => {
    for (const guide of issueGuides.filter((candidate) => priority.has(candidate.slug))) {
      expect(isIssueGuideIndexable(guide)).toBe(true);
      expect(guide.sections.length).toBeGreaterThan(4);
      expect(guide.sections.some((section) => section.heading.startsWith("How to") || section.heading.includes("different") || section.heading.includes("Reliability"))).toBe(true);
    }
  });
});
