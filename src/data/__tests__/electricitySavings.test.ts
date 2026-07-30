import { describe, expect, test } from "bun:test";
import { electricitySavings } from "../../lib/calculators/relocationDecisionTools";

describe("Texas electricity plan savings", () => {
  test("compares all-in cents-per-kWh rates at the same usage level", () => {
    const result = electricitySavings(2000, 16, 13.5, 0);
    expect(result.currentMonthly).toBeCloseTo(320, 6);
    expect(result.newMonthly).toBeCloseTo(270, 6);
    expect(result.monthlySavings).toBeCloseTo(50, 6);
    expect(result.annualSavings).toBeCloseTo(600, 6);
  });

  test("adds only a separately entered recurring fee", () => {
    const result = electricitySavings(1000, 15, 14, 10);
    expect(result.currentMonthly).toBeCloseTo(150, 6);
    expect(result.newMonthly).toBeCloseTo(150, 6);
    expect(result.monthlySavings).toBeCloseTo(0, 6);
  });

  test("preserves negative savings when the proposed plan costs more", () => {
    const result = electricitySavings(1000, 12, 14, 5);
    expect(result.monthlySavings).toBeCloseTo(-25, 6);
    expect(result.annualSavings).toBeCloseTo(-300, 6);
  });
});
