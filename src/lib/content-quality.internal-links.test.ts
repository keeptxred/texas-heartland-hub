import { describe, expect, it } from "vitest";
import { pickInternalLinks } from "@/lib/content-quality";

const REDIRECT_ALIASES = new Set([
  "/candidate-guides",
  "/elections",
  "/laws-to-know",
  "/legislative-updates",
  "/texas-laws",
  "/texas-law-policy",
  "/texas-news",
]);

describe("generated internal links", () => {
  it.each([
    "Elections",
    "Legislature",
    "Laws",
    "Education",
    "Energy",
    "Border",
    "Politics",
  ])("uses only canonical destinations for %s", (category) => {
    const links = pickInternalLinks({
      category,
      title: "Texas election law and legislative policy update",
      keywords: ["Texas", "election", "law"],
    });

    for (const link of links) {
      expect(REDIRECT_ALIASES.has(link.href)).toBe(false);
    }
  });

  it("sends elections directly to the canonical Election Central hub", () => {
    const links = pickInternalLinks({ category: "Elections", title: "Texas primary election update" });
    expect(links.some((link) => link.href === "/elections/2026")).toBe(true);
    expect(links.some((link) => link.href === "/elections")).toBe(false);
  });

  it("sends laws directly to /laws", () => {
    const links = pickInternalLinks({ category: "Laws", title: "Texas law update" });
    expect(links.some((link) => link.href === "/laws")).toBe(true);
    expect(links.some((link) => link.href === "/texas-laws")).toBe(false);
  });
});
