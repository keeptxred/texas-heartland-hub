import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ACTIVE_RELOCATION_FILES = [
  "dmv.tsx",
  "dmv.change-address.tsx",
  "dmv.driver-license.tsx",
  "dmv.real-id.tsx",
  "vehicles.new-residents.tsx",
  "vehicles.registration.tsx",
] as const;

const LEGACY_RELOCATION_ROUTES = [
  "moving-to-texas.tsx",
  "moving-to-texas-checklist.tsx",
  "moving-checklist.tsx",
] as const;

const TEXASDEFINED_RELOCATION = "https://texasdefined.com/moving-to-texas";

describe("active relocation cross-site handoffs", () => {
  it.each(ACTIVE_RELOCATION_FILES)("routes retired lifestyle links in %s to TexasDefined", (file) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(TEXASDEFINED_RELOCATION);
    expect(source).not.toContain('href="/moving-to-texas"');
    expect(source).not.toContain('href="/moving-to-texas-checklist"');
  });

  it.each(LEGACY_RELOCATION_ROUTES)("redirects legacy route %s directly to the current TexasDefined relocation page", (file) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(TEXASDEFINED_RELOCATION);
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain("texasdefined.com/moving-to-texas-checklist");
  });
});
