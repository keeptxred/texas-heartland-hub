import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const articles = readFileSync("src/data/articles.ts", "utf8");
const title = 'slug: "constitutional-carry-one-year-later"';
const entry = articles.slice(articles.indexOf(title), articles.indexOf(title) + 950);

describe("Texas law card accuracy on permitless handgun carry", () => {
  it("distinguishes the statutory age text from the court's age-only injunction", () => {
    expect(entry).toContain("Although the statute specifies age 21");
    expect(entry).toContain("a federal court barred age-only enforcement");
    expect(entry).toContain("Restricted places and other eligibility rules still apply");
    expect(entry).not.toContain("lets eligible Texans 21 and older carry");
  });
});
