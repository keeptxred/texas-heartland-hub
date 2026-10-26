import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const authority = readFileSync("src/components/law-topic-page.tsx", "utf8");
const directory = readFileSync("src/routes/laws_.topics.tsx", "utf8");
const browser = readFileSync("tests/laws-deployed/tap-targets.spec.ts", "utf8");

describe("law source and breadcrumb tap target standard", () => {
  it("keeps every law authority breadcrumb and official-source link at least 44px", () => {
    expect(authority).toContain('aria-label="Breadcrumb"');
    expect(authority).toContain('to="/" className="inline-flex min-h-11');
    expect(authority).toContain('to="/laws" className="inline-flex min-h-11');
    expect(authority).toContain('href="/laws/topics" className="inline-flex min-h-11');
    expect(authority).toContain('target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded px-2 py-2');
    expect(authority).toContain('focus-visible:outline-primary');
  });

  it("keeps directory navigation and official statutes discoverable by touch and keyboard", () => {
    expect(directory).toContain('aria-label="Breadcrumb"');
    expect(directory).toContain('to="/" className="inline-flex min-h-11');
    expect(directory).toContain('to="/laws" className="inline-flex min-h-11');
    expect(directory).toContain('href="https://statutes.capitol.texas.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11');
    expect(browser).toContain('const statuteSources = page.locator("#law-sources")');
    expect(browser).toContain("directoryBreadcrumbs");
  });
});
