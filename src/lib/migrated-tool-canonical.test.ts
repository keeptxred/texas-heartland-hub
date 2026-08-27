import { describe, expect, it } from "vitest";
import {
  canonicalMigratedToolHref,
  canonicalizeMigratedToolMarkdownLinks,
} from "@/lib/migrated-tool-canonical";

const CASES = [
  ["/texas-refinance-calculator", "https://texasdefined.com/texas-refinance-savings-calculator"],
  ["/tools/home-affordability-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["/tools/home-insurance-calculator", "https://texasdefined.com/texas-home-insurance-calculator"],
  ["/tools/mortgage-calculator", "https://texasdefined.com/texas-mortgage-calculator"],
  ["/texas-property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["/tools/property-tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["/tools/closing-cost-calculator", "https://texasdefined.com/texas-closing-cost-calculator"],
  ["/tools/texas-utilities-calculator", "https://texasdefined.com/texas-utility-cost-calculator"],
  ["/texas-home-ownership-cost-calculator", "https://texasdefined.com/texas-homeownership-cost-calculator"],
  ["/texas-mortgage-qualification-calculator", "https://texasdefined.com/texas-home-affordability-calculator"],
  ["/texas-heloc-calculator", "https://texasdefined.com/texas-home-equity-calculator"],
  ["/moving-checklist", "https://texasdefined.com/moving-to-texas"],
] as const;

describe("migrated tool canonical links", () => {
  it.each(CASES)("maps %s directly to its TexasDefined canonical", (legacy, canonical) => {
    expect(canonicalMigratedToolHref(legacy)).toBe(canonical);
  });

  it("preserves query strings and hashes", () => {
    expect(canonicalMigratedToolHref("/tools/mortgage-calculator?price=350000#payment"))
      .toBe("https://texasdefined.com/texas-mortgage-calculator?price=350000#payment");
  });

  it("leaves active KTR and unrelated external destinations unchanged", () => {
    expect(canonicalMigratedToolHref("/tools/texas-budget-headroom")).toBe("/tools/texas-budget-headroom");
    expect(canonicalMigratedToolHref("/texas-mortgage-calculator")).toBe("/texas-mortgage-calculator");
    expect(canonicalMigratedToolHref("https://comptroller.texas.gov/")).toBe("https://comptroller.texas.gov/");
  });

  it("rewrites migrated markdown destinations without changing labels or active links", () => {
    const text = "Compare the [mortgage tool](/tools/mortgage-calculator) and [budget tool](/tools/texas-budget-headroom).";
    expect(canonicalizeMigratedToolMarkdownLinks(text)).toBe(
      "Compare the [mortgage tool](https://texasdefined.com/texas-mortgage-calculator) and [budget tool](/tools/texas-budget-headroom).",
    );
  });
});
