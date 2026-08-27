import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES = [
  ["explore.lake.$slug.tsx", "/explore/lake/$slug"],
  ["explore.river.$slug.tsx", "/explore/river/$slug"],
  ["explore.cavern.$slug.tsx", "/explore/cavern/$slug"],
  ["explore.state-park.$slug.tsx", "/explore/state-park/$slug"],
] as const;

describe("typed Explore compatibility redirects", () => {
  it.each(CASES)("routes %s directly to its TexasDefined owner", (file, routePath) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${routePath}\")`);
    expect(source).toContain("https://texasdefined.com${location.pathname}${location.searchStr || \"\"}");
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain('to: "/explore/$slug"');
  });
});
