import { describe, expect, test } from "bun:test";
import { calculateRemainingTool, remainingTexasTools } from "../remainingTexasTools";

function getTool(id: string) {
  const tool = remainingTexasTools.find((candidate) => candidate.id === id);
  if (!tool) throw new Error(`Missing tool fixture: ${id}`);
  return tool;
}

describe("remaining Texas calculator formulas", () => {
  test("every registered tool returns a finite result for its defaults", () => {
    for (const tool of remainingTexasTools) {
      const result = calculateRemainingTool(tool, ...tool.defaults);
      expect(Number.isFinite(result)).toBe(true);
    }
  });

  test("negative and non-finite inputs are normalized to zero", () => {
    const tool = getTool("texas-hurricane-preparedness-budget");
    expect(calculateRemainingTool(tool, -100, Number.NaN, Number.POSITIVE_INFINITY)).toBe(0);
  });

  test("percentage-based tax formulas use percentage points", () => {
    expect(calculateRemainingTool(getTool("texas-homestead-exemption-savings-calculator"), 350000, 100000, 2.2)).toBeCloseTo(2200, 6);
    expect(calculateRemainingTool(getTool("texas-property-tax-appeal-savings-estimator"), 400000, 360000, 2.3)).toBeCloseTo(920, 6);
    expect(calculateRemainingTool(getTool("texas-sales-tax-calculator"), 1000, 8.25, 100)).toBeCloseTo(82.5, 6);
  });

  test("scores remain inside the 0 to 100 range", () => {
    const scoreTools = remainingTexasTools.filter((tool) => tool.unit === "score");
    for (const tool of scoreTools) {
      expect(calculateRemainingTool(tool, 1e12, 0, 0)).toBeLessThanOrEqual(100);
      expect(calculateRemainingTool(tool, 0, 1e12, 1e12)).toBeGreaterThanOrEqual(0);
    }
  });

  test("solar payback returns zero when annual savings do not exceed maintenance", () => {
    const tool = getTool("texas-solar-payback-calculator");
    expect(calculateRemainingTool(tool, 24000, 200, 200)).toBe(0);
    expect(calculateRemainingTool(tool, 24000, 2400, 200)).toBeCloseTo(10.9090909, 6);
  });

  test("cost comparisons preserve positive and negative direction", () => {
    expect(calculateRemainingTool(getTool("texas-internet-cost-comparison"), 80, 55, 100)).toBe(200);
    expect(calculateRemainingTool(getTool("compare-texas-utility-costs"), 290, 360, 12)).toBe(-840);
  });

  test("zero denominators do not produce infinity", () => {
    const tool = getTool("texas-cost-of-living-by-zip-code");
    expect(calculateRemainingTool(tool, 5000, 95, 0)).toBe(475000);
    expect(Number.isFinite(calculateRemainingTool(tool, 5000, 95, 0))).toBe(true);
  });
});
