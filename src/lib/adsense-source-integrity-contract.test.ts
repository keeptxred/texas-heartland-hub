import fs from "node:fs";
import { describe, expect, it } from "vitest";

const finalizer = fs.readFileSync(
  new URL("../routes/api/public/hooks/finalize-newsroom-article.ts", import.meta.url),
  "utf8",
);
const cleanup = fs.readFileSync(
  new URL("../../supabase/migrations/20260818050500_adsense_indexable_source_cleanup.sql", import.meta.url),
  "utf8",
);
const taxonomy = fs.readFileSync(
  new URL("../../supabase/migrations/20260818050600_normalize_keeptxred_nonpolitical_category.sql", import.meta.url),
  "utf8",
);

describe("newsroom source-integrity finalization", () => {
  it("quarantines a false independent multi-source claim", () => {
    expect(finalizer).toContain("assessArticleSourceIntegrity");
    expect(finalizer).toContain('"seo_false_multisource", "seo_noindex"');
    expect(finalizer).toContain("sourceReferencesFromBodyJson");
  });
});

describe("current indexable inventory repairs", () => {
  it("quarantines the duplicate Texas Tribune city-budget source family", () => {
    expect(cleanup).toContain("texas-cities-eye-property-tax-hikes-spending-cuts-amid-yawning-budget-gaps");
    expect(cleanup).toContain("seo_false_multisource");
    expect(cleanup).toContain("seo_noindex");
  });

  it("removes the unrelated Baylor golf source from the cross-country article", () => {
    expect(cleanup).toContain("mens-golf-mgolf-reveals-2026-27-schedule");
    expect(cleanup).toContain("cross-country-announces-2026-schedule");
    expect(cleanup).toContain("source_attribution_corrected");
  });

  it("corrects valid college athletics coverage to Sports", () => {
    expect(cleanup).toContain("ray-guy-award-watch-list");
    expect(cleanup).toContain("category = 'Sports'");
  });
});

describe("KeepTXRed public taxonomy", () => {
  it("does not allow new generic Non-Political KTR rows to remain public", () => {
    expect(taxonomy).toContain("normalize_keeptxred_article_category");
    expect(taxonomy).toContain("IF NEW.category IS DISTINCT FROM 'Non-Political'");
    expect(taxonomy).toContain("NEW.category := 'Texas News'");
    expect(taxonomy).toContain("NEW.category := 'Sports'");
  });
});
