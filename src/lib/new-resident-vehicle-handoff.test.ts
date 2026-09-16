import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalInternalRedirectHref } from "./canonical-internal-redirects";

const ROOT = process.cwd();

describe("new-resident vehicle ownership handoff", () => {
  it("redirects the retired KTR relocation route permanently to TexasDefined", () => {
    const source = readFileSync(join(ROOT, "src/routes/vehicles.new-residents.tsx"), "utf8");
    expect(source).toContain('href: `https://texasdefined.com/texas-vehicle-registration${location.searchStr || ""}`');
    expect(source).toContain("statusCode: 301");
  });

  it("bypasses the retired KTR route in internal links while preserving state", () => {
    expect(canonicalInternalRedirectHref("/vehicles/new-residents?county=Harris#documents")).toBe(
      "https://texasdefined.com/texas-vehicle-registration?county=Harris#documents",
    );
  });
});
