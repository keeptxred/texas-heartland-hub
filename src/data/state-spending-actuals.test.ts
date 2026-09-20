import { describe, expect, it } from "vitest";
import {
  STATE_SPENDING_ACTUALS,
  STATE_SPENDING_ACTUALS_FISCAL_YEAR,
  STATE_SPENDING_ACTUALS_REPORT_URL,
  STATE_SPENDING_ACTUALS_SOURCE_URL,
  STATE_SPENDING_ACTUALS_XLSX_URL,
  STATE_SPENDING_TOTALS,
  stateSpendingShare,
} from "@/data/state-spending-actuals";

describe("Texas state spending actuals", () => {
  it("locks the latest completed annual cash-report fiscal year", () => {
    expect(STATE_SPENDING_ACTUALS_FISCAL_YEAR).toBe(2025);
    expect(STATE_SPENDING_TOTALS.fiscal2025).toBe(182_033_104_461);
    expect(STATE_SPENDING_TOTALS.fiscal2024).toBe(175_811_879_604);
    expect(STATE_SPENDING_TOTALS.percentChange).toBe(3.5);
  });

  it("keeps the complete Table 8 category set and reconciles to the published totals", () => {
    expect(STATE_SPENDING_ACTUALS).toHaveLength(22);
    const fiscal2025 = STATE_SPENDING_ACTUALS.reduce((sum, row) => sum + row.fiscal2025, 0);
    const fiscal2024 = STATE_SPENDING_ACTUALS.reduce((sum, row) => sum + row.fiscal2024, 0);

    expect(Math.abs(fiscal2025 - STATE_SPENDING_TOTALS.fiscal2025)).toBeLessThanOrEqual(1);
    expect(Math.abs(fiscal2024 - STATE_SPENDING_TOTALS.fiscal2024)).toBeLessThanOrEqual(1);
  });

  it("preserves the largest fiscal 2025 expenditure category and share calculation", () => {
    const publicAssistance = STATE_SPENDING_ACTUALS.find((row) => row.category === "Public assistance payments");
    expect(publicAssistance).toBeDefined();
    expect(publicAssistance?.fiscal2025).toBe(68_699_003_911);
    expect(stateSpendingShare(publicAssistance!.fiscal2025)).toBeCloseTo(37.74, 1);
  });

  it("points to official Comptroller report and downloadable data resources", () => {
    for (const url of [STATE_SPENDING_ACTUALS_SOURCE_URL, STATE_SPENDING_ACTUALS_XLSX_URL, STATE_SPENDING_ACTUALS_REPORT_URL]) {
      expect(url).toMatch(/^https:\/\/comptroller\.texas\.gov\//);
    }
    expect(STATE_SPENDING_ACTUALS_XLSX_URL).toMatch(/\.xlsx$/i);
  });
});
