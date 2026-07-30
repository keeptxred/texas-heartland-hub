import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const staticRoutes = [
  "elections",
  "elections.races",
  "elections.candidates",
  "elections.polls",
  "elections.forecast",
  "elections.results",
  "elections.methodology",
  "elections.voting",
];

describe("Election Central internal links", () => {
  it.each(staticRoutes)("%s has a route module", (route) => {
    expect(existsSync(resolve(process.cwd(), "src/routes", `${route}.tsx`))).toBe(true);
  });
});
