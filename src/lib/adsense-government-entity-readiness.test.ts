import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";
import { getPublicationGovernmentEntities } from "@/lib/government-entity-publication";
import { governmentEntityWordCount, isGovernmentEntityIndexable, MIN_GOVERNMENT_ENTITY_WORDS } from "@/lib/government-entity-indexability";

const routeSource = fs.readFileSync(new URL("../routes/texas-government.$entitySlug.tsx", import.meta.url), "utf8");
const sitemapSource = fs.readFileSync(new URL("../routes/sitemap-government[.]xml.ts", import.meta.url), "utf8");
const expandedEntities = getPublicationGovernmentEntities(GOVERNMENT_ENTITIES);

const WAVE_TWO_SLUGS = [
  "agriculture-commissioner",
  "land-commissioner",
  "railroad-commission",
  "state-board-of-education",
  "supreme-court",
  "court-of-criminal-appeals",
] as const;

describe("AdSense government entity indexability", () => {
  it("keeps the canonical 700-word authority threshold", () => {
    expect(MIN_GOVERNMENT_ENTITY_WORDS).toBe(700);
    expect(GOVERNMENT_ENTITIES.length).toBe(15);
  });

  it.each(WAVE_TWO_SLUGS)("makes expanded authority page %s genuinely index-ready", (slug) => {
    const entity = expandedEntities.find((candidate) => candidate.slug === slug);
    expect(entity, `${slug}: missing government entity`).toBeDefined();
    expect(governmentEntityWordCount(entity!), `${slug}: substantive word count`).toBeGreaterThanOrEqual(MIN_GOVERNMENT_ENTITY_WORDS);
    expect(isGovernmentEntityIndexable(entity!)).toBe(true);
  });

  it("keeps every permanent government authority page above the readiness gate", () => {
    expect(expandedEntities).toHaveLength(15);
    const failures = expandedEntities
      .filter((entity) => !isGovernmentEntityIndexable(entity))
      .map((entity) => `${entity.slug}: ${governmentEntityWordCount(entity)} words`);
    expect(failures, failures.join("\n")).toEqual([]);
  });

  it("uses publication records and readiness for direct-route robots metadata", () => {
    expect(routeSource).toContain("getPublicationGovernmentEntity(baseEntity)");
    expect(routeSource).toContain("isGovernmentEntityIndexable(entity)");
    expect(routeSource).toContain('"noindex,follow"');
    expect(routeSource).toContain("max-image-preview:large");
  });

  it("keeps the government hub while sitemap detail URLs use the publication-ready cohort", () => {
    expect(sitemapSource).toContain("getPublicationGovernmentEntities(GOVERNMENT_ENTITIES).filter(isGovernmentEntityIndexable)");
    expect(sitemapSource).toContain('`${BASE_URL}/texas-government`');
    expect(sitemapSource).toContain("...INDEXABLE_GOVERNMENT_ENTITIES.map((entity) => ({");
    expect(sitemapSource).not.toContain("...GOVERNMENT_ENTITIES.map((entity) => ({");
  });
});