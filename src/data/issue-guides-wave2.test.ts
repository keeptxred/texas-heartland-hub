import { describe, expect, it } from "vitest";
import { issueGuideBySlug, issueGuides } from "@/data/issue-guides";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import {
  relatedPolicyTrackersForIssueGuide,
  scorePolicyTrackerForIssueGuide,
} from "@/lib/issue-policy-links";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";

const WAVE2_SLUGS = [
  "texas-abortion-law-pro-life-policy",
  "texas-bail-criminal-justice",
  "texas-rural-healthcare",
  "texas-local-preemption-home-rule",
] as const;

describe("evergreen issue guides wave 2", () => {
  it("registers each guide exactly once with substantive source-backed content", () => {
    for (const slug of WAVE2_SLUGS) {
      const guide = issueGuideBySlug[slug];
      expect(guide).toBeDefined();
      expect(issueGuides.filter((candidate) => candidate.slug === slug)).toHaveLength(1);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.sources.length).toBeGreaterThanOrEqual(3);
      expect(guide.quickAnswer.length).toBeGreaterThan(180);
      expect(guide.relatedSlugs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("connects only indexable current-status policy trackers while preserving semantic matches", () => {
    const abortion = relatedPolicyTrackersForIssueGuide(issueGuideBySlug["texas-abortion-law-pro-life-policy"])
      .map((tracker) => tracker.slug);
    expect(abortion).toContain("life-abortion");

    const ruralGuide = issueGuideBySlug["texas-rural-healthcare"];
    const ruralSemanticMatches = ALL_POLICY_TRACKERS
      .map((tracker) => ({ tracker, score: scorePolicyTrackerForIssueGuide(ruralGuide, tracker) }))
      .filter(({ score }) => score >= 3);
    const ruralPublicMatches = relatedPolicyTrackersForIssueGuide(ruralGuide);

    expect(ruralSemanticMatches.length).toBeGreaterThan(0);
    expect(ruralPublicMatches.every((tracker) => isPolicyTrackerIndexable(tracker))).toBe(true);
    expect(ruralPublicMatches.map((tracker) => tracker.slug)).toEqual(
      ruralSemanticMatches
        .filter(({ tracker }) => isPolicyTrackerIndexable(tracker))
        .sort((a, b) => b.score - a.score || a.tracker.title.localeCompare(b.tracker.title))
        .slice(0, 4)
        .map(({ tracker }) => tracker.slug),
    );
  });
});
