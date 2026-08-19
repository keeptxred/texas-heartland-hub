import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const gaps = readFileSync("supabase/migrations/20260819185000_adsense_strict_ktr_coverage_gaps.sql", "utf8");
const cluster = readFileSync("src/routes/api/public/hooks/cluster-newsroom-stories.ts", "utf8");
const overdue = readFileSync("src/routes/api/public/hooks/publish-overdue-gap.ts", "utf8");
const historical = readFileSync("src/lib/historical-event-reconciliation.ts", "utf8");

describe("strict KeepTXRed target-site boundary", () => {
  it("scopes the operational coverage-gap view to KTR", () => {
    expect(gaps).toContain("WHERE target_site = 'keeptxred'");
  });

  it("requires explicit KTR routing before deterministic clustering", () => {
    expect(cluster).toContain('?.target_site === "keeptxred"');
    expect(cluster).not.toContain('!feed.target_site || feed.target_site === "keeptxred"');
  });

  it("requires explicit KTR routing for overdue publishing and duplicate linking", () => {
    expect(overdue).toContain('if (feed.target_site !== "keeptxred") return false;');
    expect(overdue).toContain('.eq("target_site", "keeptxred")');
  });

  it("excludes review, TD, and null routing from historical reconciliation", () => {
    expect(historical).toContain('.filter((row) => row.target_site === "keeptxred")');
    expect(historical).not.toContain('!row.target_site || row.target_site === "keeptxred"');
  });
});
