import { describe, expect, it } from "vitest";
import {
  CERTIFIED_ENDING_GR_BALANCE_BILLIONS,
  CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS,
  CERTIFIED_GR_RELATED_REVENUE_BILLIONS,
  calculateBudgetHeadroomScenario,
} from "@/lib/texas-budget-headroom";

describe("Texas budget headroom calculator", () => {
  it("reproduces the certified baseline with zero scenario changes", () => {
    const result = calculateBudgetHeadroomScenario({
      revenueChangePercent: 0,
      spendingChangePercent: 0,
      additionalOneTimeSpendingBillions: 0,
    });

    expect(CERTIFIED_GR_RELATED_REVENUE_BILLIONS).toBeCloseTo(203.63, 2);
    expect(CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS).toBeCloseTo(198.97, 2);
    expect(result.projectedEndingBalanceBillions).toBeCloseTo(CERTIFIED_ENDING_GR_BALANCE_BILLIONS, 2);
    expect(result.shortfallBillions).toBe(0);
  });

  it("shows a shortfall when spending exceeds scenario revenue", () => {
    const result = calculateBudgetHeadroomScenario({
      revenueChangePercent: -5,
      spendingChangePercent: 5,
      additionalOneTimeSpendingBillions: 5,
    });

    expect(result.projectedEndingBalanceBillions).toBeLessThan(0);
    expect(result.shortfallBillions).toBeGreaterThan(0);
    expect(result.remainingHeadroomBillions).toBe(0);
  });

  it("does not allow a negative one-time appropriation to create artificial headroom", () => {
    const baseline = calculateBudgetHeadroomScenario({ revenueChangePercent: 0, spendingChangePercent: 0, additionalOneTimeSpendingBillions: 0 });
    const negative = calculateBudgetHeadroomScenario({ revenueChangePercent: 0, spendingChangePercent: 0, additionalOneTimeSpendingBillions: -10 });
    expect(negative.projectedEndingBalanceBillions).toBeCloseTo(baseline.projectedEndingBalanceBillions, 6);
  });
});
