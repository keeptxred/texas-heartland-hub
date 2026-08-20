import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import {
  MIN_TEXAS_CASE_POSITION_WORDS,
  isTexasCasePositionIndexable,
  texasCasePositionWordCount,
} from "@/lib/texas-case-position-indexability";

const PRIORITY_READY_SLUGS = [
  "protect-unborn-life",
  "gun-rights-over-gun-control",
  "eliminate-property-taxes",
];

describe("AdSense Texas Case position indexability", () => {
  it("keeps the long-form readiness floor at 1,000 substantive words", () => {
    expect(MIN_TEXAS_CASE_POSITION_WORDS).toBe(1000);
  });

  it("publishes only the priority positions that genuinely clear the long-form gate", () => {
    const ready = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable);
    expect(ready.map((position) => position.slug).sort()).toEqual([...PRIORITY_READY_SLUGS].sort());
    for (const position of ready) {
      expect(texasCasePositionWordCount(position)).toBeGreaterThanOrEqual(MIN_TEXAS_CASE_POSITION_WORDS);
    }
  });

  it("keeps every remaining underdeveloped position out of the indexable set", () => {
    const unready = TEXAS_CASE_POSITIONS.filter((position) => !isTexasCasePositionIndexable(position));
    expect(unready).toHaveLength(TEXAS_CASE_POSITIONS.length - PRIORITY_READY_SLUGS.length);
    expect(unready.every((position) => texasCasePositionWordCount(position) < MIN_TEXAS_CASE_POSITION_WORDS)).toBe(true);
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
