import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["texas-refinance-calculator.tsx", "/texas-refinance-calculator", "https://texasdefined.com/texas-refinance-savings-calculator"],
  ["tools.home-affordability-calculator.tsx", "/tools/home-affordability-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["tools.home-insurance-calculator.tsx", "/tools/home-insurance-calculator", "https://texasdefined.com/texas-home-insurance-calculator"],
  ["tools.mortgage-calculator.tsx", "/tools/mortgage-calculator", "https://texasdefined.com/texas-mortgage-calculator"],
  ["texas-property-tax-calculator.tsx", "/texas-property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["tools.property-tax-calculator.tsx", "/tools/property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["tools.closing-cost-calculator.tsx", "/tools/closing-cost-calculator", "https://texasdefined.com/texas-closing-cost-calculator"],
  ["tools.texas-utilities-calculator.tsx", "/tools/texas-utilities-calculator", "https://texasdefined.com/texas-utility-cost-calculator"],
  ["texas-home-ownership-cost-calculator.tsx", "/texas-home-ownership-cost-calculator", "https://texasdefined.com/texas-homeownership-cost-calculator"],
  ["texas-mortgage-qualification-calculator.tsx", "/texas-mortgage-qualification-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["texas-heloc-calculator.tsx", "/texas-heloc-calculator", "https://texasdefined.com/texas-home-equity-calculator"],
  ["moving-checklist.tsx", "/moving-checklist", "https://texasdefined.com/moving-to-texas-checklist"],
] as const;

describe("migrated TexasDefined tool redirects", () => {
  it.each(CASES)("preserves %s with an exact permanent redirect", (file, legacyPath, target) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${legacyPath}\")`);
    expect(source).toContain(target);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
  });
});
