import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../components/admin/ContentOpportunityPanel.tsx", import.meta.url), "utf8");

describe("Content Opportunities pending extraction flow", () => {
  it("keeps pending-extraction rows actionable", () => {
    expect(source).toContain('preflight.rewriteable || preflight.reason === "PENDING_EXTRACTION"');
    expect(source).toContain('return canAttemptArticlePublish(effectivePreflight(item));');
    expect(source).toContain('"Check Source & Publish"');
  });

  it("refreshes persisted preflight after a failed publish attempt", () => {
    expect(source).toContain('.select("id,title,source,pub_date,internal_slug,link,description,extracted_body,preflight_json")');
    expect(source).toContain('.eq("id", r.id)');
    expect(source).toContain('current.map((item) => (item.id === r.id ? ({ ...item, ...refreshed } as FeedItem) : item))');
  });
});
