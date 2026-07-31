import { describe, expect, it } from "vitest";
import { TEXAS_POLLING_REFERENCE_SOURCES } from "./pollingSources";

describe("Texas polling reference sources", () => {
  it("includes RealClearPolling as an aggregator, not a primary source", () => {
    const rcpSources = TEXAS_POLLING_REFERENCE_SOURCES.filter((source) =>
      source.url.includes("realclearpolling.com"),
    );

    expect(rcpSources.length).toBeGreaterThanOrEqual(2);
    expect(rcpSources.every((source) => source.role === "aggregator")).toBe(true);
  });

  it("uses secure source URLs", () => {
    expect(TEXAS_POLLING_REFERENCE_SOURCES.every((source) => source.url.startsWith("https://"))).toBe(
      true,
    );
  });
});
