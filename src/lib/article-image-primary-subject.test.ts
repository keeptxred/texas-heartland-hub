import { describe, expect, it } from "vitest";
import { assignUniqueImages } from "./dedupe-images";
import { CATEGORY_IMAGE_POOLS, getArticleImage } from "./fallback-images";
import {
  detectDiscoverCategory,
  resolveArticleImage,
  toImageInput,
} from "./seo-headline";

describe("primary-subject article image safeguards", () => {
  it("does not classify the word air as AI/technology", () => {
    expect(
      detectDiscoverCategory("Jimmy Kimmel won't air James Talarico interview due to FCC threats"),
    ).not.toBe("technology");
  });

  it("keeps the explicit site category ahead of headline keyword inference", () => {
    const image = getArticleImage(toImageInput({
      slug: "elections-ai-regression",
      title: "Candidate discusses AI policy before election day",
      category: "Elections",
      image_category: null,
    }));

    expect(CATEGORY_IMAGE_POOLS.elections).toContain(image);
    expect(CATEGORY_IMAGE_POOLS.technology).not.toContain(image);
  });

  it("fails closed for a cloud article missing its canonical featured image", () => {
    const image = resolveArticleImage({
      slug: "texas-a-m-example",
      title: "Texas A&M wins season opener",
      category: "Sports",
      featured_image_url: null,
      image_url: CATEGORY_IMAGE_POOLS.sports[0],
    });

    expect(image).toBe("/og/default.jpg");
  });

  it("uses the canonical featured image when one exists", () => {
    const image = resolveArticleImage({
      slug: "texas-a-m-example",
      title: "Texas A&M wins season opener",
      category: "Sports",
      featured_image_url: "/images/news/aggies-football.jpg",
      image_url: CATEGORY_IMAGE_POOLS.sports[0],
    });

    expect(image).toBe("/images/news/aggies-football.jpg");
  });

  it("preserves legacy fallback behavior only for static articles without a canonical-image field", () => {
    const image = resolveArticleImage({
      slug: "static-sports-example",
      title: "Texas football game preview",
      category: "Sports",
    });

    expect(CATEGORY_IMAGE_POOLS.sports).toContain(image);
  });

  it("never replaces a supplied canonical image merely to avoid a duplicate", () => {
    const items = [
      { slug: "storm-update-one", image: "/official/nhc-edouard.png" },
      { slug: "storm-update-two", image: "/official/nhc-edouard.png" },
    ];
    const resolved = assignUniqueImages(items, (item) => item.slug, (item) => item.image);

    expect(resolved.get("storm-update-one")).toBe("/official/nhc-edouard.png");
    expect(resolved.get("storm-update-two")).toBe("/official/nhc-edouard.png");
  });

  it("still rotates fallback-only items when no editorial image was supplied", () => {
    const items = [{ slug: "a" }, { slug: "c" }];
    const resolved = assignUniqueImages(items, (item) => item.slug, () => null, ["/fallback/a.jpg", "/fallback/b.jpg"]);

    expect(new Set(resolved.values()).size).toBe(2);
  });
});
