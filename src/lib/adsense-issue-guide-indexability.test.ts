import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import {
  MIN_ISSUE_GUIDE_WORDS,
  isIssueGuideIndexable,
  issueGuideWordCount,
} from "@/lib/issue-guide-indexability";

const issueRoute = fs.readFileSync(new URL("../routes/issues/$slug.tsx", import.meta.url), "utf8");
const pageSitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

describe("AdSense issue guide indexability", () => {
  it("requires substantive depth plus the established source and structure minimums", () => {
    expect(MIN_ISSUE_GUIDE_WORDS).toBe(1000);
    const unready = issueGuides.filter((guide) => !isIssueGuideIndexable(guide));
    expect(unready.length).toBeGreaterThan(0);
    expect(unready.every((guide) => issueGuideWordCount(guide) < MIN_ISSUE_GUIDE_WORDS || guide.sources.length < 3)).toBe(true);
  });

  it("noindexes valid-but-unready issue guides while retaining true not-found handling", () => {
    expect(issueRoute).toContain("isIssueGuideIndexable(guide)");
    expect(issueRoute).toContain('content: indexable ? "index,follow,max-image-preview:large" : "noindex,follow"');
    expect(issueRoute).toContain("if (!guide) throw notFound()");
  });

  it("advertises only indexable issue guides in sitemap-pages", () => {
    expect(pageSitemap).toContain("const INDEXABLE_ISSUE_GUIDES = issueGuides.filter(isIssueGuideIndexable)");
    expect(pageSitemap).toContain("INDEXABLE_ISSUE_GUIDES.map((guide)=>`/issues/${guide.slug}`)");
    expect(pageSitemap).not.toContain("issueGuides.map((guide)=>`/issues/${guide.slug}`)");
  });

  it("preserves the previously merged supporting-guide sitemap gate", () => {
    expect(pageSitemap).toContain("Object.values(SUPPORTING_GUIDES).filter(isSupportingGuideIndexable)");
    expect(pageSitemap).toContain("INDEXABLE_SUPPORTING_GUIDES.map((guide)=>`/guides/${guide.slug}`)");
  });
});
