import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const texasNews = readFileSync(new URL("../components/texas-news-view.tsx", import.meta.url), "utf8");
const texasBusiness = readFileSync(new URL("../components/texas-business-view.tsx", import.meta.url), "utf8");
const siteNavigation = readFileSync(new URL("./site-navigation.ts", import.meta.url), "utf8");
const llms = readFileSync(new URL("../../public/llms.txt", import.meta.url), "utf8");
const sportsRoute = readFileSync(new URL("../routes/texas-sports.tsx", import.meta.url), "utf8");

describe("KTR impression-recovery search focus", () => {
  it("keeps routine sports out of core indexed discovery and authority cross-links", () => {
    for (const source of [texasNews, texasBusiness, siteNavigation, llms]) {
      expect(source).not.toContain('to="/texas-sports"');
    }
    expect(texasNews).not.toContain('id: "sports"');
  });

  it("preserves legacy sports URLs for users while explicitly removing them from indexing", () => {
    expect(sportsRoute).toContain('name: "robots"');
    expect(sportsRoute).toContain('content: "noindex,follow"');
  });
});
