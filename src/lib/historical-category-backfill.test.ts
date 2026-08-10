import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { classifyContentPillar } from "./content-pillars";

const migration = readFileSync(
  "supabase/migrations/20260810145500_backfill_historical_article_categories.sql",
  "utf8",
);

describe("historical article category backfill", () => {
  it("does not treat an unrelated legacy Legislature label as a pillar signal", () => {
    expect(classifyContentPillar({
      title: "Service lapses on Houston light rail highlight growing pains for METRO",
      description: "Transit riders reported delays and service interruptions across Houston.",
      category: "Legislature",
    })).toBeNull();
  });

  it("reclassifies economic, public-safety, election, and legislative stories by subject", () => {
    expect(classifyContentPillar({
      title: "Buc-ee's expansion strategy brings new investment and jobs to Texas",
      description: "The retailer's expansion is expected to add jobs and economic activity.",
      category: "Legislature",
    })).toBe("texas-economy-small-business");

    expect(classifyContentPillar({
      title: "Dallas police warn drivers after rise in unsafe lane changes",
      description: "Police and public safety officials urged motorists to use extra caution.",
      category: "Legislature",
    })).toBe("texas-law-enforcement-public-safety");

    expect(classifyContentPillar({
      title: "Texas candidates prepare for early voting in statewide election",
      category: "Legislature",
    })).toBe("texas-elections");

    expect(classifyContentPillar({
      title: "Texas House committee advances new property-tax bill",
      category: "Legislature",
    })).toBe("texas-laws-legislature");
  });

  it("keeps the database sync idempotent and protects TexasDefined exclusions", () => {
    expect(migration).toContain("sync_historical_article_categories_from_pillars");
    expect(migration).toContain("d.category IS DISTINCT FROM public.legacy_article_category_for_pillar");
    expect(migration).toContain("classifier_version NOT LIKE '%texasdefined-excluded'");
    expect(migration).toContain("article_category_reclassification_log");
  });

  it("moves general and non-political pillar stories away from the Legislature legacy label", () => {
    expect(migration).toContain("WHEN 'texas-economy-small-business' THEN 'Non-Political'");
    expect(migration).toContain("WHEN 'texas-agriculture-rural' THEN 'Non-Political'");
    expect(migration).toContain("WHEN 'texas-veterans-military' THEN 'Non-Political'");
    expect(migration).toContain("WHEN 'texas-law-enforcement-public-safety' THEN 'Non-Political'");
    expect(migration).toContain("ELSE 'Non-Political'");
  });
});
