import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { inferArticleImageDomain } from "./featured-image-core";

describe("article image domain priority", () => {
  it("keeps a festival story in culture even when body text contains court language", () => {
    expect(
      inferArticleImageDomain(
        "Texas Pickle Festival Moves to Helotes After Last Year’s Crowd Backlash",
        "The festival moved after complaints. A separate paragraph mentions a court ruling and election law.",
      ),
    ).toBe("culture");
  });

  it("still recognizes a genuinely legal headline as legal", () => {
    expect(
      inferArticleImageDomain(
        "Texas Court Upholds Election Integrity Law Amid Democratic Challenges",
        "The ruling came from a Texas appellate court.",
      ),
    ).toBe("legal");
  });

  it("keeps Purple Heart coverage in the military domain", () => {
    expect(
      inferArticleImageDomain(
        "Governor Marks Purple Heart Day for Texas Veterans",
        "The governor signed a proclamation at the Capitol.",
      ),
    ).toBe("military");
  });

  it("does not retain the SVG military-honor bypass", () => {
    const source = readFileSync(new URL("./featured-image.functions.ts", import.meta.url), "utf8");
    expect(source).not.toContain("PURPLE_HEART_IMAGE_URL");
    expect(source).not.toContain("staticFeaturedImage");
    expect(source).not.toContain("static military-honor asset");
  });
});

// These cases are taken directly from recent production failures where the old
// first-match router sent a valid news story to an unrelated visual category.
describe("production regression image routing", () => {
  it("does not mistake ordinary Texans or property-tax coverage for sports", () => {
    expect(inferArticleImageDomain(
      "Texas cities eye property tax hikes, spending cuts amid yawning budget gaps",
      "Texans are watching city budgets and proposed property tax increases",
    )).toBe("housing");
  });

  it("routes airport policy stories to the actual airport instead of sports or military", () => {
    expect(inferArticleImageDomain(
      "Texas Governor Abbott Targets Airports Over Alleged Religious Discrimination",
      "The review covers DFW Airport and George Bush Intercontinental Airport",
    )).toBe("transportation");
  });

  it("handles the shorter plural-airports production headline too", () => {
    expect(inferArticleImageDomain(
      "Texas Airports Face Review Over Religious Facilities",
      "Texas officials are reviewing grants to airports including DFW Airport and George Bush Intercontinental Airport",
    )).toBe("transportation");
  });

  it("routes cross-country schedules to sports rather than generic classrooms", () => {
    expect(inferArticleImageDomain(
      "Texas Colleges Announce 2026 Cross Country Schedules",
      "Baylor and Houston runners open the cross country season",
    )).toBe("sports");
  });

  it("routes election-fraud acquittals to legal imagery rather than housing", () => {
    expect(inferArticleImageDomain(
      "Jury Acquits Granbury City Council Candidate in Election Fraud Case",
      "A Hood County jury returned an acquittal",
    )).toBe("legal");
  });

  it("keeps multi-topic governor agendas in politics instead of a single agenda-item domain", () => {
    expect(inferArticleImageDomain(
      "Gov. Abbott outlines 2027 agenda with closed primaries, data center rules, school choice",
      "The governor described election policy, energy oversight and education priorities",
    )).toBe("politics");
  });

  it("recognizes surrogacy and parental-rights litigation as legal coverage", () => {
    expect(inferArticleImageDomain(
      "Texas surrogate's fight for parental rights could reshape surrogacy laws",
      "The custody dispute could reshape Texas surrogacy law",
    )).toBe("legal");
  });
});
