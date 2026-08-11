import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const CANONICAL_ORIGIN = "https://keeptxred.com";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

describe("static route canonical consistency", () => {
  it("keeps literal canonical URLs self-referential and on the canonical origin", () => {
    for (const file of walk("src/routes")) {
      if (!file.endsWith(".tsx")) continue;
      const source = readFileSync(file, "utf8");
      const routeMatch = source.match(/createFileRoute\(["']([^"']+)["']\)/);
      if (!routeMatch) continue;
      const routePath = routeMatch[1];
      if (!routePath.startsWith("/") || routePath.includes("$") || routePath.includes("*")) continue;

      const canonicalMatches = [
        ...source.matchAll(/rel:\s*["']canonical["'][\s\S]{0,100}?href:\s*["'](https?:\/\/[^"']+)["']/g),
        ...source.matchAll(/href:\s*["'](https?:\/\/[^"']+)["'][\s\S]{0,100}?rel:\s*["']canonical["']/g),
      ];

      for (const match of canonicalMatches) {
        const canonical = new URL(match[1]);
        expect(canonical.origin, `${file}: canonical origin must be ${CANONICAL_ORIGIN}`).toBe(CANONICAL_ORIGIN);
        expect(canonical.search, `${file}: static canonical must not contain query parameters`).toBe("");
        expect(canonical.hash, `${file}: static canonical must not contain a fragment`).toBe("");
        expect(
          canonical.pathname.replace(/\/+$/, "") || "/",
          `${file}: canonical path must match its static route`,
        ).toBe(routePath.replace(/\/+$/, "") || "/");
      }
    }
  });
});
