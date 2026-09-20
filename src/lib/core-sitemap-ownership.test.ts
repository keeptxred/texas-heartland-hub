import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootSitemap = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
const electionSitemap = readFileSync(new URL("../routes/sitemap-elections[.]xml.ts", import.meta.url), "utf8");
const legislatureSitemap = readFileSync(new URL("../routes/sitemap-legislature[.]xml.ts", import.meta.url), "utf8");

describe("core sitemap canonical ownership", () => {
  it("keeps Find Representative in an advertised primary sitemap", () => {
    expect(rootSitemap).toContain('"sitemap-elections.xml"');
    expect(electionSitemap).toContain('"/find-representative"');
  });

  it("keeps the bill directory hub without re-advertising the bulk bill sitemap", () => {
    expect(rootSitemap).toContain('"sitemap-legislature.xml"');
    expect(rootSitemap).not.toContain('"sitemap-bills.xml"');
    expect(legislatureSitemap).toContain("absUrl('/bills')");
  });
});
