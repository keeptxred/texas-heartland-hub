import { describe, expect, it } from "vitest";
import { getArticleImage, resolveImageCategory } from "@/lib/fallback-images";

describe("article fallback image classification", () => {
  it("does not treat the word air as AI", () => {
    expect(resolveImageCategory({
      category: null,
      title: "Jimmy Kimmel won't air James Talarico interview due to FCC threats",
    })).not.toBe("technology");
  });

  it("still recognizes AI as a standalone technology keyword", () => {
    expect(resolveImageCategory({ category: null, title: "AI tools arrive in Texas" })).toBe("technology");
  });

  it("prefers an explicit site category over heuristic headline keywords", () => {
    expect(resolveImageCategory({
      category: "Elections",
      title: "Candidate won't air interview after broadcast dispute",
    })).toBe("elections");
  });

  it("maps Government stories to politics fallbacks", () => {
    expect(resolveImageCategory({ category: "Government", title: "Board appointments announced" })).toBe("politics");
  });

  it("resolves a stable elections fallback for the Kimmel regression case", () => {
    const image = getArticleImage({
      slug: "kimmel-talarico-regression",
      category: "Elections",
      title: "Jimmy Kimmel won't air James Talarico interview due to FCC threats",
    });
    expect(image).toBeTruthy();
    expect(image).not.toContain("pexels-photo-1181675");
    expect(image).not.toContain("pexels-photo-3861969");
  });
});
