import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_FACTS } from "@/data/texas-case-facts";
import { isTexasCaseFactsIndexable, MIN_TEXAS_CASE_FACTS_WORDS } from "@/lib/texas-case-facts-indexability";

const routeSource = readFileSync(new URL("../routes/texas-case.facts.$slug.tsx", import.meta.url), "utf8");
const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

describe("AdSense Texas Case facts indexability", () => {
  it("keeps the current thin facts cohort out of standalone indexing", () => {
    expect(MIN_TEXAS_CASE_FACTS_WORDS).toBe(700);
    expect(TEXAS_CASE_FACTS.length).toBeGreaterThan(0);
    expect(TEXAS_CASE_FACTS.filter(isTexasCaseFactsIndexable)).toEqual([]);
  });

  it("uses the same readiness helper for route robots and sitemap discovery", () => {
    expect(routeSource).toContain('import { isTexasCaseFactsIndexable } from "@/lib/texas-case-facts-indexability"');
    expect(routeSource).toContain("isTexasCaseFactsIndexable(loaderData.facts)");
    expect(routeSource).toContain('"noindex,follow"');
    expect(sitemapSource).toContain('import { isTexasCaseFactsIndexable } from "@/lib/texas-case-facts-indexability"');
    expect(sitemapSource).toContain("const INDEXABLE_TEXAS_CASE_FACTS = TEXAS_CASE_FACTS.filter(isTexasCaseFactsIndexable)");
    expect(sitemapSource).toContain("...INDEXABLE_TEXAS_CASE_FACTS.map((facts)=>`/texas-case/facts/${facts.slug}`)");
    expect(sitemapSource).not.toContain("...TEXAS_CASE_FACTS.map((facts)=>`/texas-case/facts/${facts.slug}`)");
  });
});
