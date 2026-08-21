import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  isExplicitlyRetiredStaticNewsPath,
  isExplicitlyRetiredStaticSlug,
} from "@/lib/retired-static-news";

const startSource = fs.readFileSync(new URL("../start.ts", import.meta.url), "utf8");

describe("retired static news hard removal", () => {
  it("lets legacy live-news slugs reach dynamic content and redirect resolution", () => {
    expect(isExplicitlyRetiredStaticSlug("live-2026-07-16-h-e-b-confirms-product-safety-standards-amid-regional-cyclospora-healt-wwcptt")).toBe(true);
    expect(isExplicitlyRetiredStaticNewsPath("/news/live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp")).toBe(false);
  });

  it("lets exact TexasDefined migrations reach their permanent redirect routes", () => {
    for (const slug of [
      "renting-vs-buying-in-texas",
      "texas-house-down-payment-guide",
      "true-cost-of-owning-a-home-in-texas",
      "should-you-refinance-texas-mortgage",
      "texas-home-equity-heloc-guide",
      "texas-mortgage-payment-guide",
      "texas-closing-costs-guide",
      "texas-utility-costs-guide",
      "texas-homeowners-insurance-guide",
      "salary-needed-to-buy-a-house-in-texas",
      "moving-to-houston-address-checklist",
      "moving-to-dallas-fort-worth-guide",
      "moving-to-san-antonio-guide",
      "moving-to-austin-guide",
      "moving-to-el-paso-guide",
    ]) {
      expect(isExplicitlyRetiredStaticNewsPath(`/news/${slug}`)).toBe(false);
    }
    expect(isExplicitlyRetiredStaticNewsPath("/news/moving-to-texas-guide")).toBe(true);
  });

  it("retires explicit pre-quality-gate fixture news", () => {
    expect(isExplicitlyRetiredStaticNewsPath("/news/voter-id-surge")).toBe(true);
    expect(isExplicitlyRetiredStaticNewsPath("/news/operation-lone-star")).toBe(true);
  });

  it("does not retire current civic evergreen guides", () => {
    expect(isExplicitlyRetiredStaticNewsPath("/news/texas-voting-guide-2026")).toBe(false);
    expect(isExplicitlyRetiredStaticNewsPath("/news/texas-property-tax-laws-explained")).toBe(false);
  });

  it("hard-stops retired static paths in request middleware", () => {
    expect(startSource).toContain('import { isExplicitlyRetiredStaticNewsPath } from "@/lib/retired-static-news"');
    expect(startSource).toContain("isExplicitlyRetiredStaticNewsPath(url.pathname)");
    expect(startSource).toContain("status: 404");
    expect(startSource).toContain('"x-robots-tag": "noindex, follow"');
  });

  it("lets the workers.dev health probe test the deployed worker directly", () => {
    expect(startSource).toContain('url.pathname === "/api/public/hooks/health"');
  });
});
