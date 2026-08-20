import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import {
  MIN_TEXAS_CASE_POSITION_WORDS,
  isTexasCasePositionIndexable,
  texasCasePositionWordCount,
} from "@/lib/texas-case-position-indexability";

describe("AdSense Texas Case position indexability", () => {
  it("keeps the long-form readiness floor at 1,000 substantive words", () => {
    expect(MIN_TEXAS_CASE_POSITION_WORDS).toBe(1000);
  });

  it("keeps the current underdeveloped position cohort out of the indexable set", () => {
    const premature = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable);
    expect(
      premature.map((position) => `${position.slug}:${texasCasePositionWordCount(position)}`),
    ).toEqual([]);
  });

  it("uses the same readiness helper in the route and sitemap", () => {
    const route = fs.readFileSync(new URL("../routes/texas-case.$slug.tsx", import.meta.url), "utf8");
    const sitemap = fs.readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
    expect(route).toContain("isTexasCasePositionIndexable");
    expect(route).toContain("noindex,follow");
    expect(sitemap).toContain("TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable)");
    expect(sitemap).toContain("INDEXABLE_TEXAS_CASE_POSITIONS.map");
  });
});
