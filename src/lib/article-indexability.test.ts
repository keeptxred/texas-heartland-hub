import { describe, expect, it } from "vitest";
import { shouldNoindexCloudArticle } from "./article-indexability.functions";

describe("shouldNoindexCloudArticle", () => {
  it("fails closed when the quality lookup is unavailable", () => {
    expect(shouldNoindexCloudArticle(null, false)).toBe(true);
    expect(shouldNoindexCloudArticle(["missing_image"], false)).toBe(true);
  });

  it("quarantines severe editorial findings after a successful lookup", () => {
    expect(shouldNoindexCloudArticle(["seo_legacy_single_source"], true)).toBe(true);
    expect(shouldNoindexCloudArticle(["legacy_thin_content"], true)).toBe(true);
  });

  it("allows a successfully checked article with only repairable flags", () => {
    expect(shouldNoindexCloudArticle(["missing_image", "weak_dek"], true)).toBe(false);
    expect(shouldNoindexCloudArticle(null, true)).toBe(false);
  });
});
