import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const hub = readFileSync("src/routes/laws.index.tsx", "utf8");

describe("Texas local-government law hub legal accuracy", () => {
  it("does not label all city and county authority under a single Dillon's Rule premise", () => {
    expect(hub).not.toContain("Texas is a Dillon's Rule state modified");
    expect(hub).toContain("Counties, general-law cities, and home-rule cities have different sources of power");
    expect(hub).toContain("state constitution and statutes");
    expect(hub).toContain("voter-adopted charter");
    expect(hub).toContain("valid preemption");
  });

  it("links the readable explanation to the detailed Texas legal authority framework and statute", () => {
    expect(hub).toContain('slug: "local-government-authority"');
    expect(hub).toContain("https://statutes.capitol.texas.gov/Docs/LG/htm/LG.5.htm");
  });
});
