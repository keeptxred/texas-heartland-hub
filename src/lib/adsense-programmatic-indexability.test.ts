import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { PRIORITY_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-priority-upgrades";
import { WAVE2_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave2-upgrades";
import { WAVE3_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave3-upgrades";
import { WAVE4_ISSUE_GUIDE_SLUGS } from "@/data/issue-guide-wave4-upgrades";
import { ALL_POLICY_TRACKERS, getAnyPolicyTracker } from "@/data/policy-trackers-all";
import { PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-upgrades";
import { WAVE2_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave2-upgrades";
import { WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave3-upgrades";
import { WAVE4_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave4-upgrades";
import { WAVE5_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave5-upgrades";
import { WAVE6_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave6-upgrades";
import { WAVE7_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave7-upgrades";
import { WAVE8_INDEXABLE_POLICY_TRACKER_SLUGS } from "@/data/policy-tracker-wave8-upgrades";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";

const sitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const issueRoute = fs.readFileSync(new URL("../routes/issues/$slug.tsx", import.meta.url), "utf8");
const policyRoute = fs.readFileSync(new URL("../routes/policy.$slug.tsx", import.meta.url), "utf8");
const referenceRoute = fs.readFileSync(new URL("../routes/texas-political-reference.$slug.tsx", import.meta.url), "utf8");

const EXPECTED_INDEXABLE_POLICY_TRACKER_SLUGS = [
  ...PRIORITY_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE2_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE3_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE4_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE5_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE6_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE7_INDEXABLE_POLICY_TRACKER_SLUGS,
  ...WAVE8_INDEXABLE_POLICY_TRACKER_SLUGS,
  "social-media-viewpoint-moderation",
];

describe("AdSense programmatic indexability", () => {
  it("indexes every deliberately expanded issue guide while keeping other thin collections quarantined", () => {
    expect(
      issueGuides.filter(isIssueGuideIndexable).map((guide) => guide.slug).sort(),
    ).toEqual([
      ...PRIORITY_ISSUE_GUIDE_SLUGS,
      ...WAVE2_ISSUE_GUIDE_SLUGS,
      ...WAVE3_ISSUE_GUIDE_SLUGS,
      ...WAVE4_ISSUE_GUIDE_SLUGS,
    ].sort());
    expect(
      ALL_POLICY_TRACKERS.filter(isPolicyTrackerIndexable).map((tracker) => tracker.slug).sort(),
    ).toEqual([...EXPECTED_INDEXABLE_POLICY_TRACKER_SLUGS].sort());
    expect(POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable)).toHaveLength(0);
  });

  it("resolves every policy tracker through the complete multi-wave registry", () => {
    expect(ALL_POLICY_TRACKERS.length).toBeGreaterThan(1);
    for (const tracker of ALL_POLICY_TRACKERS) expect(getAnyPolicyTracker(tracker.slug)?.slug).toBe(tracker.slug);
    expect(policyRoute).toContain('getAnyPolicyTracker(params.slug)');
    expect(policyRoute).not.toContain('getPolicyTracker(params.slug)');
  });

  it("uses readiness for direct-route robots metadata", () => {
    expect(issueRoute).toContain("isIssueGuideIndexable(guide)");
    expect(policyRoute).toContain("isPolicyTrackerIndexable(loaderData.tracker)");
    expect(referenceRoute).toContain("isPoliticalReferenceIndexable(loaderData.guide)");
    expect(issueRoute).toContain('"noindex,follow"');
    expect(policyRoute).toContain('"noindex,follow"');
    expect(referenceRoute).toContain('"noindex,follow"');
  });

  it("uses the same filtered collections in sitemap-pages and preserves guide gating", () => {
    expect(sitemap).toContain("INDEXABLE_ISSUE_GUIDES");
    expect(sitemap).toContain("INDEXABLE_POLICY_TRACKERS");
    expect(sitemap).toContain("INDEXABLE_POLITICAL_SEARCH_GUIDES");
    expect(sitemap).toContain("INDEXABLE_GUIDES");
    expect(sitemap).toContain("Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable)");
    expect(sitemap).not.toContain("...issueGuides.map((guide)=>`/issues/${guide.slug}`)");
    expect(sitemap).not.toContain("...ALL_POLICY_TRACKERS.map((tracker)=>`/policy/${tracker.slug}`)");
    expect(sitemap).not.toContain("...POLITICAL_SEARCH_GUIDES.map((guide)=>`/texas-political-reference/${guide.slug}`)");
  });
});
