import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ElectionEmptyState } from "./ElectionEmptyState";

describe("Election Central empty states", () => {
  it("does not invent polling when no qualifying poll exists", () => {
    const html = renderToStaticMarkup(<ElectionEmptyState kind="polls" />);

    expect(html).toContain("No qualifying polls are available");
    expect(html).toContain("identifiable sources");
    expect(html).not.toMatch(/\b\d+(?:\.\d+)?%\b/);
  });

  it("does not invent forecasts without sufficient inputs", () => {
    const html = renderToStaticMarkup(<ElectionEmptyState kind="forecasts" />);

    expect(html).toContain("Forecasts are not available yet");
    expect(html).toContain("sufficient verified race, candidate, polling, and contextual data");
    expect(html).not.toMatch(/Safe Republican|Safe Democratic|Toss-up/);
  });

  it("labels all pre-certification results as unofficial", () => {
    const html = renderToStaticMarkup(<ElectionEmptyState kind="results" />);

    expect(html).toContain("Election results are not reporting yet");
    expect(html).toContain("remain unofficial until certified");
  });
});
