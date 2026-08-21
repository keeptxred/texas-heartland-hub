import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { WAVE4_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave4-upgrades";
import {
  isIssueGuideIndexable,
  issueGuideWordCount,
  MIN_ISSUE_GUIDE_WORDS,
} from "@/lib/issue-guide-indexability";

const wave4 = new Set(WAVE4_ISSUE_GUIDE_SLUGS);

describe("AdSense final-wave issue-guide readiness", () => {
  it("makes exactly four final-wave issue guides publication-ready", () => {
    const failures = issueGuides
      .filter((guide) => wave4.has(guide.slug))
      .flatMap((guide) => {
        const blockers: string[] = [];
        const count = issueGuideWordCount(guide);
        if (count < MIN_ISSUE_GUIDE_WORDS) blockers.push(`words=${count}<${MIN_ISSUE_GUIDE_WORDS}`);
        if (guide.sections.length < 4) blockers.push(`sections=${guide.sections.length}<4`);
        if (guide.sources.length < 3) blockers.push(`sources=${guide.sources.length}<3`);
        if (!isIssueGuideIndexable(guide)) blockers.push("not-indexable");
        return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
      });

    expect(WAVE4_ISSUE_GUIDE_SLUGS).toHaveLength(4);
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("adds the Texas Supreme Court opinion as a third source for the SB 14 guide", () => {
    const guide = issueGuides.find((candidate) => candidate.slug === "texas-medical-transition-minors-law");
    expect(guide).toBeDefined();
    expect(isIssueGuideIndexable(guide)).toBe(true);
    expect(guide!.sources.length).toBeGreaterThanOrEqual(3);
    expect(guide!.sources.some((source) => source.url.includes("txcourts.gov/media/1458813/230697.pdf"))).toBe(true);
  });

  it("leaves no issue guide below the publication-readiness contract", () => {
    const failures = issueGuides
      .filter((guide) => !isIssueGuideIndexable(guide))
      .map((guide) => `${guide.slug}:${issueGuideWordCount(guide)}w:${guide.sources.length}s`);
    expect(failures, failures.join("\n")).toEqual([]);
  });
});
