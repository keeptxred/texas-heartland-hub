import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL(
    "../../supabase/migrations/20260829165000_reconcile_licensed_external_image_readiness.sql",
    import.meta.url,
  ),
  "utf8",
);

describe("licensed external image readiness reconciliation", () => {
  it("is narrowly scoped to the two restored Wikimedia-backed historical URLs", () => {
    expect(migration).toContain(
      "live-2026-07-08-new-omakase-concept-ichika-debuts-in-plano-dining-scene-pd6r0q",
    );
    expect(migration).toContain(
      "live-2026-07-02-suburban-expansion-trends-transform-texas-economic-landscape-roszfh",
    );
    expect(migration).toContain("BULK_ARTICLE_MAINTENANCE");
  });

  it("requires the existing asset, alt text, and explicit Commons license evidence", () => {
    expect(migration).toContain("featured_image_url");
    expect(migration).toContain("image_alt_text");
    expect(migration).toContain("Wikimedia Commons");
    expect(migration).toContain("CC0|CC BY|public domain");
  });

  it("only reconciles readiness status and never replaces the vetted image asset", () => {
    expect(migration).toContain("image_generation_status = 'ready'");
    expect(migration).not.toMatch(/SET[\s\S]*featured_image_url\s*=/i);
    expect(migration).not.toMatch(/SET[\s\S]*image_alt_text\s*=/i);
  });
});
