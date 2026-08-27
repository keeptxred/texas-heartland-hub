import { describe, expect, it } from "vitest";
import { issueGuideBySlug, issueGuides } from "@/data/issue-guides";
import { relatedPolicyTrackersForIssueGuide } from "@/lib/issue-policy-links";
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
      if (!guide) throw new Error(`missing issue guide ${slug}`);
      expect(issueGuides.filter((candidate) => candidate.slug === slug)).toHaveLength(1);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.sources.length).toBeGreaterThanOrEqual(3);
      expect(guide.quickAnswer.length).toBeGreaterThan(180);
      expect(guide.relatedSlugs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("connects new evergreen guides only to current-status policy trackers that are indexable", () => {
    const abortionGuide = issueGuideBySlug["texas-abortion-law-pro-life-policy"];
    const ruralHealthcareGuide = issueGuideBySlug["texas-rural-healthcare"];
    if (!abortionGuide) throw new Error("missing texas-abortion-law-pro-life-policy issue guide");
    if (!ruralHealthcareGuide) throw new Error("missing texas-rural-healthcare issue guide");

    const abortion = relatedPolicyTrackersForIssueGuide(abortionGuide);
    expect(abortion.map((tracker) => tracker.slug)).toContain("life-abortion");
    expect(abortion.every(isPolicyTrackerIndexable)).toBe(true);

    const ruralHealthcare = relatedPolicyTrackersForIssueGuide(ruralHealthcareGuide);
    expect(ruralHealthcare.every(isPolicyTrackerIndexable)).toBe(true);
  });
});
