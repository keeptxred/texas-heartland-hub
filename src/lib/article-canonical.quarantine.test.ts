import { describe, expect, it } from "vitest";
import { hasSeoDuplicateFlag, SEO_DUPLICATE_FLAGS } from "@/lib/article-canonical";

describe("public article quarantine contract", () => {
  it("treats site-boundary violations as public-discovery quarantine", () => {
    expect(SEO_DUPLICATE_FLAGS).toContain("site_boundary_violation");
    expect(hasSeoDuplicateFlag(["site_boundary_violation"])).toBe(true);
    expect(hasSeoDuplicateFlag([" SITE_BOUNDARY_VIOLATION "])).toBe(true);
  });

  it("keeps ordinary editorial flags public", () => {
    expect(hasSeoDuplicateFlag(["taxonomy_corrected", "authority_links_added"])).toBe(false);
  });
});
