import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const oneNight = readFileSync(new URL("../../.github/workflows/ktr-election-live-results-smoke.yml", import.meta.url), "utf8");
const polls = readFileSync(new URL("../../.github/workflows/election-polls-production-verify.yml", import.meta.url), "utf8");

describe("retired Election Central does not trigger false post-deploy publication failures", () => {
  it("confines 2026 election-night SOS monitor to its actual one-night window", () => {
    expect(oneNight).toContain('utc_hour="$(date -u +%Y-%m-%dT%H)"');
    expect(oneNight).toContain('"2026-11-03T23"');
    expect(oneNight).toContain('"2026-11-04T07"');
    expect(oneNight).toContain('echo "check=false" >> "$GITHUB_OUTPUT"');
  });
  it("verifies actual 404/noindex retirement, never declares a generic 404 successful", () => {
    expect(polls).toContain('page.status === 404');
    expect(polls).toContain("noindex\\s*,\\s*nofollow");
    expect(polls).toContain('seasonallyRetired = true');
    expect(polls).toContain("off-season directory does not match the same HTTP 404");
    expect(polls).toContain("steps.check.outputs.retired != 'true'");
  });
  it("retains full active page source and browser checks", () => {
    for (const token of ["Election poll archive", "Texas polling source network", "latest published record", "verify-live-forecast.mjs"]) {
      expect(polls.toLowerCase()).toContain(token.toLowerCase());
    }
  });
});
