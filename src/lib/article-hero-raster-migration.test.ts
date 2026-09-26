import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260926183000_use_raster_txse_identity_hero.sql",
  "utf8",
);

describe("TXSE raster hero migration", () => {
  it("records the connector-applied predecessor without rewriting migration history", () => {
    expect(migration).toContain("'20260926180000'");
    expect(migration).toContain("'20260926181438'");
    expect(migration).toContain("'accept_governed_exact_entity_graphics'");
    expect(migration).toContain("repo_migration_equivalences");
  });

  it("allowlists only the exact TXSE slug and local PNG", () => {
    expect(migration).toContain(
      "'2026-09-10-texas-stock-exchange-first-primary-listings'",
    );
    expect(migration).toContain(
      "'/images/news/editorial/txse-identity.png'",
    );
    expect(migration).not.toContain(".svg");
  });

  it("keeps the exact-entity provenance fail-closed", () => {
    expect(migration).toContain("exact-entity-graphic-v1 ok:%");
    expect(migration).toContain(
      "article_hero_is_governed_exact_entity_graphic",
    );
  });
});
