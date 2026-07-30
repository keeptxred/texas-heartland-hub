import { describe, expect, test } from "bun:test";
import { getCalculatorSources, isSourceStale } from "../calculatorSourceMetadata";

describe("calculator source metadata", () => {
  test("Texas toll calculator includes major operator-specific official sources", () => {
    const sources = getCalculatorSources("texas-toll-cost-calculator");
    const agencies = sources.map((source) => source.agency);

    expect(sources).toHaveLength(4);
    expect(agencies).toContain("Texas Department of Transportation");
    expect(agencies).toContain("North Texas Tollway Authority");
    expect(agencies).toContain("Harris County Toll Road Authority");
    expect(agencies).toContain("Central Texas Regional Mobility Authority");
  });

  test("toll sources use secure URLs and require route-specific inputs", () => {
    const sources = getCalculatorSources("texas-toll-cost-calculator");

    for (const source of sources) {
      expect(source.url.startsWith("https://")).toBe(true);
      expect(source.reviewedOn).toBe("2026-07-22");
      expect(source.reviewAfter).toBe("2026-10-15");
      expect(source.scopeNote.length).toBeGreaterThan(40);
    }

    const combinedScope = sources.map((source) => source.scopeNote.toLowerCase()).join(" ");
    expect(combinedScope).toContain("route");
    expect(combinedScope).toContain("tag");
    expect(combinedScope).toContain("dynamic");
  });

  test("source stale detection changes after the scheduled review deadline", () => {
    const source = getCalculatorSources("texas-toll-cost-calculator")[0];
    expect(isSourceStale(source, new Date("2026-10-15T12:00:00Z"))).toBe(false);
    expect(isSourceStale(source, new Date("2026-10-16T00:00:00Z"))).toBe(true);
  });
});
