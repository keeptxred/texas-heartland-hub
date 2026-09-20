import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["texas-refinance-calculator.tsx", "/texas-refinance-calculator", "https://texasdefined.com/texas-refinance-savings-calculator"],
  ["texas-refinance-savings-calculator.tsx", "/texas-refinance-savings-calculator", "https://texasdefined.com/texas-refinance-savings-calculator"],
  ["tools.home-affordability-calculator.tsx", "/tools/home-affordability-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["texas-home-affordability-calculator.tsx", "/texas-home-affordability-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["tools.home-insurance-calculator.tsx", "/tools/home-insurance-calculator", "https://texasdefined.com/texas-home-insurance-calculator"],
  ["texas-home-insurance-calculator.tsx", "/texas-home-insurance-calculator", "https://texasdefined.com/texas-home-insurance-calculator"],
  ["tools.mortgage-calculator.tsx", "/tools/mortgage-calculator", "https://texasdefined.com/texas-mortgage-calculator"],
  ["texas-mortgage-calculator.tsx", "/texas-mortgage-calculator", "https://texasdefined.com/texas-mortgage-calculator"],
  ["texas-property-tax-calculator.tsx", "/texas-property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["texas-property-tax-increase-calculator.tsx", "/texas-property-tax-increase-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["tax-calculator.tsx", "/tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["tools.property-tax-calculator.tsx", "/tools/property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["tools.closing-cost-calculator.tsx", "/tools/closing-cost-calculator", "https://texasdefined.com/texas-closing-cost-calculator"],
  ["texas-closing-cost-calculator.tsx", "/texas-closing-cost-calculator", "https://texasdefined.com/texas-closing-cost-calculator"],
  ["tools.texas-utilities-calculator.tsx", "/tools/texas-utilities-calculator", "https://texasdefined.com/texas-utility-cost-calculator"],
  ["texas-utility-cost-calculator.tsx", "/texas-utility-cost-calculator", "https://texasdefined.com/texas-utility-cost-calculator"],
  ["texas-home-ownership-cost-calculator.tsx", "/texas-home-ownership-cost-calculator", "https://texasdefined.com/texas-homeownership-cost-calculator"],
  ["texas-homeownership-cost-calculator.tsx", "/texas-homeownership-cost-calculator", "https://texasdefined.com/texas-homeownership-cost-calculator"],
  ["texas-home-equity-calculator.tsx", "/texas-home-equity-calculator", "https://texasdefined.com/texas-home-equity-calculator"],
  ["texas-home-equity-growth-calculator.tsx", "/texas-home-equity-growth-calculator", "https://texasdefined.com/texas-home-equity-growth-calculator"],
  ["texas-mortgage-payoff-calculator.tsx", "/texas-mortgage-payoff-calculator", "https://texasdefined.com/texas-mortgage-payoff-calculator"],
  ["texas-down-payment-calculator.tsx", "/texas-down-payment-calculator", "https://texasdefined.com/texas-down-payment-calculator"],
  ["texas-down-payment-assistance-calculator.tsx", "/texas-down-payment-assistance-calculator", "https://texasdefined.com/texas-down-payment-assistance-calculator"],
  ["texas-rent-vs-buy-calculator.tsx", "/texas-rent-vs-buy-calculator", "https://texasdefined.com/texas-rent-vs-buy-calculator"],
  ["texas-budget-planner.tsx", "/texas-budget-planner", "https://texasdefined.com/texas-budget-planner"],
  ["texas-cost-of-living-calculator.tsx", "/texas-cost-of-living-calculator", "https://texasdefined.com/texas-cost-of-living-calculator"],
  ["texas-salary-calculator.tsx", "/texas-salary-calculator", "https://texasdefined.com/texas-salary-calculator"],
  ["texas-salary-comparison-by-city.tsx", "/texas-salary-comparison-by-city", "https://texasdefined.com/texas-salary-comparison-by-city"],
  ["texas-moving-cost-calculator.tsx", "/texas-moving-cost-calculator", "https://texasdefined.com/texas-moving-cost-calculator"],
  ["texas-mortgage-qualification-calculator.tsx", "/texas-mortgage-qualification-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["texas-heloc-calculator.tsx", "/texas-heloc-calculator", "https://texasdefined.com/texas-home-equity-calculator"],
  ["moving-checklist.tsx", "/moving-checklist", "https://texasdefined.com/moving-to-texas"],
] as const;

describe("migrated TexasDefined tool redirects", () => {
  it.each(CASES)("preserves %s with an exact permanent redirect", (file, legacyPath, target) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${legacyPath}\")`);
    const directTarget = source.includes(target);
    const samePathTarget =
      target === `https://texasdefined.com${legacyPath}` &&
      source.includes('https://texasdefined.com${location.pathname}');
    expect(directTarget || samePathTarget, `${file} must redirect directly to ${target}`).toBe(true);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
  });
});
