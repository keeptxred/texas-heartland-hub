import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { WAVE3_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave3-upgrades";
import {
  isIssueGuideIndexable,
  issueGuideWordCount,
  MIN_ISSUE_GUIDE_WORDS,
} from "@/lib/issue-guide-indexability";

const wave3 = new Set(WAVE3_ISSUE_GUIDE_SLUGS);

describe("AdSense third-wave issue-guide readiness", () => {
  it("makes exactly four third-wave issue guides publication-ready", () => {
    const failures = issueGuides
      .filter((guide) => wave3.has(guide.slug))
      .flatMap((guide) => {
        const blockers: string[] = [];
        const count = issueGuideWordCount(guide);
        if (count < MIN_ISSUE_GUIDE_WORDS) blockers.push(`words=${count}<${MIN_ISSUE_GUIDE_WORDS}`);
        if (guide.sections.length < 4) blockers.push(`sections=${guide.sections.length}<4`);
        if (guide.sources.length < 3) blockers.push(`sources=${guide.sources.length}<3`);
        if (!isIssueGuideIndexable(guide)) blockers.push("not-indexable");
        return blockers.length ? [`${guide.slug}: ${blockers.join(", ")}`] : [];
      });

    expect(WAVE3_ISSUE_GUIDE_SLUGS).toHaveLength(4);
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("adds a third official source to the DEI higher-education guide", () => {
    const guide = issueGuides.find((candidate) => candidate.slug === "texas-dei-higher-education");
    expect(guide).toBeDefined();
    expect(isIssueGuideIndexable(guide)).toBe(true);
    expect(guide!.sources.length).toBeGreaterThanOrEqual(3);
    expect(guide!.sources.some((source) => source.url.includes("/analysis/html/SB00017F.htm"))).toBe(true);
  });
});
