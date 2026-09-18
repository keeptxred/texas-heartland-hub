import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { issueGuides } from "@/data/issue-guides";
import { ARTICLE_BODIES } from "@/data/article-bodies";
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

  it("keeps active KTR discovery surfaces out of homeowner property-tax ownership", () => {
    const dataPanel = readFileSync("src/components/property-tax-data-panel.tsx", "utf8");
    expect(dataPanel).toContain("https://texasdefined.com/decide/property-taxes");
    expect(dataPanel).not.toContain("County-rate calculator");
    expect(dataPanel).not.toContain("countyOnlyEstimate");

    const lawsHub = readFileSync("src/routes/laws.index.tsx", "utf8");
    expect(lawsHub).toContain("texas-property-tax-laws-explained");
    expect(lawsHub).not.toContain('"homestead-exemption-explained"');
    expect(lawsHub).not.toContain('"appraisal-protest-playbook"');

    const lawRegistry = readFileSync("src/lib/law-guides-core.ts", "utf8");
    expect(lawRegistry).not.toContain('{ slug: "homestead-exemption-explained", topic: "property-tax"');
    expect(lawRegistry).not.toContain('{ slug: "appraisal-protest-playbook", topic: "property-tax"');

    const business = readFileSync("src/components/texas-business-view.tsx", "utf8");
    expect(business).toContain('"texas-property-tax-laws-explained"');
    expect(business).not.toContain('"county-appraisal-districts-explained"');
  });

  it("links practical homeowner references directly to TexasDefined", () => {
    const glossary = readFileSync("src/routes/glossary.tsx", "utf8");
    expect(glossary).toContain("https://texasdefined.com/learn/appraisal-districts");
    expect(glossary).toContain("https://texasdefined.com/do/homestead-exemption");

    const agriculture = readFileSync("src/data/supporting-guides-agriculture.ts", "utf8");
    expect(agriculture).toContain("https://texasdefined.com/learn/property-taxes");

    const lawTopic = readFileSync("src/data/law-topic-property-tax-authority.ts", "utf8");
    expect(lawTopic).toContain("https://texasdefined.com/decide/property-taxes");
    expect(lawTopic).not.toContain('{ label: "Property Tax Calculator", href: "/tools/property-tax-calculator" }');
  });

  it("keeps the KTR property-tax law article policy-scoped", () => {
    const source = readFileSync("src/data/article-bodies.ts", "utf8");
    const start = source.indexOf('  "texas-property-tax-laws-explained": {');
    const end = source.indexOf('\n  "texas-election-laws-explained": {', start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const block = source.slice(start, end);

    expect(block).toContain("/issues/texas-property-tax-relief");
    expect(block).toContain("https://texasdefined.com/learn/property-taxes");
    expect(block).toContain("https://texasdefined.com/do/homestead-exemption");
    expect(block).toContain("https://texasdefined.com/do/property-tax-protest");
    expect(block).toContain("https://texasdefined.com/learn/appraisal-districts");
    expect(block).toContain("https://texasdefined.com/decide/property-taxes");
    expect(block).not.toContain("/news/texas-property-tax-guide");
    expect(block).not.toContain("/news/homestead-exemption-explained");
    expect(block).not.toContain("/news/appraisal-protest-playbook");
    expect(block).not.toContain("/news/county-appraisal-districts-explained");
    expect(block).not.toContain("/tax-calculator");
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
  it("keeps active KTR property-tax authority surfaces policy-scoped", () => {
    const policyBody = ARTICLE_BODIES["texas-property-tax-laws-explained"];
    if (!policyBody) throw new Error("Missing texas-property-tax-laws-explained body");
    const policyText = JSON.stringify(policyBody);

    expect(policyText).toContain("KTR follows changes to the statewide legal framework");
    expect(policyText).toContain("https://texasdefined.com/learn/property-taxes");
    expect(policyText).toContain("https://texasdefined.com/do/homestead-exemption");
    expect(policyText).toContain("https://texasdefined.com/do/property-tax-protest");
    expect(policyText).toContain("https://texasdefined.com/learn/appraisal-districts");
    expect(policyText).toContain("https://texasdefined.com/decide/property-taxes");

    for (const slug of migratedStaticSlugs) {
      expect(policyBody.related ?? []).not.toContain(slug);
    }

    const lawsHub = readFileSync("src/routes/laws.index.tsx", "utf8");
    expect(lawsHub).not.toContain('"homestead-exemption-explained"');
    expect(lawsHub).not.toContain('"appraisal-protest-playbook"');

    const lawRegistry = readFileSync("src/lib/law-guides-core.ts", "utf8");
    expect(lawRegistry).not.toContain('{ slug: "homestead-exemption-explained", topic: "property-tax"');
    expect(lawRegistry).not.toContain('{ slug: "appraisal-protest-playbook", topic: "property-tax"');

    const businessHub = readFileSync("src/components/texas-business-view.tsx", "utf8");
    expect(businessHub).not.toContain('"county-appraisal-districts-explained"');
    expect(businessHub).toContain('"texas-property-tax-laws-explained"');
  });

  it("keeps homeowner calculation UI off KTR property-tax data authority", () => {
    const source = readFileSync("src/components/property-tax-data-panel.tsx", "utf8");
    expect(source).toContain("https://texasdefined.com/decide/property-taxes");
    expect(source).toContain("TexasDefined owns household property-tax calculators");
    expect(source).not.toContain("County-rate calculator");
    expect(source).not.toContain("taxableValue");
    expect(source).not.toContain("countyOnlyEstimate");
  });

  it("links practical glossary and law-topic actions directly to TexasDefined", () => {
    const glossary = readFileSync("src/routes/glossary.tsx", "utf8");
    expect(glossary).toContain("https://texasdefined.com/learn/appraisal-districts");
    expect(glossary).toContain("https://texasdefined.com/do/homestead-exemption");

    const topic = readFileSync("src/data/law-topic-property-tax-authority.ts", "utf8");
    expect(topic).toContain('{ label: "TexasDefined Property Tax Tools", href: "https://texasdefined.com/decide/property-taxes" }');
    expect(topic).not.toContain('{ label: "Property Tax Calculator", href: "/tools/property-tax-calculator" }');
  });

});
