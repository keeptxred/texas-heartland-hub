import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { WAVE4_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave4-upgrades";
import {
  isIssueGuideIndexable,
  issueGuideWordCount,
  MIN_ISSUE_GUIDE_WORDS,
} from "@/lib/issue-guide-indexability";

const wave4 = new Set(WAVE4_ISSUE_GUIDE_SLUGS);

function requireGuide(slug: string) {
  const guide = issueGuides.find((candidate) => candidate.slug === slug);
  expect(guide).toBeDefined();
  if (!guide) throw new Error(`Missing issue guide fixture: ${slug}`);
  return guide;
}

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
    const guide = requireGuide("texas-medical-transition-minors-law");
    expect(isIssueGuideIndexable(guide)).toBe(true);
    expect(guide.sources.length).toBeGreaterThanOrEqual(3);
    expect(guide.sources.some((source) => source.url.includes("txcourts.gov/media/1458813/230697.pdf"))).toBe(true);
  });

  it("preserves the current 2025-26 legal updates carried by the final wave", () => {
    const medical = requireGuide("texas-medical-transition-minors-law");
    const bail = requireGuide("texas-bail-criminal-justice");
    const rural = requireGuide("texas-rural-healthcare");
    const local = requireGuide("texas-local-preemption-home-rule");

    for (const guide of [medical, bail, rural, local]) {
      expect(isIssueGuideIndexable(guide)).toBe(true);
    }

    expect(medical.sections.some((section) => section.heading.includes("Subchapter Y"))).toBe(true);
    expect(medical.sources.some((source) => source.url.includes("HS.161.pdf"))).toBe(true);
    expect(bail.sections.some((section) => section.heading.includes("2025 Legislature and voters"))).toBe(true);
    expect(bail.sources.some((source) => source.url.includes("December52025"))).toBe(true);
    expect(rural.sources.some((source) => source.url.includes("0619is.pdf"))).toBe(true);
    expect(local.sections.some((section) => section.heading.includes("2025 and 2026"))).toBe(true);
    expect(local.sources.some((source) => source.url.includes("03-23-00531-CV"))).toBe(true);
  });

  it("leaves no issue guide below the publication-readiness contract", () => {
    const failures = issueGuides
      .filter((guide): boolean => !isIssueGuideIndexable(guide))
      .map((guide) => `${guide.slug}:${issueGuideWordCount(guide)}w:${guide.sources.length}s`);
    expect(failures, failures.join("\n")).toEqual([]);
  });
});