import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818045000_adsense_boundary_chronology_hardening.sql", import.meta.url),
  "utf8",
);

describe("KeepTXRed/TexasDefined publication boundary", () => {
  it("routes lifestyle and dining coverage to TexasDefined", () => {
    expect(migration).toContain("ELSIF is_lifestyle THEN");
    expect(migration).toContain("NEW.target_site := 'texasdefined'");
    expect(migration).toContain("'Food & Drink'");
    expect(migration).toContain("'Explore'");
  });

  it("preserves hard news, material business, and sports on KeepTXRed", () => {
    expect(migration).toContain("IF is_sports THEN");
    expect(migration).toContain("ELSIF is_hard_news THEN");
    expect(migration).toContain("ELSIF is_material_business THEN");
    expect(migration).toContain("NEW.target_site := 'keeptxred'");
  });

  it("quarantines existing and future cross-site collisions", () => {
    expect(migration).toContain("quarantine_cross_site_daily_article");
    expect(migration).toContain("site_boundary_violation");
    expect(migration).toContain("seo_off_topic");
    expect(migration).toContain("seo_noindex");
    expect(migration).toContain("active_cross_site_publication_collisions");
  });
});

describe("article chronology storage contract", () => {
  it("normalizes invalid or pre-publication updated timestamps", () => {
    expect(migration).toContain("normalize_daily_article_chronology");
    expect(migration).toContain("updated_value < NEW.published_at");
    expect(migration).toContain("jsonb_set(");
    expect(migration).toContain("to_jsonb(NEW.published_at)");
  });

  it("enforces chronology on future writes and backfills existing rows", () => {
    expect(migration).toContain("BEFORE INSERT OR UPDATE OF published_at, body_json");
    expect(migration).toContain("SET body_json = body_json");
  });
});
