import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  isExplicitlyRetiredStaticNewsPath,
  isExplicitlyRetiredStaticSlug,
} from "@/lib/retired-static-news";

const startSource = fs.readFileSync(new URL("../start.ts", import.meta.url), "utf8");

describe("retired static news hard removal", () => {
  it("retires every legacy live-news slug", () => {
    expect(isExplicitlyRetiredStaticSlug("live-2026-07-16-h-e-b-confirms-product-safety-standards-amid-regional-cyclospora-healt-wwcptt")).toBe(true);
    expect(isExplicitlyRetiredStaticNewsPath("/news/live-2026-07-07-texas-pitmasters-to-feature-in-new-food-network-competition-series-v3wglp")).toBe(true);
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
});
