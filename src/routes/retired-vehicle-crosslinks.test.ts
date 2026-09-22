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

const EXACT_HANDOFFS = [
  ["vehicles.registration.tsx", "https://texasdefined.com/texas-vehicle-registration", 301],
  ["vehicles.renewal.tsx", "https://texasdefined.com/texas-vehicle-registration-renewal", 301],
  ["vehicles.registration-fees-taxes.tsx", "https://texasdefined.com/texas-vehicle-registration-fees-taxes", 301],
  ["vehicles.new-residents.tsx", "https://texasdefined.com/find-my-dmv", 308],
] as const;

const RETIRED_VEHICLE_GUIDES = [
  ["vehicles.plates.tsx", "/vehicles/plates", "#license-plates"],
  ["vehicles.buying-a-car.tsx", "/vehicles/buying-a-car", "#title-transfer"],
  ["vehicles.buying-selling.tsx", "/vehicles/buying-selling", "#title-transfer"],
  ["vehicles.selling-a-car.tsx", "/vehicles/selling-a-car", "#title-transfer"],
  ["vehicles.inspections.tsx", "/vehicles/inspections", ""],
  ["vehicles.duplicate-titles.tsx", "/vehicles/duplicate-titles", "#title-transfer"],
  ["vehicles.personalized-plates.tsx", "/vehicles/personalized-plates", "#license-plates"],
  ["vehicles.private-party-sales.tsx", "/vehicles/private-party-sales", "#title-transfer"],
  ["vehicles.commercial-fleet-irp.tsx", "/vehicles/commercial-fleet-irp", ""],
  ["vehicles.bonded-titles.tsx", "/vehicles/bonded-titles", "#title-transfer"],
  ["vehicles.disabled-parking.tsx", "/vehicles/disabled-parking", "#license-plates"],
  ["vehicles.title-transfer.tsx", "/vehicles/title-transfer", "#title-transfer"],
  ["vehicles.temporary-tags.tsx", "/vehicles/temporary-tags", ""],
  ["vehicles.financial-responsibility.tsx", "/vehicles/financial-responsibility", ""],
  ["vehicles.farm-antique-specialty.tsx", "/vehicles/farm-antique-specialty", "#license-plates"],
  ["vehicles.auto-insurance-requirements.tsx", "/vehicles/auto-insurance-requirements", ""],
  ["vehicles.inspections-emissions.tsx", "/vehicles/inspections-emissions", ""],
  ["vehicles.salvage-rebuilt-titles.tsx", "/vehicles/salvage-rebuilt-titles", "#title-transfer"],
  ["vehicles.liens-duplicate-corrected-titles.tsx", "/vehicles/liens-duplicate-corrected-titles", "#title-transfer"],
] as const;

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
  it("keeps the parent vehicle tree as a permanent TexasDefined handoff", () => {
    const source = readFileSync(new URL("./vehicles.tsx", import.meta.url), "utf8");
    expect(source).toContain('createFileRoute("/vehicles")');
    expect(source).toContain('"/texas-vehicle-registration"');
    expect(source).toContain('"#license-plates"');
    expect(source).toContain('"#title-transfer"');
    expect(source).toContain("location.searchStr");
    expect(source).toContain("statusCode: 301");
  });

  it.each(EXACT_HANDOFFS)("keeps %s as a permanent query-preserving exact-owner handoff", (file, destination, status) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(destination);
    expect(source).toContain("location.searchStr");
    expect(source).toContain(`statusCode: ${status}`);
  });

  it.each(RETIRED_VEHICLE_GUIDES)("keeps retired vehicle guide %s redirect-only", (file, route, hash) => {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
    expect(source).toContain(`createFileRoute("${route}")`);
    expect(source).toContain('const TEXASDEFINED_PATH = "/texas-vehicle-registration"');
    expect(source).toContain(`const TEXASDEFINED_HASH = "${hash}"`);
    expect(source).toContain("location.searchStr");
    expect(source).toContain("statusCode: 301");
    expect(source).not.toContain("buildSeo");
    expect(source).not.toContain("component:");
    expectNoRetiredTargets(file);
  });
});
