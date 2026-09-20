import { describe, expect, it } from "vitest";
import { hasSeoDuplicateFlag, SEO_DUPLICATE_FLAGS } from "@/lib/article-canonical";

describe("public article quarantine contract", () => {
  it("treats site-boundary violations as public-discovery quarantine", () => {
    expect(SEO_DUPLICATE_FLAGS).toContain("site_boundary_violation");
    expect(hasSeoDuplicateFlag(["site_boundary_violation"])).toBe(true);
    expect(hasSeoDuplicateFlag([" SITE_BOUNDARY_VIOLATION "])).toBe(true);
  });

  it("keeps the controlled GSC zero-impression hold self-enforcing", () => {
    expect(SEO_DUPLICATE_FLAGS).toContain("gsc_zero_impression_hold_2026_09_03");
    expect(hasSeoDuplicateFlag(["gsc_zero_impression_hold_2026_09_03"])).toBe(true);
    expect(hasSeoDuplicateFlag([" GSC_ZERO_IMPRESSION_HOLD_2026_09_03 "])).toBe(true);
  });

  it("keeps ordinary editorial flags public", () => {
    expect(hasSeoDuplicateFlag(["taxonomy_corrected", "authority_links_added"])).toBe(false);
  });
});
