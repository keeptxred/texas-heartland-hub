import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceFiles = [
  "src/components/site-header.tsx",
  "src/components/sports-coverage-placeholder.tsx",
  "src/components/city-page.tsx",
  "src/lib/elections/internalLinks.ts",
];

const redirectAliases = [
  'to="/texas-news"',
  'href="/texas-news"',
  'texasNews: "/texas-news"',
  'to="/elections"',
  'href="/elections"',
  'livingInTexas: "/living-in-texas"',
];

describe("canonical internal links", () => {
  it("does not route high-traffic internal links through known redirect aliases", () => {
    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      for (const alias of redirectAliases) {
        expect(source, `${file} must not contain redirecting internal link ${alias}`).not.toContain(alias);
      }
    }
  });
});
