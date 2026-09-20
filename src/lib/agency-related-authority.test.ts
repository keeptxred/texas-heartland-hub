import { describe, expect, it } from "vitest";
import { getAgencyRelatedAuthorityLinks } from "./agency-related-authority";

const POLICING_HREF = "/news/texas-policing-agencies-compared";

describe("agency related authority links", () => {
  it("adds the policing comparison to DPS", () => {
    const links = getAgencyRelatedAuthorityLinks("texas-department-public-safety", [
      { label: "Criminal Justice Policy Tracker", href: "/policy/criminal-justice" },
    ]);
    expect(links.map((item) => item.href)).toContain(POLICING_HREF);
  });

  it("does not add the policing comparison to unrelated agencies", () => {
    const links = getAgencyRelatedAuthorityLinks("texas-education-agency", []);
    expect(links.map((item) => item.href)).not.toContain(POLICING_HREF);
  });
});
