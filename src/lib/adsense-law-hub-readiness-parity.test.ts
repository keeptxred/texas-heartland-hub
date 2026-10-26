import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { LAW_TOPICS, type LawTopic } from "@/lib/law-guides";
import { guidesForTopic } from "@/lib/guide-registry";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

const gridSource = fs.readFileSync(new URL("../components/laws/law-guide-topic-grid.tsx", import.meta.url), "utf8");
const serverSummarySource = fs.readFileSync(new URL("./laws-hub-summaries.functions.ts", import.meta.url), "utf8");

describe("AdSense law hub readiness parity", () => {
  it("uses the same supporting-guide readiness gate before linking law guides", () => {
    // The readiness gate moved server-side; do not bypass it while
    // removing full legal guide article bodies from the hydrated bundle.
    expect(serverSummarySource).toContain('import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability"');
    expect(serverSummarySource).toContain('meta.status === "verified"');
    expect(serverSummarySource).toContain("isSupportingGuideIndexable(guide)");
    expect(serverSummarySource).toContain("isSupportingGuideIndexable(ALL_GUIDES[CHILD_SUPPORT_SLUG])");
    expect(serverSummarySource).not.toContain("Boolean(guide)");
    expect(gridSource).not.toContain('import { ALL_GUIDES }');
    expect(gridSource).not.toContain("isSupportingGuideIndexable(");
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
