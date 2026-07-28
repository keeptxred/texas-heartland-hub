import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("Election Central trust disclosures", () => {
  it("labels forecasts as estimates on list and detail pages", () => {
    expect(source("src/pages/elections/ElectionForecastListPage.tsx")).toContain("model estimates");
    expect(source("src/components/elections/forecasts/ForecastDetailView.tsx")).toContain(
      "model estimates",
    );
  });

  it("labels unofficial results until certification", () => {
    expect(source("src/pages/elections/ElectionResultsListPage.tsx")).toContain("unofficial");
    expect(source("src/components/elections/results/ResultDetailView.tsx")).toContain(
      "certification",
    );
  });

  it("retains poll partisan and methodology warnings", () => {
    const poll = source("src/components/elections/polls/PollDetailView.tsx");
    expect(poll).toContain("Partisan-source disclosure");
    expect(poll).toContain("Methodology warning");
  });

  it("shows source and update attribution on detail records", () => {
    for (const file of [
      "src/components/elections/forecasts/ForecastDetailView.tsx",
      "src/components/elections/results/ResultDetailView.tsx",
    ]) {
      const detail = source(file);
      expect(detail).toContain("Source:");
      expect(detail).toContain("Updated");
    }
  });
});
