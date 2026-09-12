import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ROUTES = [
  "src/routes/elections.index.tsx",
  "src/routes/elections.methodology.tsx",
  "src/routes/elections.corrections.tsx",
] as const;

function headSource(path: string) {
  const source = readFileSync(path, "utf8");
  const start = source.indexOf("head:");
  const end = source.indexOf("component:", start);
  expect(start, `${path} must define a route head`).toBeGreaterThanOrEqual(0);
  expect(end, `${path} must define a component after its route head`).toBeGreaterThan(start);
  return source.slice(start, end);
}

describe("Election Central route-head branding", () => {
  it("uses the canonical Keep TX Red brand in migrated election metadata", () => {
    for (const path of ROUTES) {
      const head = headSource(path);
      expect(head, `${path} must not emit the legacy compact brand token`).not.toContain("KeepTXRed");
      expect(head, `${path} must emit the canonical brand name`).toContain("Keep TX Red");
    }
  });
});
