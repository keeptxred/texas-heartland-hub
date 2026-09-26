import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260926180000_accept_governed_exact_entity_graphics.sql",
  "utf8",
);

describe("governed exact-entity hero database guard", () => {
  it("requires the exact governed note, slug and reusable URL", () => {
    expect(migration).toContain("article_hero_is_governed_exact_entity_graphic");
    expect(migration).toContain("exact-entity-graphic-v1 ok:%");
    expect(migration).toContain(
      "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-",
    );
    expect(migration).toContain(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg",
    );
    expect(migration).toContain(
      "2026-09-10-texas-stock-exchange-first-primary-listings",
    );
    expect(migration).toContain(
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png",
    );
  });

  it("does not broaden the generic visual-provenance function", () => {
    expect(migration).not.toMatch(
      /create or replace function public\.article_hero_has_visual_readiness_provenance/i,
    );
    expect(migration).toContain(
      "public.article_hero_has_visual_readiness_provenance(new.image_validation_note)",
    );
    expect(migration).toContain(
      "public.article_hero_is_governed_exact_entity_graphic(",
    );
  });

  it("reconciles both governed candidates only after the trigger guard is installed", () => {
    const helperAt = migration.indexOf(
      "create or replace function public.article_hero_is_governed_exact_entity_graphic",
    );
    const triggerAt = migration.indexOf(
      "create or replace function public.enforce_article_hero_visual_readiness",
    );
    const lupeUpdateAt = migration.indexOf(
      "update public.daily_articles\nset featured_image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg'",
    );
    expect(helperAt).toBeGreaterThanOrEqual(0);
    expect(triggerAt).toBeGreaterThan(helperAt);
    expect(lupeUpdateAt).toBeGreaterThan(triggerAt);
  });
});
