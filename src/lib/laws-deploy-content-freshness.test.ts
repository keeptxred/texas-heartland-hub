import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const preview = readFileSync("scripts/verify-deployed-laws-runtime.py", "utf8");
const production = readFileSync("scripts/seo/verify-deployed-laws-routes.py", "utf8");

describe("deployed Texas laws content-freshness gates", () => {
  it("checks current laws hub and searchable topic directory rather than only H1/canonical", () => {
    for (const script of [preview, production]) {
      expect(script).toContain("Find Texas laws by topic");
      expect(script).toContain("Search the Texas law-topic library");
      expect(script).toContain("made permanent by a 2019 constitutional amendment");
      expect(script).toContain("outdated constitutional income-tax claim still deployed");
    }
  });
  it("checks all four new authority crosslinks on production routes", () => {
    for (const slug of [
      "driving-traffic-insurance-law",
      "landlord-tenant-rentals-law",
      "employment-wages-workplace-rights-law",
      "consumer-protection-deceptive-trade-law",
    ]) {
      expect(production).toContain("/laws/topic/" + slug);
    }
    expect(production).toContain("missing published law topic crosslinks");
  });
});
