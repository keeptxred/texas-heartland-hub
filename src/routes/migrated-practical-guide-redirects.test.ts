import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "@/lib/migrated-practical-guide-canonical";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["texas-first-time-homebuyer-programs.tsx", "/texas-first-time-homebuyer-programs", "https://texasdefined.com/texas-first-time-homebuyer-programs"],
  ["news.renting-vs-buying-in-texas.tsx", "/news/renting-vs-buying-in-texas", "https://texasdefined.com/article/renting-vs-buying-in-texas"],
  ["news.texas-house-down-payment-guide.tsx", "/news/texas-house-down-payment-guide", "https://texasdefined.com/article/texas-house-down-payment-guide"],
  ["news.true-cost-of-owning-a-home-in-texas.tsx", "/news/true-cost-of-owning-a-home-in-texas", "https://texasdefined.com/article/true-cost-of-owning-a-home-in-texas"],
  ["news.should-you-refinance-texas-mortgage.tsx", "/news/should-you-refinance-texas-mortgage", "https://texasdefined.com/article/should-you-refinance-texas-mortgage"],
  ["news.texas-home-equity-heloc-guide.tsx", "/news/texas-home-equity-heloc-guide", "https://texasdefined.com/article/texas-home-equity-heloc-guide"],
  ["news.texas-mortgage-payment-guide.tsx", "/news/texas-mortgage-payment-guide", "https://texasdefined.com/article/texas-mortgage-payment-guide"],
  ["news.texas-closing-costs-guide.tsx", "/news/texas-closing-costs-guide", "https://texasdefined.com/article/texas-closing-costs-guide"],
  ["news.texas-utility-costs-guide.tsx", "/news/texas-utility-costs-guide", "https://texasdefined.com/article/texas-utility-costs-guide"],
  ["news.texas-homeowners-insurance-guide.tsx", "/news/texas-homeowners-insurance-guide", "https://texasdefined.com/article/texas-homeowners-insurance-guide"],
  ["news.salary-needed-to-buy-a-house-in-texas.tsx", "/news/salary-needed-to-buy-a-house-in-texas", "https://texasdefined.com/article/salary-needed-to-buy-a-house-in-texas"],
  ["news.moving-to-houston-address-checklist.tsx", "/news/moving-to-houston-address-checklist", "https://texasdefined.com/article/moving-to-houston-address-checklist"],
  ["news.moving-to-dallas-fort-worth-guide.tsx", "/news/moving-to-dallas-fort-worth-guide", "https://texasdefined.com/article/moving-to-dallas-fort-worth-guide"],
  ["news.moving-to-san-antonio-guide.tsx", "/news/moving-to-san-antonio-guide", "https://texasdefined.com/article/moving-to-san-antonio-guide"],
  ["news.moving-to-austin-guide.tsx", "/news/moving-to-austin-guide", "https://texasdefined.com/article/moving-to-austin-guide"],
  ["news.moving-to-el-paso-guide.tsx", "/news/moving-to-el-paso-guide", "https://texasdefined.com/article/moving-to-el-paso-guide"],
] as const;

describe("migrated practical guide redirects", () => {
  it("keeps the route contract in exact sync with the canonical ownership map", () => {
    const routeCases = Object.fromEntries(CASES.map(([, legacyPath, target]) => [legacyPath, target]));
    expect(routeCases).toEqual(MIGRATED_PRACTICAL_GUIDE_CANONICALS);
  });

  it.each(CASES)("preserves %s with an exact permanent redirect", (file, legacyPath, target) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute("${legacyPath}")`);
    expect(source).toContain(target);
    expect(source).toContain("statusCode: 301");
    expect(source).toContain("location.searchStr");
  });
});
