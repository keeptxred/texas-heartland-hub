import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  findRepresentativeBySlug,
  representativeSlug,
} from "@/data/representatives";

const profile = readFileSync(
  resolve(process.cwd(), "src/routes/representatives.$representativeSlug.tsx"),
  "utf8",
);
const directory = readFileSync(resolve(process.cwd(), "src/routes/representatives.tsx"), "utf8");

describe("representative authority pages", () => {
  it("provides stable representative slugs", () => {
    expect(representativeSlug("Dan Crenshaw")).toBe("dan-crenshaw");
    expect(findRepresentativeBySlug("greg-abbott")?.office).toBe("Governor");
  });

  it("links the directory and bill sponsors to real profile routes", () => {
    expect(directory).toContain('to="/representatives/$representativeSlug"');
    expect(profile).toContain("getRepresentativeLegislation");
    expect(profile).toContain("canonicalBillPath");
  });

  it("publishes profile, person, bill-list, and breadcrumb schema", () => {
    for (const type of ["ProfilePage", "Person", "ItemList", "BreadcrumbList"]) {
      expect(profile).toContain(`"@type": "${type}"`);
    }
  });

  it("cross-links elections, districts, bills, and legislative resources", () => {
    for (const path of [
      "/elections/candidates",
      "/elections/districts",
      "/bills",
      "/texas-legislature",
      "/find-representative",
      "/contact-legislators",
    ]) {
      expect(profile).toContain(path);
    }
  });
});
