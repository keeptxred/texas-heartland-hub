import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync("src/routes/news.$slug.tsx", "utf8");

describe("article hero credit wording", () => {
  it("labels repository editorial artwork as a graphic rather than a Wikimedia photo", () => {
    expect(route).toContain('startsWith("/images/news/editorial/")');
    expect(route).toContain('isKeepTxRedEditorialGraphic ? "Graphic by " : "Photo by "');
    expect(route).toContain('isKeepTxRedEditorialGraphic ? (');
  });

  it("retains Wikimedia Commons license wording for reusable external photographs", () => {
    expect(route).toContain('via Wikimedia Commons, licensed');
    expect(route).toContain("imageAttribution.licenseUrl");
  });
});
