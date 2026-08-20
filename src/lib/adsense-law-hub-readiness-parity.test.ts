import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { LAW_TOPICS, type LawTopic } from "@/lib/law-guides";
import { guidesForTopic } from "@/lib/guide-registry";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const gridSource = fs.readFileSync(new URL("../components/laws/law-guide-topic-grid.tsx", import.meta.url), "utf8");

describe("AdSense law hub readiness parity", () => {
  it("uses the same supporting-guide readiness gate before linking law guides", () => {
    expect(gridSource).toContain('import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability"');
    expect(gridSource).toContain(".filter((entry) => isSupportingGuideIndexable(entry.guide))");
    expect(gridSource).not.toContain(".filter((entry) => Boolean(entry.guide))");
  });

  it("never promotes an unready verified law guide from any public law topic", () => {
    for (const topic of Object.keys(LAW_TOPICS) as LawTopic[]) {
      const promoted = guidesForTopic(topic)
        .filter((meta) => meta.status === "verified")
        .map((meta) => ALL_GUIDES[meta.slug])
        .filter(isSupportingGuideIndexable);

      expect(promoted.every(isSupportingGuideIndexable)).toBe(true);
    }
  });
});
