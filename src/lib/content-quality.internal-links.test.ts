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

  it("sends elections directly to the canonical Election Central hub", () => {
    const links = pickInternalLinks({ category: "Elections", title: "Texas primary election update" });
    expect(links.some((link) => link.href === "/elections/2026")).toBe(true);
    expect(links.some((link) => link.href === "/elections")).toBe(false);
  });

  it("supports the existing voting-guide search foothold for voting-intent stories", () => {
    const links = pickInternalLinks({ category: "Elections", title: "Texas voter and ballot guide" });
    expect(links.some((link) => link.href === "/news/texas-voting-guide-2026")).toBe(true);
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
