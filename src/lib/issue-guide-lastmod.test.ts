import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { IssueGuide } from "@/data/issue-guides";
import { issueGuides } from "@/data/issue-guides";
import { issueGuideContentLastModified } from "@/lib/issue-guide-indexability";

const CURRENT_PATCH_SLUGS = [
  "texas-gun-laws",
  "texas-medical-transition-minors-law",
  "texas-bail-criminal-justice",
  "texas-rural-healthcare",
  "texas-local-preemption-home-rule",
] as const;

const CURRENT_PATCH_UPDATED_AT = "2026-09-03T04:08:30Z";
const BASE_UPDATED_AT = "2026-08-19T22:38:59Z";

describe("issue guide sitemap lastmod", () => {
  it("uses the September 3 content timestamp only for guides changed by the current-law patch", () => {
    for (const slug of CURRENT_PATCH_SLUGS) {
      const source = issueGuides.find((guide) => guide.slug === slug);
      if (!source) throw new Error(`Missing issue guide fixture: ${slug}`);
      expect(issueGuideContentLastModified(structuredClone(source))).toBe(CURRENT_PATCH_UPDATED_AT);
    }
  });

  it("keeps an untouched guide on the truthful base-content timestamp", () => {
    const untouched: IssueGuide = {
      slug: "synthetic-untouched-guide",
      category: "Test",
      title: "Synthetic untouched guide",
      dek: "Synthetic fixture used only to verify sitemap freshness behavior.",
      quickAnswer: "Synthetic fixture used only to verify sitemap freshness behavior without matching any upgrade wave.",
      sections: [],
      sources: [],
      relatedSlugs: [],
    };

    expect(issueGuideContentLastModified(untouched)).toBe(BASE_UPDATED_AT);
  });

  it("derives detail-page lastmod from the hydration pipeline instead of blanket refresh dates", () => {
    const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
    expect(sitemapSource).toContain("issueGuideContentLastModified");
    expect(sitemapSource).toContain("toIsoDate(issueGuideContentLastModified(guide))");
    expect(sitemapSource).not.toContain("[`/issues/${guide.slug}`, ISSUE_GUIDE_REFRESH]");
  });
});
