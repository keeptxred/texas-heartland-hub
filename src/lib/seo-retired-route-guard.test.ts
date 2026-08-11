import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const validator = readFileSync("scripts/seo/validate.mjs", "utf8");

describe("retired route crawl guard", () => {
  it("blocks retired/noindex routes from public internal links and llms.txt", () => {
    expect(validator).toContain("const retiredRoutes = new Map()");
    expect(validator).toContain("public-facing source must link directly to the canonical destination");
    expect(validator).toContain("AI-facing link index must not advertise retired/noindex route");
  });
});
