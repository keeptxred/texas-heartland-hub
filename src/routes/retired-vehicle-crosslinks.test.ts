import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const RETIRED_INTERNAL_HREFS = [
  'href="/dmv"',
  'href="/vehicles/registration"',
  'href="/vehicles/renewal"',
  'href="/vehicles/registration-fees-taxes"',
] as const;

const RETIRED_INTERNAL_SCHEMA_TARGETS = [
  "${SITE_URL}/dmv`",
  "${SITE_URL}/vehicles/registration`",
  "${SITE_URL}/vehicles/renewal`",
  "${SITE_URL}/vehicles/registration-fees-taxes`",
] as const;

const HANDOFFS = [
  ["vehicles.registration.tsx", "https://texasdefined.com/texas-vehicle-registration"],
  ["vehicles.renewal.tsx", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["vehicles.registration-fees-taxes.tsx", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
] as const;

const EXTRA_ACTIVE_ROUTE_FILES = ["dmv.texas-dmv-vs-dps.tsx"] as const;

function expectNoRetiredTargets(routeFile: string) {
  const source = readFileSync(new URL(`./${routeFile}`, import.meta.url), "utf8");

  for (const retiredHref of RETIRED_INTERNAL_HREFS) {
    expect(source, `${routeFile} still links to ${retiredHref}`).not.toContain(retiredHref);
  }

  for (const retiredSchemaTarget of RETIRED_INTERNAL_SCHEMA_TARGETS) {
    expect(source, `${routeFile} still declares exact retired schema target ${retiredSchemaTarget}`).not.toContain(
      retiredSchemaTarget,
    );
  }
}

describe("retired vehicle authority handoffs", () => {
  it.each(EXTRA_ACTIVE_ROUTE_FILES)("keeps active DMV route %s free of retired internal targets", (routeFile) => {
    expectNoRetiredTargets(routeFile);
  });

  it.each(HANDOFFS)("keeps %s as a permanent query-preserving exact-owner handoff", (file, destination) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(destination);
    expect(source).toContain("location.searchStr");
    expect(source).toContain("statusCode: 301");
  });
});
