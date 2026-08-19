import { describe, expect, it } from "vitest";
import { issueGuideBySlug, issueGuides } from "@/data/issue-guides";
import { relatedPolicyTrackersForIssueGuide } from "@/lib/issue-policy-links";

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

  it("connects new evergreen guides to current-status policy trackers where a matching tracker exists", () => {
    const abortion = relatedPolicyTrackersForIssueGuide(issueGuideBySlug["texas-abortion-law-pro-life-policy"])
      .map((tracker) => tracker.slug);
    expect(abortion).toContain("life-abortion");

    const ruralHealthcare = relatedPolicyTrackersForIssueGuide(issueGuideBySlug["texas-rural-healthcare"])
      .map((tracker) => tracker.slug);
    expect(ruralHealthcare.length).toBeGreaterThan(0);
  });
});
