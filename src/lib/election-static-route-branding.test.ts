import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const routeFiles = [
  "elections.races.tsx",
  "elections.polls.tsx",
  "elections.results.tsx",
  "elections.forecast.tsx",
  "elections.candidates.tsx",
  "elections.voting.tsx",
] as const;

function routeHeadSource(fileName: string): string {
  const source = readFileSync(join(process.cwd(), "src/routes", fileName), "utf8");
  const start = source.indexOf("head: () => ({");
  const end = source.indexOf("component:", start);

  expect(start, `${fileName} should define a route head`).toBeGreaterThanOrEqual(0);
  expect(end, `${fileName} should define a component after its route head`).toBeGreaterThan(start);

  return source.slice(start, end);
}

describe("static Election Central metadata branding", () => {
  for (const fileName of routeFiles) {
    it(`${fileName} uses the canonical Keep TX Red display brand in route metadata`, () => {
      const head = routeHeadSource(fileName);

      expect(head).toContain("Keep TX Red");
      expect(head).not.toContain("KeepTXRed");
    });
  }

  it("keeps the polls parent canonical intentionally omitted", () => {
    const head = routeHeadSource("elections.polls.tsx");

    expect(head).not.toContain('rel: "canonical"');
  });
});
