import { describe, expect, it } from "vitest";
import { issueGuideBySlug, issueGuides } from "@/data/issue-guides";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import {
  relatedIssueGuidesForTracker,
  relatedPolicyTrackersForIssueGuide,
} from "@/lib/issue-policy-links";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";

describe("issue and policy reciprocal links", () => {
  it("connects the property-tax tracker to the broader property-tax issue guide", () => {
    const tracker = ALL_POLICY_TRACKERS.find((candidate) => candidate.slug === "property-taxes");
    expect(tracker).toBeDefined();
    expect(relatedIssueGuidesForTracker(tracker!).map((guide) => guide.slug)).toContain("texas-property-tax-relief");
  });

  it("connects the border issue guide back to the border-security tracker", () => {
    const guide = issueGuideBySlug["texas-border-security-operation-lone-star"];
    expect(guide).toBeDefined();
    expect(relatedPolicyTrackersForIssueGuide(guide).map((tracker) => tracker.slug)).toContain("border-security");
  });

  it("keeps generated related links bounded, duplicate-free, and indexable", () => {
    for (const tracker of ALL_POLICY_TRACKERS) {
      const guides = relatedIssueGuidesForTracker(tracker);
      expect(guides.length).toBeLessThanOrEqual(3);
      expect(new Set(guides.map((guide) => guide.slug)).size).toBe(guides.length);
    }

    for (const guide of issueGuides) {
      const trackers = relatedPolicyTrackersForIssueGuide(guide);
      expect(trackers.length).toBeLessThanOrEqual(4);
      expect(new Set(trackers.map((tracker) => tracker.slug)).size).toBe(trackers.length);
      expect(trackers.every(isPolicyTrackerIndexable)).toBe(true);
    }
  });
});
