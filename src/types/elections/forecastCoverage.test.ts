import { describe, expect, it } from "vitest";
import { isForecastInLaunchCoverage } from "./forecastProjections";
import type { ElectionForecastSummary } from "./forecastProjections";

describe("isForecastInLaunchCoverage", () => {
  it("includes U.S. Senate and statewide executive races", () => {
    expect(isForecastInLaunchCoverage(forecast("us_senate", false))).toBe(true);
    expect(isForecastInLaunchCoverage(forecast("statewide_executive", false))).toBe(true);
  });

  it("requires congressional and Texas legislative races to be competitive", () => {
    expect(isForecastInLaunchCoverage(forecast("us_house", true))).toBe(true);
    expect(isForecastInLaunchCoverage(forecast("us_house", false))).toBe(false);
    expect(isForecastInLaunchCoverage(forecast("texas_senate", false))).toBe(false);
    expect(isForecastInLaunchCoverage(forecast("texas_house", true))).toBe(true);
  });
});

function forecast(
  forecastCoverage: ElectionForecastSummary["race"]["forecastCoverage"],
  competitive: boolean,
) {
  return { race: { forecastCoverage, competitive } } as ElectionForecastSummary;
}
