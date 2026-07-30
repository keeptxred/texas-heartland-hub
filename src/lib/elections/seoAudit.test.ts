import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicRoutes = [
  "elections.index",
  "elections.races",
  "elections.candidates",
  "elections.polls",
  "elections.forecast",
  "elections.results",
  "elections.methodology",
  "elections.voting",
];

function detailRouteFile(identifier: string) {
  if (identifier === "raceSlug") return "elections.races_.$raceSlug.tsx";
  if (identifier === "candidateSlug") return "elections.candidates_.$candidateSlug.tsx";
  if (identifier === "pollSlug") return "elections.polls.$pollSlug.tsx";
  if (identifier === "forecastSlug") return "elections.forecast.$forecastSlug.tsx";
  return "elections.results.$resultSlug.tsx";
}

describe("Election Central SEO audit", () => {
  it.each(publicRoutes)("%s defines title, description, and canonical metadata", (route) => {
    const source = readFileSync(resolve(process.cwd(), "src/routes", `${route}.tsx`), "utf8");
    expect(source).toContain("title:");
    expect(source).toContain('name: "description"');
    expect(source).toContain('rel: "canonical"');
  });

  it.each(["raceSlug", "candidateSlug", "pollSlug", "forecastSlug", "resultSlug"])(
    "%s detail route handles canonical and invalid indexing",
    (identifier) => {
      const source = readFileSync(
        resolve(process.cwd(), "src/routes", detailRouteFile(identifier)),
        "utf8",
      );
      expect(source).toContain('rel: "canonical"');
      expect(source).toContain("noindex, nofollow");
    },
  );
});
