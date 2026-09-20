import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { SUPPORTING_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const gridSource = fs.readFileSync(new URL("../components/supporting-guide-grid.tsx", import.meta.url), "utf8");

describe("AdSense pillar guide readiness parity", () => {
  it("filters pillar guide promotion with the canonical supporting-guide readiness gate", () => {
    expect(gridSource).toContain('import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability"');
    expect(gridSource).toContain("supportingGuidesForPillar(pillarHref).filter(isSupportingGuideIndexable)");
  });

  it("never allows a below-threshold supporting guide into a promoted cohort", () => {
    const promoted = Object.values(SUPPORTING_GUIDES).filter(isSupportingGuideIndexable);
    expect(promoted.every(isSupportingGuideIndexable)).toBe(true);
  });
});
