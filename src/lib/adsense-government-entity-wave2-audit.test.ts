import { describe, expect, it } from "vitest";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";
import { upgradeGovernmentEntities } from "@/lib/government-entity-upgrades";
import { governmentEntityWordCount, MIN_GOVERNMENT_ENTITY_WORDS } from "@/lib/government-entity-indexability";

const REMAINING_SLUGS = [
  "agriculture-commissioner",
  "land-commissioner",
  "railroad-commission",
  "state-board-of-education",
  "supreme-court",
  "court-of-criminal-appeals",
] as const;

describe("AdSense remaining government authority inventory", () => {
  it("reports the exact blockers for the six still-gated authority pages", () => {
    const entities = upgradeGovernmentEntities(GOVERNMENT_ENTITIES)
      .filter((entity) => REMAINING_SLUGS.includes(entity.slug as (typeof REMAINING_SLUGS)[number]));

    expect(entities).toHaveLength(REMAINING_SLUGS.length);

    const violations = entities.flatMap((entity) => {
      const blockers: string[] = [];
      const wordCount = governmentEntityWordCount(entity);
      if (wordCount < MIN_GOVERNMENT_ENTITY_WORDS) blockers.push(`words=${wordCount}<${MIN_GOVERNMENT_ENTITY_WORDS}`);
      if (entity.constitutionalBasis.length < 2) blockers.push(`basis=${entity.constitutionalBasis.length}<2`);
      if (entity.history.length < 3) blockers.push(`history=${entity.history.length}<3`);
      if (entity.powers.length < 4) blockers.push(`powers=${entity.powers.length}<4`);
      if (entity.limitations.length < 3) blockers.push(`limitations=${entity.limitations.length}<3`);
      if (entity.faqs.length < 4) blockers.push(`faqs=${entity.faqs.length}<4`);
      if (!entity.officialUrl.startsWith("https://")) blockers.push("officialUrl=invalid");
      return blockers.length ? [`${entity.slug}: ${blockers.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
