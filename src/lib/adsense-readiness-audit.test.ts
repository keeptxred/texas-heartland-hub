import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818051500_adsense_readiness_audit_views.sql", import.meta.url),
  "utf8",
);

describe("AdSense readiness audit views", () => {
  it("tracks the severe quarantine families used by public SEO gating", () => {
    for (const flag of [
      "seo_noindex",
      "canonical_duplicate",
      "legacy_thin_content",
      "seo_legacy_single_source",
      "seo_low_value_commodity",
      "seo_false_multisource",
      "source_integrity_failure",
      "seo_off_topic",
      "site_boundary_violation",
    ]) expect(migration).toContain(`'${flag}'`);
  });

  it("measures indexable taxonomy, source, quality, and chronology blockers", () => {
    expect(migration).toContain("legacy_nonpolitical_taxonomy");
    expect(migration).toContain("multisource_label_without_two_references");
    expect(migration).toContain("low_content_quality_score");
    expect(migration).toContain("missing_source_evidence");
    expect(migration).toContain("updated_before_published");
  });

  it("includes active cross-site collisions in the readiness summary", () => {
    expect(migration).toContain("public.active_cross_site_publication_collisions");
    expect(migration).toContain("active_cross_site_collisions");
  });

  it("uses security-invoker views rather than creating a privileged public read path", () => {
    expect(migration.match(/WITH \(security_invoker = true\)/g)?.length).toBe(2);
  });
});
