import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));

const CASES = [
  ["laws.texas-gun-laws-explained.tsx", "/laws/texas-gun-laws-explained", "/news/texas-gun-laws-explained"],
  ["laws.texas-property-tax-laws-explained.tsx", "/laws/texas-property-tax-laws-explained", "/news/texas-property-tax-laws-explained"],
  ["laws.texas-election-laws-explained.tsx", "/laws/texas-election-laws-explained", "/news/texas-election-laws-explained"],
  ["laws.texas-new-laws-2026.tsx", "/laws/texas-new-laws-2026", "/news/texas-new-laws-2026"],
  ["laws.texas-constitution.tsx", "/laws/texas-constitution", "/laws"],
] as const;

describe("legacy Texas law URL redirects", () => {
  it.each(CASES)("preserves %s with a permanent canonical redirect", (file, legacyPath, targetPath) => {
    const source = readFileSync(resolve(HERE, file), "utf8");
    expect(source).toContain(`createFileRoute(\"${legacyPath}\")`);
    expect(source).toContain(`href: \`${targetPath}`);
    expect(source).toContain("statusCode: 301");
  });
});
