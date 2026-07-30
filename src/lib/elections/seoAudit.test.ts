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

describe("Election Central SEO audit", () => {
  it.each(publicRoutes)("%s defines title, description, and canonical metadata", (route) => {
    const source = readFileSync(resolve(process.cwd(), "src/routes", `${route}.tsx`), "utf8");
    expect(source).toContain("title:");
    expect(source).toContain('name: "description"');
    expect(source).toContain('rel: "canonical"');
  });

  it.each(["pollSlug", "forecastSlug", "resultSlug"])(
    "%s detail route handles canonical and invalid indexing",
    (identifier) => {
      const prefix =
        identifier === "raceSlug"
          ? "races"
          : identifier === "candidateSlug"
            ? "candidates"
            : identifier === "pollSlug"
              ? "polls"
              : identifier === "forecastSlug"
                ? "forecast"
                : "results";
      const source = readFileSync(
        resolve(process.cwd(), "src/routes", `elections.${prefix}.$${identifier}.tsx`),
        "utf8",
      );
      expect(source).toContain('rel: "canonical"');
      expect(source).toContain("noindex, nofollow");
    },
  );
});
