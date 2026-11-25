import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(path, "utf8");
describe("public policy and operational disclosures", () => {
  it("states the actual US-only checkout policy", () => {
    expect(read("src/lib/checkout.functions.ts")).toContain('address.country !== "US"');
    expect(read("src/routes/shipping-policy.tsx")).toContain("International checkout is not available.");
    expect(read("src/routes/terms-of-service.tsx")).toContain("ships only to U.S. addresses");
  });
  it("discloses the Census address lookup and browser cart storage", () => {
    const privacy = read("src/routes/privacy.tsx");
    expect(privacy).toContain("U.S. Census Bureau geocoder");
    expect(privacy).toContain("Census TIGERweb");
    expect(privacy).toContain("may retain their own technical records");
    expect(privacy).toContain("stores cart selections in your browser");
    expect(read("src/routes/find-representative.tsx")).toContain('to="/privacy"');
  });
  it("does not present automated checks as human review or search indexing", () => {
    const standards = read("src/routes/editorial-standards.tsx");
    expect(standards).toContain("Passing an automated check does not establish");
    expect(standards).toContain("Historical reporting is not relabeled as new");
    expect(standards).toContain("Links should help explain the subject");
    expect(read("src/routes/contact.tsx")).toContain("Do not email a full payment card number");
  });
});
