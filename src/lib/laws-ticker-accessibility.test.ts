import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const header = readFileSync("src/components/site-header.tsx", "utf8");

describe("shared news ticker accessibility on Texas laws pages", () => {
  it("keeps dynamic, fallback and all-news links at least 44px high with focus rings", () => {
    expect(header).toContain('role="navigation" aria-label="Latest headlines"');
    expect((header.match(/min-h-11/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(header).not.toContain("min-h-8");
    expect((header.match(/focus-visible:outline-white/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it("preserves dynamic news and election fallback destinations", () => {
    expect(header).toContain('to="/news/$slug"');
    expect(header).toContain('to="/elections/2026"');
    expect(header).toContain('to="/news"');
  });
});
