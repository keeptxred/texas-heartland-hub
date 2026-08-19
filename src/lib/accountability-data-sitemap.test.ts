import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

describe("accountability Data Center sitemap discovery", () => {
  it("keeps Contract Watch and Rule Watch in the accountability catalog", () => {
    expect(ACCOUNTABILITY_DATA_SETS.map((dataset) => dataset.slug)).toEqual(expect.arrayContaining(["contracts", "rules"]));
  });

  it("includes accountability datasets in sitemap paths and lastmod generation", () => {
    expect(sitemapSource).toContain('import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog"');
    expect(sitemapSource).toContain("const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS]");
    expect(sitemapSource).toContain("...ALL_DATA_SETS.map((dataset)=>`/data/${dataset.slug}`)");
  });
});
