import { issueGuides, type IssueGuide } from "@/data/issue-guides";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import type { PolicyTracker } from "@/data/policy-trackers";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";

const STOP_WORDS = new Set([
  "texas",
  "policy",
  "tracker",
  "track",
  "current",
  "state",
  "guide",
  "guides",
  "issue",
  "issues",
  "what",
  "does",
  "with",
  "from",
  "that",
  "this",
  "more",
]);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function issueGuideText(guide: IssueGuide) {
  return normalize([
    guide.slug,
    guide.category,
    guide.title,
    guide.dek,
    guide.quickAnswer,
    ...guide.sections.flatMap((section) => [section.heading, ...section.body]),
  ].join(" "));
}

function trackerText(tracker: PolicyTracker) {
  return normalize([
    tracker.slug,
    tracker.shortTitle,
    tracker.title,
    tracker.description,
    tracker.quickAnswer,
    tracker.currentStatus,
    ...tracker.keyFacts,
    ...tracker.context,
    ...tracker.watchFor,
    ...tracker.keywords,
  ].join(" "));
}

function meaningfulTitleTokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 5 && !STOP_WORDS.has(token));
}

function keywordScore(keyword: string, text: string) {
  const normalized = normalize(keyword);
  if (!normalized || !text.includes(normalized)) return 0;
  return normalized.includes(" ") ? 5 : normalized.length >= 7 ? 2 : 1;
}

export function scoreIssueGuideForTracker(tracker: PolicyTracker, guide: IssueGuide) {
  const guideText = issueGuideText(guide);
  const keywordPoints = tracker.keywords.reduce((score, keyword) => score + keywordScore(keyword, guideText), 0);
  const titlePoints = meaningfulTitleTokens(tracker.shortTitle).reduce(
    (score, token) => score + (guideText.includes(token) ? 2 : 0),
    0,
  );
  return keywordPoints + titlePoints;
}

export function relatedIssueGuidesForTracker(tracker: PolicyTracker, limit = 3) {
  return issueGuides
    .filter((guide) => isIssueGuideIndexable(guide))
    .map((guide) => ({ guide, score: scoreIssueGuideForTracker(tracker, guide) }))
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score || a.guide.title.localeCompare(b.guide.title))
    .slice(0, limit)
    .map(({ guide }) => guide);
}

export function scorePolicyTrackerForIssueGuide(guide: IssueGuide, tracker: PolicyTracker) {
  const guideText = issueGuideText(guide);
  const trackerSearchText = trackerText(tracker);
  const keywordPoints = tracker.keywords.reduce((score, keyword) => score + keywordScore(keyword, guideText), 0);
  const issueTitleTokens = meaningfulTitleTokens(guide.title);
  const reverseTitlePoints = issueTitleTokens.reduce(
    (score, token) => score + (trackerSearchText.includes(token) ? 1 : 0),
    0,
  );
  return keywordPoints + reverseTitlePoints;
}

export function relatedPolicyTrackersForIssueGuide(guide: IssueGuide, limit = 4) {
  return ALL_POLICY_TRACKERS
    .filter((tracker) => isPolicyTrackerIndexable(tracker))
    .map((tracker) => ({ tracker, score: scorePolicyTrackerForIssueGuide(guide, tracker) }))
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score || a.tracker.title.localeCompare(b.tracker.title))
    .slice(0, limit)
    .map(({ tracker }) => tracker);
}
