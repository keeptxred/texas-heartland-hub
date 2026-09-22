import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ACTIVE_RELOCATION_HANDOFFS = [
  ["dmv.tsx", "https://texasdefined.com/texas-dmv"],
  ["dmv.change-address.tsx", "https://texasdefined.com/texas-drivers-license"],
  ["dmv.driver-license.tsx", "https://texasdefined.com/texas-drivers-license"],
  ["dmv.real-id.tsx", "https://texasdefined.com/texas-drivers-license"],
  ["dmv.texas-dmv-vs-dps.tsx", "https://texasdefined.com/texas-dmv"],
  ["vehicles.new-residents.tsx", "https://texasdefined.com/find-my-dmv"],
  ["vehicles.registration.tsx", "https://texasdefined.com/texas-vehicle-registration"],
] as const;

const LEGACY_RELOCATION_ROUTES = [
  "moving-to-texas.tsx",
  "moving-to-texas-checklist.tsx",
  "moving-checklist.tsx",
] as const;

const TEXASDEFINED_RELOCATION = "https://texasdefined.com/moving-to-texas";

describe("active relocation cross-site handoffs", () => {
  it.each(ACTIVE_RELOCATION_HANDOFFS)("routes retired lifestyle links in %s to its TexasDefined owner", (file, destination) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(destination);
    expect(source).not.toContain('href="/moving-to-texas"');
    expect(source).not.toContain('href="/moving-to-texas-checklist"');
  });

  it("keeps the retired vehicle registration route as a permanent exact-owner handoff", () => {
    const source = readFileSync(new URL("./vehicles.registration.tsx", import.meta.url), "utf8");
    expect(source).toContain("https://texasdefined.com/texas-vehicle-registration");
    expect(source).toContain("statusCode: 301");
  });

  it("keeps the new-resident vehicle route as a permanent exact-owner handoff", () => {
    const source = readFileSync(new URL("./vehicles.new-residents.tsx", import.meta.url), "utf8");
    expect(source).toContain("https://texasdefined.com/find-my-dmv");
    expect(source).toContain("statusCode: 308");
  });

  it.each(LEGACY_RELOCATION_ROUTES)("redirects legacy route %s directly to the current TexasDefined relocation page", (file) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(TEXASDEFINED_RELOCATION);
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain("texasdefined.com/moving-to-texas-checklist");
  });
});
