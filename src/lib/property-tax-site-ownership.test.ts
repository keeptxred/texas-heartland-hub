import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { isIssueGuideIndexable, issueGuideContentLastModified } from "@/lib/issue-guide-indexability";
import { canonicalInternalRedirectHref } from "@/lib/canonical-internal-redirects";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const migratedStaticSlugs = [
  "texas-property-tax-guide",
  "homestead-exemption-explained",
  "appraisal-protest-playbook",
  "county-appraisal-districts-explained",
] as const;

const routeTargets = [
  ["src/routes/property-taxes.tsx", "https://texasdefined.com/learn/property-taxes"],
  ["src/routes/texas.property-taxes-2026.tsx", "https://texasdefined.com/learn/property-taxes"],
  ["src/routes/news.texas-property-tax-guide.tsx", "https://texasdefined.com/learn/property-taxes"],
  ["src/routes/news.homestead-exemption-explained.tsx", "https://texasdefined.com/do/homestead-exemption"],
  ["src/routes/news.appraisal-protest-playbook.tsx", "https://texasdefined.com/do/property-tax-protest"],
  ["src/routes/news.county-appraisal-districts-explained.tsx", "https://texasdefined.com/learn/appraisal-districts"],
] as const;

describe("property-tax site ownership", () => {
  it("sends homeowner property-tax routes directly to TexasDefined", () => {
    for (const [file, target] of routeTargets) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain(target);
      expect(source).toContain("statusCode: 301");
    }
  });

  it("canonicalizes internal homeowner links to TexasDefined", () => {
    expect(canonicalInternalRedirectHref("/property-taxes")).toBe("https://texasdefined.com/learn/property-taxes");
    expect(canonicalInternalRedirectHref("/news/texas-property-tax-guide?src=ktr")).toBe("https://texasdefined.com/learn/property-taxes?src=ktr");
    expect(canonicalInternalRedirectHref("/news/homestead-exemption-explained")).toBe("https://texasdefined.com/do/homestead-exemption");
    expect(canonicalInternalRedirectHref("/news/appraisal-protest-playbook")).toBe("https://texasdefined.com/do/property-tax-protest");
    expect(canonicalInternalRedirectHref("/news/county-appraisal-districts-explained")).toBe("https://texasdefined.com/learn/appraisal-districts");
  });

  it("removes migrated homeowner articles from KTR sitemap and listing indexability", () => {
    for (const slug of migratedStaticSlugs) {
      expect(isStaticArticleIndexable({ slug, pillar: false })).toBe(false);
    }
  });

  it("keeps the KTR property-tax issue guide indexable but explicitly policy-owned", () => {
    const source = issueGuides.find((guide) => guide.slug === "texas-property-tax-relief");
    if (!source) throw new Error("Missing texas-property-tax-relief guide");
    const guide = structuredClone(source);

    expect(isIssueGuideIndexable(guide)).toBe(true);
    expect(guide.title).toContain("Policy & Relief");
    expect(guide.dek).toContain("Practical homeowner tools and filing guidance live on TexasDefined");
    expect(guide.quickAnswer).toContain("Practical homeowner questions");
    expect(guide.sections[0]?.heading).toBe("KTR covers policy; TexasDefined covers homeowner tasks");
    expect(issueGuideContentLastModified(guide).slice(0, 10)).toBe("2026-09-17");
  });
});
