import { describe, expect, it } from "vitest";
import { resolveArticleImage } from "./seo-headline";

const POLICING_HERO = "/images/news/texas-policing-agencies-compared-seven-role-0c284fef115e.webp";

describe("policing comparison hero image", () => {
  it("keeps the exact seven-role hero even when both stale four-role image fields are present", () => {
    expect(resolveArticleImage({
      slug: "texas-policing-agencies-compared",
      title: "Texas Law Enforcement: Who does what?",
      image_url: "/images/news/texas-policing-agencies-compared-full-c089e1bb.jpg",
      featured_image_url: "/images/news/texas-policing-agencies-compared.jpg",
      image_category: "politics",
      category: "Government",
    })).toBe(POLICING_HERO);
  });
});
