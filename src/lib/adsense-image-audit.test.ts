import fs from "node:fs";
import { describe, expect, it } from "vitest";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20260818055000_adsense_image_readiness_metrics.sql", import.meta.url),
  "utf8",
);

describe("AdSense image readiness audit", () => {
  it("keeps content readiness separate from image readiness", () => {
    expect(migration).toContain("AS adsense_ready");
    expect(migration).toContain("AS image_ready");
    expect(migration).toContain("AS adsense_fully_ready");
  });

  it("requires a featured image, alt text, and ready generation status", () => {
    expect(migration).toContain("featured_image_url");
    expect(migration).toContain("image_alt_text");
    expect(migration).toContain("image_generation_status");
    expect(migration).toContain("= 'ready'");
  });

  it("reports ready pages that still lack image readiness", () => {
    expect(migration).toContain("ready_with_image");
    expect(migration).toContain("ready_missing_image");
    expect(migration).toContain("fully_ready_articles");
  });

  it("preserves security-invoker diagnostics", () => {
    expect(migration.match(/WITH \(security_invoker = true\)/g)?.length).toBe(2);
  });
});
