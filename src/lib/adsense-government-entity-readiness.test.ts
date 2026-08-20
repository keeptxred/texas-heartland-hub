import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";
import { upgradeGovernmentEntities } from "@/lib/government-entity-upgrades";
import { governmentEntityWordCount, isGovernmentEntityIndexable, MIN_GOVERNMENT_ENTITY_WORDS } from "@/lib/government-entity-indexability";

const routeSource = fs.readFileSync(new URL("../routes/texas-government.$entitySlug.tsx", import.meta.url), "utf8");
const sitemapSource = fs.readFileSync(new URL("../routes/sitemap-government[.]xml.ts", import.meta.url), "utf8");
const expandedEntities = upgradeGovernmentEntities(GOVERNMENT_ENTITIES);

const WAVE_ONE_SLUGS = [
  "governor",
  "lieutenant-governor",
  "attorney-general",
  "comptroller",
  "secretary-of-state",
  "texas-legislature",
  "texas-house",
  "texas-senate",
  "speaker-of-the-house",
] as const;

describe("AdSense government entity indexability", () => {
  it("requires the same 700-word authority threshold", () => {
    expect(MIN_GOVERNMENT_ENTITY_WORDS).toBe(700);
    expect(GOVERNMENT_ENTITIES.length).toBe(15);
  });

  it.each(WAVE_ONE_SLUGS)("makes expanded authority page %s genuinely index-ready", (slug) => {
    const entity = expandedEntities.find((candidate) => candidate.slug === slug);
    expect(entity, `${slug}: missing government entity`).toBeDefined();
    expect(governmentEntityWordCount(entity!), `${slug}: substantive word count`).toBeGreaterThanOrEqual(MIN_GOVERNMENT_ENTITY_WORDS);
    expect(isGovernmentEntityIndexable(entity)).toBe(true);
  });

  it("leaves unexpanded entities behind the existing noindex gate", () => {
    const remaining = expandedEntities.filter((entity) => !WAVE_ONE_SLUGS.includes(entity.slug as (typeof WAVE_ONE_SLUGS)[number]));
    expect(remaining).toHaveLength(6);
    expect(remaining.filter(isGovernmentEntityIndexable)).toEqual([]);
  });

  it("uses expanded records and readiness for direct-route robots metadata", () => {
    expect(routeSource).toContain("upgradeGovernmentEntity(baseEntity)");
    expect(routeSource).toContain("isGovernmentEntityIndexable(entity)");
    expect(routeSource).toContain('"noindex,follow"');
    expect(routeSource).toContain("max-image-preview:large");
  });

  it("keeps the government hub while sitemap detail URLs use the expanded filtered cohort", () => {
    expect(sitemapSource).toContain("upgradeGovernmentEntities(GOVERNMENT_ENTITIES).filter(isGovernmentEntityIndexable)");
    expect(sitemapSource).toContain('`${BASE_URL}/texas-government`');
    expect(sitemapSource).toContain("...INDEXABLE_GOVERNMENT_ENTITIES.map((entity) => ({");
    expect(sitemapSource).not.toContain("...GOVERNMENT_ENTITIES.map((entity) => ({");
  });
});
