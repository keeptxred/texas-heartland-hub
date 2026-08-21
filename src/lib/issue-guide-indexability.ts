import type { IssueGuide } from "@/data/issue-guides";
import { applyPriorityIssueGuideUpgrade } from "@/data/issue-guide-priority-upgrades";
import { applyWave2IssueGuideUpgrade } from "@/data/issue-guide-wave2-upgrades";
import { applyWave3IssueGuideUpgrade } from "@/data/issue-guide-wave3-upgrades";
import { applyWave3DepthPatch } from "@/data/issue-guide-wave3-depth-patches";
import { applyWave4IssueGuideUpgrade } from "@/data/issue-guide-wave4-upgrades";

export const MIN_ISSUE_GUIDE_WORDS = 1000;

const hydratedGuides = new WeakSet<IssueGuide>();

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hydrateIssueGuide(guide: IssueGuide) {
  if (hydratedGuides.has(guide)) return guide;
  const priorityUpgraded = applyPriorityIssueGuideUpgrade(guide);
  const wave2Upgraded = applyWave2IssueGuideUpgrade(priorityUpgraded);
  const wave3Upgraded = applyWave3IssueGuideUpgrade(wave2Upgraded);
  const wave3Patched = applyWave3DepthPatch(wave3Upgraded);
  const wave4Upgraded = applyWave4IssueGuideUpgrade(wave3Patched);
  if (wave4Upgraded !== guide) {
    guide.sections = wave4Upgraded.sections;
    guide.sources = wave4Upgraded.sources;
  }
  hydratedGuides.add(guide);
  return guide;
}

export function issueGuideWordCount(guide: IssueGuide) {
  const publicationGuide = hydrateIssueGuide(guide);
  return words([
    publicationGuide.title,
    publicationGuide.dek,
    publicationGuide.quickAnswer,
    ...publicationGuide.sections.flatMap((section) => [section.heading, ...section.body]),
  ].join(" "));
}

export function isIssueGuideIndexable(guide: IssueGuide | null | undefined): guide is IssueGuide {
  if (!guide) return false;
  const publicationGuide = hydrateIssueGuide(guide);
  return issueGuideWordCount(publicationGuide) >= MIN_ISSUE_GUIDE_WORDS
    && publicationGuide.sections.length >= 4
    && publicationGuide.sources.length >= 3
    && words(publicationGuide.quickAnswer) >= 25;
}
