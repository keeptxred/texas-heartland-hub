import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const adminTables = ["Race", "Candidate", "Poll", "Forecast", "Result"];

describe("Election Central accessibility audit", () => {
  it.each(adminTables)("%s admin table has a caption", (name) => {
    const source = readFileSync(
      resolve(process.cwd(), `src/components/admin/elections/ElectionAdmin${name}List.tsx`),
      "utf8",
    );
    expect(source).toContain("<caption");
  });

  it.each(["ForecastListFilters", "ResultListFilters"])("%s exposes a named group", (name) => {
    const area = name.startsWith("Forecast") ? "forecasts" : "results";
    const source = readFileSync(
      resolve(process.cwd(), `src/components/elections/${area}/${name}.tsx`),
      "utf8",
    );
    expect(source).toContain('role="group"');
    expect(source).toContain("aria-label=");
  });
});
