import { describe, expect, it } from "vitest";
import {
  CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS,
  PROJECTED_ESF_BALANCE_BILLIONS,
  calculateRainyDayFundScenario,
} from "./texas-rainy-day-fund";

describe("Texas Rainy Day Fund scenario engine", () => {
  it("reads the current official-source-backed budget metrics", () => {
    expect(PROJECTED_ESF_BALANCE_BILLIONS).toBeGreaterThan(0);
    expect(CERTIFIED_GENERAL_PURPOSE_SPENDING_BILLIONS).toBeGreaterThan(PROJECTED_ESF_BALANCE_BILLIONS);
  });

  it("calculates a normal withdrawal and remaining balance", () => {
    const result = calculateRainyDayFundScenario(5);
    expect(result.requestedWithdrawalBillions).toBe(5);
    expect(result.remainingBalanceBillions).toBeCloseTo(PROJECTED_ESF_BALANCE_BILLIONS - 5, 6);
    expect(result.percentOfFundUsed).toBeGreaterThan(0);
    expect(result.overdrawnByBillions).toBe(0);
  });

  it("does not hide a proposal larger than the projected fund", () => {
    const result = calculateRainyDayFundScenario(PROJECTED_ESF_BALANCE_BILLIONS + 2);
    expect(result.remainingBalanceBillions).toBe(0);
    expect(result.overdrawnByBillions).toBeCloseTo(2, 6);
    expect(result.percentOfFundUsed).toBeGreaterThan(100);
  });

  it("normalizes negative and non-finite inputs to zero", () => {
    expect(calculateRainyDayFundScenario(-4).requestedWithdrawalBillions).toBe(0);
    expect(calculateRainyDayFundScenario(Number.NaN).requestedWithdrawalBillions).toBe(0);
  });
});
