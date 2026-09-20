import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const validator = readFileSync(
  new URL("../../scripts/news/validate-daily-news-migration.mjs", import.meta.url),
  "utf8",
);

describe("legacy live URL publication validation", () => {
  it("recognizes dated live slugs without relaxing the dated slug requirement", () => {
    expect(validator).toContain("(?:live-)?(?:20\\d{2}-\\d{2}-\\d{2})");
    expect(validator).toContain("could not find any dated article slugs in the publication input");
  });

  it("keeps unqualified daily_articles updates inside the publication guard", () => {
    expect(validator).toContain("UPDATE\\s+(?:public\\.)?daily_articles");
  });

  it("allows only explicitly scoped image field synchronization maintenance", () => {
    const migration = readFileSync(
      "supabase/migrations/20260912002500_sync_primary_article_image_fields.sql",
      "utf8",
    );

    expect(migration).toContain("-- BULK_IMAGE_FIELD_MAINTENANCE");
    expect(migration).toContain("UPDATE public.daily_articles");
    expect(migration).toContain("quality_flags = array_remove");
    expect(migration).toContain("'missing_image' = ANY");
    expect(migration).toContain("UPDATE OF featured_image_url, quality_flags");
    expect(validator).toContain("BULK_IMAGE_FIELD_MAINTENANCE");
    expect(validator).toContain("clear stale missing_image flags");
  });

  it("allows only governed-ready image alt-label maintenance without hero replacement", () => {
    const legacyCorrection = readFileSync(
      "supabase/migrations/20260913210333_correct_validated_photo_alt_labels.sql",
      "utf8",
    );
    const neutralNormalization = readFileSync(
      "supabase/migrations/20260913210709_normalize_validated_image_alt_labels.sql",
      "utf8",
    );

    for (const migration of [legacyCorrection, neutralNormalization]) {
      expect(migration).toContain("-- BULK_IMAGE_ALT_LABEL_MAINTENANCE");
      expect(migration).toContain("UPDATE public.daily_articles");
      expect(migration).toContain("SET image_alt_text = regexp_replace");
      expect(migration).toContain("image_generation_status = 'ready'");
      expect(migration).toContain("cloudflare-vision ok:");
      expect(migration).toContain("stored-cloudflare-vision-v[0-9]+");
      expect(migration).not.toMatch(/SET[\s\S]{0,400}?featured_image_url\s*=/i);
    }
    expect(neutralNormalization).toContain("'Editorial image'");
    expect(validator).toContain("BULK_IMAGE_ALT_LABEL_MAINTENANCE");
    expect(validator).toContain("must not replace featured_image_url");
  });

  it("links the restored article from the agriculture pillar", () => {
    const route = readFileSync("src/routes/texas-agriculture.tsx", "utf8");

    expect(route).toContain(
      "/news/live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7",
    );
  });
});
