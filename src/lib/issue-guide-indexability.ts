import type { IssueGuide } from "@/data/issue-guides";
import { applyPriorityIssueGuideUpgrade } from "@/data/issue-guide-priority-upgrades";

export const MIN_ISSUE_GUIDE_WORDS = 1000;

const hydratedPriorityGuides = new WeakSet<IssueGuide>();

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hydratePriorityIssueGuide(guide: IssueGuide) {
  if (hydratedPriorityGuides.has(guide)) return guide;
  const upgraded = applyPriorityIssueGuideUpgrade(guide);
  if (upgraded !== guide) guide.sections = upgraded.sections;
  hydratedPriorityGuides.add(guide);
  return guide;
}

export function issueGuideWordCount(guide: IssueGuide) {
  const publicationGuide = hydratePriorityIssueGuide(guide);
  return words([
    publicationGuide.title,
    publicationGuide.dek,
    publicationGuide.quickAnswer,
    ...publicationGuide.sections.flatMap((section) => [section.heading, ...section.body]),
  ].join(" "));
}

export function isIssueGuideIndexable(guide: IssueGuide | null | undefined): guide is IssueGuide {
  if (!guide) return false;
  const publicationGuide = hydratePriorityIssueGuide(guide);
  return issueGuideWordCount(publicationGuide) >= MIN_ISSUE_GUIDE_WORDS
    && publicationGuide.sections.length >= 4
    && publicationGuide.sources.length >= 3
    && words(publicationGuide.quickAnswer) >= 25;
}
