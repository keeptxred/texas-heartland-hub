import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";

const read = (path: string) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const hub = read("../routes/texas-political-reference.tsx");
const trackerPage = read("../components/policy-tracker-page.tsx");
const freshness = read("../routes/api/reference-freshness.ts");

describe("political reference discovery quarantine", () => {
  it("has a real quarantined political-reference cohort", () => {
    expect(POLITICAL_SEARCH_GUIDES.length).toBeGreaterThan(0);
    expect(POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable)).toHaveLength(0);
  });

  it("filters hub cards and ItemList schema through the page readiness gate", () => {
    expect(hub).toContain('import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability"');
    expect(hub).toContain("const INDEXABLE_POLITICAL_SEARCH_GUIDES = POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable)");
    expect(hub).toContain("numberOfItems: INDEXABLE_POLITICAL_SEARCH_GUIDES.length");
    expect(hub).toContain("itemListElement: INDEXABLE_POLITICAL_SEARCH_GUIDES.map");
    expect(hub).toContain("INDEXABLE_POLITICAL_SEARCH_GUIDES.filter((guide) => guide.category === category)");
    expect(hub).not.toContain("itemListElement: POLITICAL_SEARCH_GUIDES.map");
  });

  it("does not recommend quarantined political-reference details from policy trackers", () => {
    expect(trackerPage).toContain('import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability"');
    expect(trackerPage).toContain("POLITICAL_SEARCH_GUIDES\n    .filter(isPoliticalReferenceIndexable)");
  });

  it("preserves durable public authority destinations while detail guides are quarantined", () => {
    for (const href of ["/elections/2026", "/texas-case", "/texas-case/facts", "/bills", "/laws", "/representatives"]) {
      expect(hub).toContain(href);
    }
  });

  it("keeps the full registry in the operational freshness queue", () => {
    expect(freshness).toContain("POLITICAL_SEARCH_GUIDES.map");
    expect(freshness).not.toContain("POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable)");
  });
});
