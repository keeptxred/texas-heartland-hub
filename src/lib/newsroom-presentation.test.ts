import { describe, expect, it } from "vitest";
import {
  isReserveDeskExplainer,
  isNewsroomReport,
  isEligiblePreviousReport,
} from "@/lib/newsroom-presentation";

describe("newsroom presentation classification", () => {
  it("never passes fallback explainers off as current reporting", () => {
    const reserve = { kind: "ingested", source_name: "Keep TX Red Reserve Desk" };
    expect(isReserveDeskExplainer(reserve)).toBe(true);
    expect(isNewsroomReport(reserve)).toBe(false);
    expect(isEligiblePreviousReport(reserve)).toBe(false);
  });

  it("keeps real, approved newsroom reports in the reporting lane", () => {
    const report = { kind: "news", source_name: "Texas Comptroller of Public Accounts" };
    expect(isNewsroomReport(report)).toBe(true);
    expect(isEligiblePreviousReport(report)).toBe(true);
  });

  it("excludes historical restorations from the previous reporting rail", () => {
    for (const flag of ["legacy_url_restored", "historical_archive", "historical_reconstruction"]) {
      expect(isEligiblePreviousReport({
        kind: "news", source_name: "Official filing", quality_flags: [flag],
      })).toBe(false);
    }
  });

  it("does not promote an unclassified ingested article to reporting", () => {
    expect(isNewsroomReport({ kind: "ingested", source_name: "Publisher" })).toBe(false);
  });
});
