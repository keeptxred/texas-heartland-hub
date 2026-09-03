import type { IssueGuide } from "@/data/issue-guides";
import { applyPriorityIssueGuideUpgrade } from "@/data/issue-guide-priority-upgrades";
import { applyWave2IssueGuideUpgrade } from "@/data/issue-guide-wave2-upgrades";
import { applyWave3IssueGuideUpgrade } from "@/data/issue-guide-wave3-upgrades";
import { applyWave3DepthPatch } from "@/data/issue-guide-wave3-depth-patches";
import { applyWave4IssueGuideUpgrade } from "@/data/issue-guide-wave4-upgrades";
import { applyWave4CurrentPatch } from "@/data/issue-guide-wave4-current-patches";

export const MIN_ISSUE_GUIDE_WORDS = 1000;

const ISSUE_GUIDE_BASE_UPDATED_AT = "2026-08-19T22:38:59Z";
const ISSUE_GUIDE_PRIORITY_UPDATED_AT = "2026-08-21T17:27:05Z";
const ISSUE_GUIDE_WAVE2_UPDATED_AT = "2026-08-21T21:37:27Z";
const ISSUE_GUIDE_WAVE3_UPDATED_AT = "2026-08-21T21:52:15Z";
const ISSUE_GUIDE_WAVE4_UPDATED_AT = "2026-08-25T16:12:08Z";
const ISSUE_GUIDE_CURRENT_PATCH_UPDATED_AT = "2026-09-03T04:08:30Z";

const hydratedGuides = new WeakSet<IssueGuide>();
const guideLastModified = new WeakMap<IssueGuide, string>();

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hydrateIssueGuide(guide: IssueGuide) {
  if (hydratedGuides.has(guide)) return guide;

  let lastModified = ISSUE_GUIDE_BASE_UPDATED_AT;

  const priorityUpgraded = applyPriorityIssueGuideUpgrade(guide);
  if (priorityUpgraded !== guide) lastModified = ISSUE_GUIDE_PRIORITY_UPDATED_AT;

  const wave2Upgraded = applyWave2IssueGuideUpgrade(priorityUpgraded);
  if (wave2Upgraded !== priorityUpgraded) lastModified = ISSUE_GUIDE_WAVE2_UPDATED_AT;

  const wave3Upgraded = applyWave3IssueGuideUpgrade(wave2Upgraded);
  if (wave3Upgraded !== wave2Upgraded) lastModified = ISSUE_GUIDE_WAVE3_UPDATED_AT;

  const wave3Patched = applyWave3DepthPatch(wave3Upgraded);
  if (wave3Patched !== wave3Upgraded) lastModified = ISSUE_GUIDE_WAVE3_UPDATED_AT;

  const wave4Upgraded = applyWave4IssueGuideUpgrade(wave3Patched);
  if (wave4Upgraded !== wave3Patched) lastModified = ISSUE_GUIDE_WAVE4_UPDATED_AT;

  const currentWave4 = applyWave4CurrentPatch(wave4Upgraded);
  if (currentWave4 !== wave4Upgraded) lastModified = ISSUE_GUIDE_CURRENT_PATCH_UPDATED_AT;

  if (currentWave4 !== guide) {
    guide.sections = currentWave4.sections;
    guide.sources = currentWave4.sources;
  }
  guideLastModified.set(guide, lastModified);
  hydratedGuides.add(guide);
  return guide;
}

export function issueGuideContentLastModified(guide: IssueGuide) {
  hydrateIssueGuide(guide);
  return guideLastModified.get(guide) ?? ISSUE_GUIDE_BASE_UPDATED_AT;
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