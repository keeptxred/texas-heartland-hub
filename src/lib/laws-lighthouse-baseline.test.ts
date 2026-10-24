import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Lighthouse legal-page performance audit contract", () => {
  it("runs audited report schema, provenance, and failure mode tests", () => {
    expect(() => execFileSync("node", ["--test", "scripts/laws/test-report-lighthouse-baseline.mjs"], {
      encoding: "utf8", timeout: 15000,
    })).not.toThrow();
  });
  it("prohibits silent performance promises without metrics", () => {
    const source = readFileSync("scripts/laws/report-lighthouse-baseline.mjs", "utf8");
    expect(source).toContain("Lab data only");
    expect(source).toContain("real-user Core Web Vitals");
    expect(source).toContain("missing scored categories");
  });
});
