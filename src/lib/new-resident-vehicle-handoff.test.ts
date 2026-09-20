import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalInternalRedirectHref } from "./canonical-internal-redirects";

const ROOT = process.cwd();

describe("new-resident vehicle ownership handoff", () => {
  it("redirects the retired KTR relocation route permanently to the exact TexasDefined newcomer guide", () => {
    const source = readFileSync(join(ROOT, "src/routes/vehicles.new-residents.tsx"), "utf8");
    expect(source).toContain('href: `https://texasdefined.com/find-my-dmv${location.searchStr || ""}`');
    expect(source).toContain("statusCode: 308");
  });

  it("bypasses the retired KTR route in internal links while preserving state", () => {
    expect(canonicalInternalRedirectHref("/vehicles/new-residents?county=Harris#documents")).toBe(
      "https://texasdefined.com/find-my-dmv?county=Harris#documents",
    );
  });
});
