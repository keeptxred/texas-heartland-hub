import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_HOUSE_VACANCIES,
  US_SENATORS,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  TEXAS_LEGISLATIVE_VACANCIES,
  findRepresentativeBySlug,
  representativeSlug,
} from "@/data/representatives";
import {
  REPRESENTATIVE_AUTHORITY,
  ALL_REPRESENTATIVE_AUTHORITY,
  US_HOUSE_COMMITTEES,
  getRepresentativeAuthority,
} from "@/data/representative-authority";
import {
  TEXAS_HOUSE_SEATS,
  TEXAS_LEGISLATIVE_SEATS,
  TEXAS_LEGISLATORS,
  TEXAS_SENATE_SEATS,
} from "@/data/texas-legislators.generated";

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
      getRepresentativeAuthority("kelly-hancock")?.sources.some((source) =>
        source.url.includes("comptroller.texas.gov"),
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
    for (const id of [
      "biography",
      "career",
      "education",
      "committees",
      "elections",
      "finance",
      "district",
      "news",
      "sources",
    ]) {
      expect(profile).toContain(`id="${id}"`);
    }
  });

  it("covers every representative exposed in the original authority directory", () => {
    const enrichedRepresentatives = [
      ...US_SENATORS,
      ...STATE_LEADERSHIP,
      ...US_HOUSE_DELEGATION,
    ].filter((representative) =>
      getRepresentativeAuthority(representativeSlug(representative.name)),
    );
    expect(REPRESENTATIVE_AUTHORITY.length).toBeGreaterThanOrEqual(enrichedRepresentatives.length);
    expect(REPRESENTATIVE_AUTHORITY).toHaveLength(46);
    expect(enrichedRepresentatives).toHaveLength(45);
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
      expect(findRepresentativeBySlug(representativeSlug(representative.name))).toEqual(
        representative,
      );
    }
  });

  it("publishes authority coverage for all 181 Texas legislative seats", () => {
    expect(TEXAS_LEGISLATIVE_SEATS).toHaveLength(181);
    expect(TEXAS_HOUSE_SEATS).toHaveLength(150);
    expect(TEXAS_SENATE_SEATS).toHaveLength(31);
    expect(TEXAS_LEGISLATORS).toHaveLength(180);
    expect(TEXAS_HOUSE_MEMBERS).toHaveLength(150);
    expect(TEXAS_SENATE_MEMBERS).toHaveLength(30);
    expect(TEXAS_LEGISLATIVE_VACANCIES).toEqual([
      expect.objectContaining({ district: "Senate District 22", label: "Vacant" }),
    ]);
    expect(new Set(TEXAS_LEGISLATORS.map((seat) => seat.slug)).size).toBe(180);
    expect(ALL_REPRESENTATIVE_AUTHORITY).toHaveLength(226);

    for (const seat of TEXAS_LEGISLATORS) {
      expect(findRepresentativeBySlug(seat.slug)?.district).toContain(String(seat.district));
      const authority = getRepresentativeAuthority(seat.slug);
      expect(authority?.biography).toBeTruthy();
      expect(authority?.career.length).toBeGreaterThan(0);
      expect(authority?.education.length).toBeGreaterThan(0);
      expect(authority?.committees.length).toBeGreaterThan(0);
      expect(authority?.electionHistory.length).toBeGreaterThan(0);
      expect(authority?.sources.length).toBeGreaterThanOrEqual(3);
    }
    expect(directory).toContain("Texas Senate — Current Members");
    expect(directory).toContain("Texas House — Current Members");
    expect(directory).toContain("Current Texas Legislature vacancies");
  });

  it("has current committee authority data for every seated House member", () => {
    expect(Object.keys(US_HOUSE_COMMITTEES)).toHaveLength(37);
    for (const representative of US_HOUSE_DELEGATION) {
      expect(US_HOUSE_COMMITTEES[representativeSlug(representative.name)]?.length).toBeGreaterThan(
        0,
      );
    }
    expect(profile).toContain("getHouseCommitteeAssignments");
    expect(profile).toContain("Official House directory and committee assignments");
    expect(profile).toContain("Federal Election Commission candidate records");
  });

  it("replaces verification notices with sourced editorial profiles for the first expansion batch", () => {
    for (const slug of [
      "nathaniel-moran",
      "keith-self",
      "jake-ellzey",
      "lizzie-fletcher",
      "morgan-luttrell",
      "al-green",
      "michael-mccaul",
      "august-pfluger",
      "craig-goldman",
      "randy-weber",
    ]) {
      const authority = getRepresentativeAuthority(slug);
      expect(authority?.education.length).toBeGreaterThan(0);
      expect(authority?.career.length).toBeGreaterThan(1);
      expect(authority?.electionHistory.length).toBeGreaterThan(0);
      expect(authority?.sources.some((source) => source.url.includes("house.gov"))).toBe(true);
    }
  });

  it("publishes the second sourced congressional editorial batch", () => {
    for (const slug of [
      "veronica-escobar",
      "pete-sessions",
      "christian-menefee",
      "jodey-arrington",
      "joaquin-castro",
      "troy-nehls",
      "roger-williams",
      "brandon-gill",
      "michael-cloud",
      "henry-cuellar",
    ]) {
      const authority = getRepresentativeAuthority(slug);
      expect(authority?.education.length).toBeGreaterThan(0);
      expect(authority?.career.length).toBeGreaterThan(1);
      expect(authority?.electionHistory.length).toBeGreaterThan(0);
      expect(authority?.sources.some((source) => source.url.includes("house.gov"))).toBe(true);
    }
  });

  it("publishes the final sourced congressional editorial batch", () => {
    for (const slug of [
      "sylvia-garcia",
      "jasmine-crockett",
      "john-carter",
      "julie-johnson",
      "marc-veasey",
      "vicente-gonzalez",
      "greg-casar",
      "brian-babin",
      "lloyd-doggett",
    ]) {
      const authority = getRepresentativeAuthority(slug);
      expect(authority?.education.length).toBeGreaterThan(0);
      expect(authority?.career.length).toBeGreaterThan(1);
      expect(authority?.electionHistory.length).toBeGreaterThan(0);
      expect(authority?.sources.some((source) => source.url.includes("house.gov"))).toBe(true);
    }
  });
});
