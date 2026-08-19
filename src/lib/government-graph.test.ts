import { describe, expect, it } from "vitest";
import { getGovernmentGraphLinks } from "@/lib/government-graph";

describe("Government Graph matching", () => {
  it("connects property-tax reporting to permanent policy and data references", () => {
    const links = getGovernmentGraphLinks(
      "Texas property tax appraisal values and homestead exemptions are driving a new debate over local tax burdens and appraisal districts.",
      8,
    );
    const hrefs = links.map((link) => link.href);

    expect(hrefs.some((href) => href.startsWith("/policy/"))).toBe(true);
    expect(hrefs.some((href) => href.startsWith("/data/") || href.startsWith("/laws/topic/"))).toBe(true);
  });

  it("connects election reporting to Election Central", () => {
    const links = getGovernmentGraphLinks(
      "Candidates are campaigning ahead of the Texas primary election as voters review the ballot and new polling.",
      6,
    );

    expect(links.some((link) => link.href === "/elections/2026")).toBe(true);
  });

  it("connects contract and procurement reporting to Contract Watch", () => {
    const links = getGovernmentGraphLinks(
      "A Texas agency awarded a major procurement contract to a vendor after a solicitation, then approved a contract amendment and renewal.",
      6,
    );

    expect(links.some((link) => link.href === "/contracts")).toBe(true);
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
