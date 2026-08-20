import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";
import { isGovernmentEntityIndexable, MIN_GOVERNMENT_ENTITY_WORDS } from "@/lib/government-entity-indexability";

const routeSource = fs.readFileSync(new URL("../routes/texas-government.$entitySlug.tsx", import.meta.url), "utf8");
const sitemapSource = fs.readFileSync(new URL("../routes/sitemap-government[.]xml.ts", import.meta.url), "utf8");

describe("AdSense government entity indexability", () => {
  it("keeps the current thin government entity cohort out of standalone indexing", () => {
    expect(MIN_GOVERNMENT_ENTITY_WORDS).toBe(700);
    expect(GOVERNMENT_ENTITIES.length).toBe(15);
    expect(GOVERNMENT_ENTITIES.filter(isGovernmentEntityIndexable)).toEqual([]);
  });

  it("uses readiness for direct-route robots metadata", () => {
    expect(routeSource).toContain("isGovernmentEntityIndexable(entity)");
    expect(routeSource).toContain('"noindex,follow"');
    expect(routeSource).toContain("max-image-preview:large");
  });

  it("keeps the government hub while sitemap detail URLs use the filtered cohort", () => {
    expect(sitemapSource).toContain("const INDEXABLE_GOVERNMENT_ENTITIES = GOVERNMENT_ENTITIES.filter(isGovernmentEntityIndexable)");
    expect(sitemapSource).toContain('`${BASE_URL}/texas-government`');
    expect(sitemapSource).toContain("...INDEXABLE_GOVERNMENT_ENTITIES.map((entity) => ({");
    expect(sitemapSource).not.toContain("...GOVERNMENT_ENTITIES.map((entity) => ({");
  });
});
