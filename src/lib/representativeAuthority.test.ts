import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_HOUSE_VACANCIES,
  US_SENATORS,
  findRepresentativeBySlug,
  representativeSlug,
} from "@/data/representatives";
import {
  REPRESENTATIVE_AUTHORITY,
  getRepresentativeAuthority,
} from "@/data/representative-authority";

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

  it("publishes complete, sourced authority sections for statewide officials", () => {
    expect(getRepresentativeAuthority("john-cornyn")?.committees.length).toBeGreaterThan(0);
    expect(getRepresentativeAuthority("greg-abbott")?.education.length).toBeGreaterThan(0);
    expect(
      getRepresentativeAuthority("don-huffines")?.sources.some((source) =>
        source.url.includes("gov.texas.gov"),
      ),
    ).toBe(true);
    expect(
      REPRESENTATIVE_AUTHORITY.every(
        (authority) =>
          authority.biography &&
          authority.career.length &&
          authority.education.length &&
          authority.committees.length &&
          authority.electionHistory.length &&
          authority.districtOverview &&
          authority.financeUrl &&
          authority.sources.length,
      ),
    ).toBe(true);
    for (const id of ["biography", "career", "education", "committees", "elections", "finance", "district", "news", "sources"]) {
      expect(profile).toContain(`id="${id}"`);
    }
  });

  it("covers every representative exposed in the original authority directory", () => {
    const enrichedRepresentatives = [...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION]
      .filter((representative) => getRepresentativeAuthority(representativeSlug(representative.name)));
    expect(REPRESENTATIVE_AUTHORITY).toHaveLength(enrichedRepresentatives.length);
    expect(REPRESENTATIVE_AUTHORITY).toHaveLength(16);
  });

  it("publishes the complete current Texas House delegation and vacancy status", () => {
    expect(US_HOUSE_DELEGATION).toHaveLength(37);
    expect(US_HOUSE_VACANCIES).toEqual([
      expect.objectContaining({ district: "TX-23", label: "Vacant" }),
    ]);
    const districts = US_HOUSE_DELEGATION.map((representative) =>
      Number(/^TX-(\d+)/.exec(representative.district ?? "")?.[1]),
    );
    expect(new Set(districts).size).toBe(37);
    expect(districts).not.toContain(23);
    expect(directory).toContain("U.S. House — Complete Texas Delegation");
    expect(directory).not.toContain("Texas Republican Delegation");
    const directoryRepresentatives = [...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION];
    for (const representative of directoryRepresentatives) {
      expect(findRepresentativeBySlug(representativeSlug(representative.name))).toEqual(representative);
    }
  });
});
