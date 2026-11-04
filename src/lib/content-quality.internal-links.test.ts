import { describe, expect, it } from "vitest";
import { pickInternalLinks, stripLowValueInternalLinks } from "@/lib/content-quality";

const REDIRECT_ALIASES = new Set([
  "/candidate-guides",
  "/elections",
  "/laws-to-know",
  "/legislative-updates",
  "/texas-laws",
  "/texas-law-policy",
  "/texas-news",
  "/texas-sports",
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
    "Sports",
    "NFL",
    "MLB",
    "NBA",
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

  it("keeps election articles linked to public Texas Politics without retired hub URLs", () => {
    const links = pickInternalLinks({ category: "Elections", title: "Texas primary election update" });
    expect(links.some((link) => link.href === "/texas-politics")).toBe(true);
    expect(links.some((link) => link.href.startsWith("/elections"))).toBe(false);
  });

  it("links voting-intent stories to permanent county election resources", () => {
    const links = pickInternalLinks({ category: "Elections", title: "Texas voter and ballot guide" });
    expect(links.some((link) => link.href === "/county-elections")).toBe(true);
  });

  it("does not send sports categories into the retired KTR sports tree", () => {
    for (const category of ["Sports", "NFL", "MLB", "NBA"]) {
      const links = pickInternalLinks({ category, title: "Texas sports update" });
      expect(links.some((link) => link.href.startsWith("/texas-sports"))).toBe(false);
    }
  });

  it("sends laws directly to /laws", () => {
    const links = pickInternalLinks({ category: "Laws", title: "Texas law update" });
    expect(links.some((link) => link.href === "/laws")).toBe(true);
    expect(links.some((link) => link.href === "/texas-laws")).toBe(false);
  });

  it("removes generic broad-section anchors but preserves useful contextual links recursively", () => {
    const body = {
      intro: [
        "[Texas](/texas-news) public universities are reviewing [Senate Bill 37](/bills/texas/89/sb/37).",
      ],
      sections: [
        {
          heading: "What changes",
          paragraphs: ["Read the [news](/news) while keeping [Texas Politics](/texas-politics/sb37) intact."],
        },
      ],
    };

    const cleaned = stripLowValueInternalLinks(body);
    expect(cleaned).toEqual({
      intro: [
        "Texas public universities are reviewing [Senate Bill 37](/bills/texas/89/sb/37).",
      ],
      sections: [
        {
          heading: "What changes",
          paragraphs: ["Read the news while keeping [Texas Politics](/texas-politics/sb37) intact."],
        },
      ],
    });
  });
});
