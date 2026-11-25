import { describe, expect, it } from "vitest";
import { getStatewideOfficeRecords } from "@/data/statewide-office-records";
import { getGovernmentEntity, governmentReviewedAt } from "@/lib/texas-government";
describe("indexed statewide office records", () => {
  it.each(["land-commissioner", "secretary-of-state", "comptroller"])("provides distinct official sources for %s", slug => {
    const guide = getStatewideOfficeRecords(slug)!;
    expect(guide.examples.length).toBeGreaterThanOrEqual(5);
    expect(guide.examples.every(record => record.url.startsWith("https://"))).toBe(true);
    expect(guide.related.length).toBeGreaterThanOrEqual(2);
    expect(governmentReviewedAt(getGovernmentEntity(slug)!)).toBe("2026-11-25");
  });
  it("distinguishes local property tax and updated business filing services", () => {
    expect(getStatewideOfficeRecords("comptroller")!.distinction).toContain("does not set local property tax rates");
    expect(getStatewideOfficeRecords("secretary-of-state")!.examples.some(record => record.description.includes("September 29, 2026"))).toBe(true);
  });
});
