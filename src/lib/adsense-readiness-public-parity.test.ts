import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260903153800_block_retired_discovery_taxonomy_from_adsense_readiness.sql", import.meta.url),
  "utf8",
);
const publicGate = fs.readFileSync(
  new URL("./public-article-readiness.ts", import.meta.url),
  "utf8",
);
const canonicalGate = fs.readFileSync(
  new URL("./article-canonical.ts", import.meta.url),
  "utf8",
);

describe("AdSense readiness/public-indexability parity", () => {
  it("uses the same 70-point quality floor as public article discovery", () => {
    expect(publicGate).toContain("const MIN_PUBLIC_CONTENT_QUALITY_SCORE = 70;");
    expect(migration).toContain("coalesce(state.content_quality_score, 0) < 70");
    expect(migration).not.toContain("content_quality_score, 0) < 65");
  });

  it("blocks retired KTR and TexasDefined taxonomy from the ready ledger", () => {
    for (const category of ["non-political", "sports", "sports culture", "culture & identity"]) {
      expect(migration).toContain(`'${category}'`);
    }
    for (const discoverCategory of [
      "texas culture",
      "texas history",
      "sports",
      "sports culture",
      "culture & identity",
    ]) {
      expect(migration).toContain(`'${discoverCategory}'`);
      expect(publicGate).toContain(`\"${discoverCategory}\"`);
    }
    expect(migration).toContain("retired_ktr_taxonomy");
    expect(migration).toContain("texasdefined_discovery_taxonomy");
  });

  it("rejects discovery-only provenance just like the public gate", () => {
    for (const host of ["news.google.com", "reddit.com", "www.reddit.com", "old.reddit.com"]) {
      expect(publicGate).toContain(`\"${host}\"`);
      expect(migration).toContain(`'${host}'`);
    }
    expect(migration).toContain("discovery_only_source_evidence");
  });

  it("mirrors the repeated-body suppression threshold", () => {
    expect(publicGate).toContain("const MAX_DUPLICATE_PARAGRAPH_OCCURRENCES = 2;");
    expect(migration).toContain("state.duplicate_paragraph_occurrences > 2");
    expect(migration).toContain("repeated_body_paragraphs");
  });

  it("keeps severe SEO quarantine families synchronized", () => {
    for (const flag of [
      "seo_duplicate",
      "seo_noindex",
      "canonical_duplicate",
      "legacy_thin_content",
      "seo_legacy_single_source",
      "seo_low_value_commodity",
      "seo_false_multisource",
      "source_integrity_failure",
      "seo_off_topic",
      "site_boundary_violation",
    ]) {
      expect(canonicalGate).toContain(`\"${flag}\"`);
      expect(migration).toContain(`'${flag}'`);
    }
  });

  it("preserves security-invoker access semantics", () => {
    expect(migration).toContain("WITH (security_invoker = true)");
  });
});
