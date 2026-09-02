import { describe, expect, it } from "vitest";
import { resolveArticleImage } from "./seo-headline";

describe("policing comparison hero image", () => {
  it("keeps the dedicated hero even when stale image metadata is present", () => {
    expect(resolveArticleImage({
      slug: "texas-policing-agencies-compared",
      title: "Texas Law Enforcement: Who does what?",
      image_url: "/images/fallback/government.jpg",
      featured_image_url: "/images/fallback/politics.jpg",
      image_category: "politics",
      category: "Government",
    })).toBe("/images/news/texas-policing-agencies-compared.jpg");
  });
});
