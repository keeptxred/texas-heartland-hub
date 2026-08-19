import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const freshnessSource = readFileSync(new URL("../routes/api/reference-freshness.ts", import.meta.url), "utf8");

describe("accountability Data Center discovery and freshness", () => {
  it("keeps Contract Watch and Rule Watch in the accountability catalog", () => {
    expect(ACCOUNTABILITY_DATA_SETS.map((dataset) => dataset.slug)).toEqual(expect.arrayContaining(["contracts", "rules"]));
  });

  it("includes accountability datasets in sitemap paths and lastmod generation", () => {
    expect(sitemapSource).toContain('import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog"');
    expect(sitemapSource).toContain("const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS]");
    expect(sitemapSource).toContain("...ALL_DATA_SETS.map((dataset)=>`/data/${dataset.slug}`)");
  });

  it("includes accountability datasets in reference freshness governance", () => {
    expect(freshnessSource).toContain('import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog"');
    expect(freshnessSource).toContain("function mapDataFreshness(datasets: readonly ReviewableDataSet[], now: Date): FreshnessItem[]");
    expect(freshnessSource).toContain("...mapDataFreshness(TEXAS_DATA_SETS, now),");
    expect(freshnessSource).toContain("...mapDataFreshness(ACCOUNTABILITY_DATA_SETS, now),");
    expect(freshnessSource).toContain("...dataSetItems,");
  });
});
