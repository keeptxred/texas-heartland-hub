import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const newsroom = readFileSync(new URL("../routes/news.index.tsx", import.meta.url), "utf8");

describe("newsroom author discovery", () => {
  it("links active published newsroom desks directly from the main news page", () => {
    expect(newsroom).toContain("activeAuthors");
    expect(newsroom).toContain("AUTHORS.filter");
    expect(newsroom).toContain('to="/authors/$slug"');
    expect(newsroom).toContain('aria-label="Active Keep TX Red newsroom desks"');
  });

  it("keeps the full authors directory linked from the newsroom", () => {
    expect(newsroom).toContain('to="/authors"');
    expect(newsroom).toContain("All authors &amp; desks");
  });
});
