import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../components/admin/ContentOpportunityPanel.tsx", import.meta.url), "utf8");

describe("Content Opportunities pending extraction flow", () => {
  it("keeps pending-extraction rows actionable", () => {
    expect(source).toContain('preflight.reason === "PENDING_EXTRACTION"');
    expect(source).toContain('return canAttemptArticlePublish(effectivePreflight(item));');
    expect(source).toContain('"Check Source & Publish"');
  });


  it("keeps publication-held rows visible and manually recheckable without bypassing server gates", () => {
    expect(source).toContain('String(preflight?.reason ?? "") === "PUBLICATION_HOLD"');
    expect(source).toContain("isPublicationHold(preflight)");
    expect(source).toContain('"Recheck & Publish"');
    expect(source).toContain("publishFeedItem(r.id)");
    expect(source).toContain("executes every publication-quality and fact-verification gate server-side");
  });

  it("loads held KTR rows across the full 14-day window instead of losing them behind the newest-500 cap", () => {
    expect(source).toContain("fetchHeldKtrOpportunities(since)");
    expect(source).toContain('.filter("target_site", "eq", "keeptxred")');
    expect(source).toContain('.contains("preflight_json", { reason: "PUBLICATION_HOLD" })');
    expect(source).toContain(".range(pageStart, pageStart + pageSize - 1)");
    expect(source).toContain("...heldFeed");
  });


  it("defaults to the full queue and searches before the 75-row display cap", () => {
    expect(source).toContain('useState<FilterKey>("all")');
    expect(source).toContain('const [searchQuery, setSearchQuery] = useState("")');
    expect(source).toContain('placeholder="Search headline, source, or feed ID…"');
    expect(source).toContain('const normalizedSearch = normalizeOpportunityTitle(searchQuery)');
    expect(source).toContain('All is the default so status changes do not hide opportunities.');
    expect(source).toContain('filtered.slice(0, visibleCount)');
  });

  it("searches the full 14-day KTR history instead of only the newest 500 loaded rows", () => {
    expect(source).toContain("searchKtrOpportunityHistory(term, since)");
    expect(source).toContain('.ilike("title", `%${term}%`)');
    expect(source).toContain('.ilike("source", `%${term}%`)');
    expect(source).toContain('.eq("id", Number(term))');
    expect(source).toContain("dedupeFeedOpportunities([...items, ...historySearchItems])");
    expect(source).toContain("Search covers the full 14-day unpublished KTR history, not just the newest 500 loaded rows.");
  });

  it("lets deliberate search recover locally ignored opportunities", () => {
    expect(source).toContain("hasSearch || !ignored.has(ignoreKey(it))");
    expect(source).toContain("rowIgnored ? restoreOpportunity(r) : ignoreOpportunity(r)");
    expect(source).toContain('{rowIgnored ? "Restore" : "Ignore"}');
  });

  it("refreshes persisted preflight after a failed publish attempt", () => {
    expect(source).toContain('.select("id,title,source,pub_date,internal_slug,link,description,extracted_body,preflight_json")');
    expect(source).toContain('.eq("id", r.id)');
    expect(source).toContain('current.map((item) => (item.id === r.id ? ({ ...item, ...refreshed } as FeedItem) : item))');
  });
});
