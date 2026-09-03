import { describe, expect, it } from "vitest";
import { resolveArticleImage } from "./seo-headline";

const ORIGINAL_POLICING_HERO = "/images/news/texas-policing-agencies-compared-original-67c1f261.jpg";

describe("policing comparison hero image", () => {
  it("keeps the original uploaded hero even when stale image metadata is present", () => {
    expect(resolveArticleImage({
      slug: "texas-policing-agencies-compared",
      title: "Texas Law Enforcement: Who does what?",
      image_url: "/images/news/texas-policing-agencies-compared.jpg",
      featured_image_url: "/images/fallback/politics.jpg",
      image_category: "politics",
      category: "Government",
    })).toBe(ORIGINAL_POLICING_HERO);
  });
});
