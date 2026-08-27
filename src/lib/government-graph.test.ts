import { describe, expect, it } from "vitest";
import { getGovernmentGraphLinks } from "@/lib/government-graph";

describe("Government Graph matching", () => {
  it("connects property-tax reporting to durable hubs without leaking quarantined details", () => {
    const links = getGovernmentGraphLinks(
      "Texas property tax data, appraisal values and homestead exemptions are driving a new debate over local tax burdens and appraisal districts.",
      8,
    );
    const hrefs = links.map((link) => link.href);

    expect(hrefs).toContain("/data");
    expect(hrefs).not.toContain("/data/property-tax");
  });

  it("connects election reporting to Election Central", () => {
    const links = getGovernmentGraphLinks(
      "Candidates are campaigning ahead of the Texas primary election as voters review the ballot and new polling.",
      6,
    );

    expect(links.some((link) => link.href === "/elections/2026")).toBe(true);
  });

  it("connects procurement reporting to durable government/data hubs while Contract Watch is quarantined", () => {
    const links = getGovernmentGraphLinks(
      "A state agency awarded a procurement contract and published contract data after a competitive solicitation and later amendment.",
      8,
    );
    const hrefs = links.map((link) => link.href);

    expect(hrefs).toContain("/data");
    expect(hrefs).toContain("/texas-government/agencies");
    expect(hrefs).not.toContain("/data/contracts");
  });

  it("connects agency rulemaking reporting to durable government/data hubs while Rule Watch is quarantined", () => {
    const links = getGovernmentGraphLinks(
      "The state agency published proposed rule data with a public comment deadline before adoption and an eventual effective date.",
      8,
    );
    const hrefs = links.map((link) => link.href);

    expect(hrefs).toContain("/data");
    expect(hrefs).toContain("/texas-government/agencies");
    expect(hrefs).not.toContain("/data/rules");
  });

  it("honors exclusions so pages do not recommend duplicate destinations", () => {
    const links = getGovernmentGraphLinks(
      "The Texas Legislature is considering a bill in committee before lawmakers vote.",
      6,
      ["/texas-legislature", "/bills"],
    );
    const hrefs = links.map((link) => link.href);

    expect(hrefs).not.toContain("/texas-legislature");
    expect(hrefs).not.toContain("/bills");
  });
});
