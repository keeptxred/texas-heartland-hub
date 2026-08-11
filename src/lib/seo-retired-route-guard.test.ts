import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const validator = readFileSync("scripts/seo/validate.mjs", "utf8");

describe("retired route crawl guard", () => {
  it("hard-blocks retired routes in crawl indexes while surfacing source references as warnings", () => {
    // Keep crawl-index exclusions strict even when source-reference detection is advisory.
    expect(validator).toContain("const retiredRoutes = new Map()");
    expect(validator).toContain("public-facing source may link to a retired/noindex route; verify canonical destination");
    expect(validator).toContain("AI-facing link index must not advertise retired/noindex route");
    expect(validator).toContain("static sitemap must not promote a route that redirects or is always noindex");
  });
});
