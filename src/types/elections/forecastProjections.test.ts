import { describe, expect, it } from "vitest";
import { isFundamentalsBasedForecast } from "./forecastProjections";
import type { ElectionForecast } from "./forecast";

describe("isFundamentalsBasedForecast", () => {
  it("labels only the fundamentals model as fundamentals based", () => {
    expect(
      isFundamentalsBasedForecast({
        model: { model: "fundamentals" },
      } as ElectionForecast),
    ).toBe(true);
    expect(
      isFundamentalsBasedForecast({
        model: { model: "polling" },
      } as ElectionForecast),
    ).toBe(false);
  });
});
