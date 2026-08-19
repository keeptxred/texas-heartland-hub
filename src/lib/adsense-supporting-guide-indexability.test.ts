import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { SUPPORTING_GUIDES } from "@/data/all-guides";
import {
  MIN_SUPPORTING_GUIDE_WORDS,
  isSupportingGuideIndexable,
  supportingGuideWordCount,
} from "@/lib/supporting-guide-indexability";

const guideRoute = fs.readFileSync(new URL("../routes/guides.$slug.tsx", import.meta.url), "utf8");
const pageSitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

describe("AdSense supporting guide indexability", () => {
  it("requires substantial depth in addition to existing sourcing and FAQ structure", () => {
    expect(MIN_SUPPORTING_GUIDE_WORDS).toBe(1200);
    for (const guide of Object.values(SUPPORTING_GUIDES)) {
      if (supportingGuideWordCount(guide) < MIN_SUPPORTING_GUIDE_WORDS) {
        expect(isSupportingGuideIndexable(guide)).toBe(false);
      }
    }
  });

  it("noindexes unready supporting guides while keeping them accessible", () => {
    expect(guideRoute).toContain("SUPPORTING_GUIDES[guide.slug]");
    expect(guideRoute).toContain("isSupportingGuideIndexable(supportingGuide)");
    expect(guideRoute).toContain('content: "noindex,follow"');
    expect(guideRoute).toContain("CornerstoneGuidePage");
  });

  it("advertises only indexable supporting guides in the pages sitemap", () => {
    expect(pageSitemap).toContain("Object.values(SUPPORTING_GUIDES).filter(isSupportingGuideIndexable)");
    expect(pageSitemap).toContain("INDEXABLE_SUPPORTING_GUIDES.map((guide)=>`/guides/${guide.slug}`)");
    expect(pageSitemap).not.toContain("SUPPORTING_GUIDE_SLUGS.map((slug)=>`/guides/${slug}`)");
  });

  it("currently keeps every known sub-1200-word supporting guide out of the index", () => {
    const unready = Object.values(SUPPORTING_GUIDES).filter((guide) => !isSupportingGuideIndexable(guide));
    expect(unready.length).toBeGreaterThan(0);
    expect(unready.every((guide) => supportingGuideWordCount(guide) < MIN_SUPPORTING_GUIDE_WORDS)).toBe(true);
  });
});
