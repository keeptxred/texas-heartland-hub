import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { inferArticleImageDomain } from "./featured-image-core";

describe("article image domain priority", () => {
  it("keeps a festival story in culture even when body text contains court language", () => {
    expect(
      inferArticleImageDomain(
        "Texas Pickle Festival Moves to Helotes After Last Year’s Crowd Backlash",
        "The festival moved after complaints. A separate paragraph mentions a court ruling and election law.",
      ),
    ).toBe("culture");
  });

  it("still recognizes a genuinely legal headline as legal", () => {
    expect(
      inferArticleImageDomain(
        "Texas Court Upholds Election Integrity Law Amid Democratic Challenges",
        "The ruling came from a Texas appellate court.",
      ),
    ).toBe("legal");
  });

  it("keeps Purple Heart coverage in the military domain", () => {
    expect(
      inferArticleImageDomain(
        "Governor Marks Purple Heart Day for Texas Veterans",
        "The governor signed a proclamation at the Capitol.",
      ),
    ).toBe("military");
  });

  it("does not retain the SVG military-honor bypass", () => {
    const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    expect(source).not.toContain("PURPLE_HEART_IMAGE_URL");
    expect(source).not.toContain("staticFeaturedImage");
    expect(source).not.toContain("static military-honor asset");
  });
});
