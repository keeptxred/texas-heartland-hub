import type { IssueGuide } from "@/data/issue-guides";

export const MIN_ISSUE_GUIDE_WORDS = 1000;
export const MIN_ISSUE_GUIDE_SECTIONS = 4;
export const MIN_ISSUE_GUIDE_SOURCES = 3;
export const MIN_ISSUE_GUIDE_QUICK_ANSWER_WORDS = 25;

export function issueGuideWordCount(guide: IssueGuide): number {
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

export function isIssueGuideIndexable(guide: IssueGuide | null | undefined): guide is IssueGuide {
  if (!guide) return false;
  return issueGuideWordCount(guide) >= MIN_ISSUE_GUIDE_WORDS
    && guide.sections.length >= MIN_ISSUE_GUIDE_SECTIONS
    && guide.sources.length >= MIN_ISSUE_GUIDE_SOURCES
    && guide.quickAnswer.trim().split(/\s+/).filter(Boolean).length >= MIN_ISSUE_GUIDE_QUICK_ANSWER_WORDS;
}
