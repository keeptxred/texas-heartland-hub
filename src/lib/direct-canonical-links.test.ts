import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const resourceHub = read("../shared/texas-platform/resource-hub.tsx");
const governmentEntity = read("../routes/texas-government.$entitySlug.tsx");

describe("direct canonical UI links", () => {
  it("does not route resource-hub law links through legacy redirects", () => {
    for (const legacy of [
      'href: "/laws/texas-gun-laws"',
      'href: "/laws/texas-property-tax-laws"',
      'href: "/laws/texas-election-laws"',
      'href: "/laws/texas-new-laws-2026"',
    ]) {
      expect(resourceHub).not.toContain(legacy);
    }

    for (const canonical of [
      'href: "/news/texas-gun-laws-explained"',
      'href: "/news/texas-property-tax-laws-explained"',
      'href: "/news/texas-election-laws-explained"',
      'href: "/news/texas-new-laws-2026"',
    ]) {
      expect(resourceHub).toContain(canonical);
    }
  });

  it("does not route government fallback navigation through /politics", () => {
    expect(governmentEntity).not.toContain('href="/politics"');
    expect(governmentEntity).toContain('href="/texas-politics"');
  });
});
