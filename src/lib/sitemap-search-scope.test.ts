import { describe, expect, it } from "vitest";
import { renderUrlset } from "@/lib/sitemap-shared";

describe("sitemap search-scope exclusions", () => {
  it("omits the retired sports route tree while preserving core political URLs", () => {
    const xml = renderUrlset([
      { loc: "https://keeptxred.com/texas-sports" },
      { loc: "https://keeptxred.com/texas-sports/nfl" },
      { loc: "https://keeptxred.com/texas-sports/team/dallas-cowboys" },
      { loc: "https://keeptxred.com/elections/2026" },
      { loc: "https://keeptxred.com/texas-legislature" },
    ]);

    expect(xml).not.toContain("/texas-sports");
    expect(xml).toContain("https://keeptxred.com/elections/2026");
    expect(xml).toContain("https://keeptxred.com/texas-legislature");
  });
});
