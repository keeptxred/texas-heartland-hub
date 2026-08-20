import type { IssueGuide } from "@/data/issue-guides";

export const MIN_ISSUE_GUIDE_WORDS = 1000;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function issueGuideWordCount(guide: IssueGuide) {
  return words([guide.title, guide.dek, guide.quickAnswer, ...guide.sections.flatMap((section) => [section.heading, ...section.body])].join(" "));
}

export function isIssueGuideIndexable(guide: IssueGuide | null | undefined): guide is IssueGuide {
  return Boolean(guide)
    && issueGuideWordCount(guide!) >= MIN_ISSUE_GUIDE_WORDS
    && guide!.sections.length >= 4
    && guide!.sources.length >= 3
    && words(guide!.quickAnswer) >= 25;
}
