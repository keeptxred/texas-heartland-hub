import { describe, expect, it } from "vitest";
import { assessFacebookArticleImagePolicy } from "./facebook-article-image-policy";

describe("Facebook article image policy", () => {
  const canonical = "https://keeptxred.com/api/public/article-image/example.webp";

  it("accepts only a ready article using its canonical featured image", () => {
    expect(assessFacebookArticleImagePolicy({
      imageGenerationStatus: "ready",
      storedFeaturedImageUrl: canonical,
      requestedImageUrl: canonical,
    })).toEqual({ ready: true });
  });

  it.each(["failed", "pending", "generating", null])("blocks non-ready image status %s", (status) => {
    const result = assessFacebookArticleImagePolicy({
      imageGenerationStatus: status,
      storedFeaturedImageUrl: canonical,
      requestedImageUrl: canonical,
    });
    expect(result.ready).toBe(false);
  });

  it("blocks a stale caller image even when it is a valid public URL", () => {
    const result = assessFacebookArticleImagePolicy({
      imageGenerationStatus: "ready",
      storedFeaturedImageUrl: canonical,
      requestedImageUrl: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    });
    expect(result.ready).toBe(false);
    if (!result.ready) expect(result.error).toMatch(/canonical featured image/i);
  });

  it("blocks missing canonical or requested imagery", () => {
    expect(assessFacebookArticleImagePolicy({
      imageGenerationStatus: "ready",
      storedFeaturedImageUrl: null,
      requestedImageUrl: canonical,
    }).ready).toBe(false);
    expect(assessFacebookArticleImagePolicy({
      imageGenerationStatus: "ready",
      storedFeaturedImageUrl: canonical,
      requestedImageUrl: null,
    }).ready).toBe(false);
  });
});
