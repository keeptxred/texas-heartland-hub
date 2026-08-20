import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { ALL_POLICY_TRACKERS, getAnyPolicyTracker } from "@/data/policy-trackers-all";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";

const sitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const issueRoute = fs.readFileSync(new URL("../routes/issues/$slug.tsx", import.meta.url), "utf8");
const policyRoute = fs.readFileSync(new URL("../routes/policy.$slug.tsx", import.meta.url), "utf8");
const referenceRoute = fs.readFileSync(new URL("../routes/texas-political-reference.$slug.tsx", import.meta.url), "utf8");

describe("AdSense programmatic indexability", () => {
  it("keeps current thin collections out of search until they are genuinely expanded", () => {
    expect(issueGuides.filter(isIssueGuideIndexable)).toHaveLength(0);
    expect(ALL_POLICY_TRACKERS.filter(isPolicyTrackerIndexable)).toHaveLength(0);
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

  it("uses the same filtered collections in sitemap-pages and preserves supporting-guide gating", () => {
    expect(sitemap).toContain("INDEXABLE_ISSUE_GUIDES");
    expect(sitemap).toContain("INDEXABLE_POLICY_TRACKERS");
    expect(sitemap).toContain("INDEXABLE_POLITICAL_SEARCH_GUIDES");
    expect(sitemap).toContain("INDEXABLE_SUPPORTING_GUIDES");
    expect(sitemap).not.toContain("...issueGuides.map((guide)=>`/issues/${guide.slug}`)");
    expect(sitemap).not.toContain("...ALL_POLICY_TRACKERS.map((tracker)=>`/policy/${tracker.slug}`)");
    expect(sitemap).not.toContain("...POLITICAL_SEARCH_GUIDES.map((guide)=>`/texas-political-reference/${guide.slug}`)");
  });
});
