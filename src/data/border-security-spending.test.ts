import { describe, expect, it } from "vitest";
import { getAccountabilityDataSet } from "@/data/accountability-data-catalog";
import {
  BORDER_SECURITY_AGENCY_FUNDING,
  BORDER_SECURITY_GAA_2024_25_URL,
  BORDER_SECURITY_GAA_2026_27_URL,
  BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE,
  BORDER_SECURITY_REIMBURSEMENT_CONTEXT_URL,
  BORDER_SECURITY_TOTALS,
  borderSecurityFundingChangePercent,
  borderSecurityFundingCsv,
} from "@/data/border-security-spending";
import { dataDetailWordCount, isDataDetailIndexable, MIN_DATA_DETAIL_WORDS } from "@/lib/data-detail-indexability";

describe("Texas border security funding dataset", () => {
  it("covers all thirteen agencies listed in Article IX", () => {
    expect(BORDER_SECURITY_AGENCY_FUNDING).toHaveLength(13);
    expect(new Set(BORDER_SECURITY_AGENCY_FUNDING.map((row) => row.agency)).size).toBe(13);
  });

  it("preserves the official statewide biennial totals", () => {
    expect(BORDER_SECURITY_TOTALS.biennium2024_25Millions).toBe(6_571.7);
    expect(BORDER_SECURITY_TOTALS.biennium2026_27Millions).toBe(3_351.7);
    expect(borderSecurityFundingChangePercent()).toBeCloseTo(-49.0, 1);
  });

  it("keeps the three largest current agency amounts intact", () => {
    const byAgency = new Map(BORDER_SECURITY_AGENCY_FUNDING.map((row) => [row.agency, row]));
    expect(byAgency.get("Texas Military Department")?.biennium2026_27Millions).toBe(1_765.5);
    expect(byAgency.get("Department of Public Safety")?.biennium2026_27Millions).toBe(1_194.6);
    expect(byAgency.get("Trusteed Programs within the Office of the Governor")?.biennium2026_27Millions).toBe(228.5);
  });

  it("allows only the expected rounding difference in the current agency table", () => {
    const displayed = BORDER_SECURITY_AGENCY_FUNDING.reduce((sum, row) => sum + row.biennium2026_27Millions, 0);
    expect(Math.abs(displayed - BORDER_SECURITY_TOTALS.biennium2026_27Millions)).toBeLessThanOrEqual(0.11);
  });

  it("labels historical reported expenditures separately from appropriations", () => {
    expect(BORDER_SECURITY_HISTORICAL_REPORTED_EXPENDITURE).toMatchObject({
      biennium: "2020–21",
      appropriatedMillions: 800.6,
      agencyReportedExpendedMillions: 820.1,
      percentExpended: 102.4,
    });
  });

  it("exports all thirteen agencies as CSV", () => {
    const csv = borderSecurityFundingCsv();
    expect(csv.split("\n")).toHaveLength(14);
    expect(csv).toContain('"Texas Military Department",2265.5,1765.5');
    expect(csv).toContain('"Department of Public Safety",1234.6,1194.6');
  });

  it("keeps primary budget links on official Texas government domains", () => {
    for (const url of [BORDER_SECURITY_GAA_2024_25_URL, BORDER_SECURITY_GAA_2026_27_URL]) {
      expect(url).toMatch(/^https:\/\/www\.lbb\.texas\.gov\//);
    }
    expect(BORDER_SECURITY_REIMBURSEMENT_CONTEXT_URL).toMatch(/^https:\/\/comptroller\.texas\.gov\//);
  });

  it("genuinely clears the canonical Data Center readiness gate", () => {
    const dataset = getAccountabilityDataSet("border-security");
    expect(dataset).toBeDefined();
    expect(dataDetailWordCount(dataset!)).toBeGreaterThanOrEqual(MIN_DATA_DETAIL_WORDS);
    expect(isDataDetailIndexable(dataset)).toBe(true);
  });
});
