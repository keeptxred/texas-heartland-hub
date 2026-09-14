import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const texasNews = readFileSync(new URL("../components/texas-news-view.tsx", import.meta.url), "utf8");
const texasBusiness = readFileSync(new URL("../components/texas-business-view.tsx", import.meta.url), "utf8");
const happeningNow = readFileSync(new URL("../routes/happening-now.tsx", import.meta.url), "utf8");
const siteNavigation = readFileSync(new URL("./site-navigation.ts", import.meta.url), "utf8");
const llms = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
const sportsRoute = readFileSync(new URL("../routes/texas-sports.tsx", import.meta.url), "utf8");

describe("KTR impression-recovery search focus", () => {
  it("keeps routine sports out of core indexed discovery and authority cross-links", () => {
    for (const source of [texasNews, texasBusiness, siteNavigation, llms]) {
      expect(source).not.toContain('to="/texas-sports"');
    }
    expect(texasNews).not.toContain('id: "sports"');
    expect(happeningNow).toContain('return kind === "news"');
    expect(happeningNow).not.toContain('kind?.startsWith("sports-")');
  });

  it("permanently consolidates the retired KTR sports tree on TexasDefined", () => {
    expect(sportsRoute).toContain('href: `https://texasdefined.com/sports${location.searchStr || ""}`');
    expect(sportsRoute).toContain("statusCode: 301");
    expect(sportsRoute).not.toContain('name: "robots"');
  });
});
