import { describe, expect, it } from "vitest";
import {
  getMajorSpringOwnershipAccessAudit,
  getMajorSpringOwnershipAccessAuditByDestination,
  majorSpringOwnershipAccessAudit,
} from "./catalog.major-springs-access";
import { majorSpringCatalog } from "./catalog.major-springs";

describe("major spring ownership and visitor access audit", () => {
  it("covers every spring record exactly once", () => {
    expect(majorSpringOwnershipAccessAudit).toHaveLength(majorSpringCatalog.length);
    expect(
      new Set(majorSpringOwnershipAccessAudit.map((record) => record.springId)).size,
    ).toBe(majorSpringOwnershipAccessAudit.length);
    expect(
      new Set(majorSpringOwnershipAccessAudit.map((record) => record.springSlug)).size,
    ).toBe(majorSpringOwnershipAccessAudit.length);

    for (const spring of majorSpringCatalog) {
      const audit = getMajorSpringOwnershipAccessAudit(spring.slug);

      expect(audit).not.toBeNull();
      expect(audit?.springId).toBe(spring.id);
      expect(audit?.integrationMode).toBe(spring.integrationMode);
      expect(audit?.destinationSlug).toBe(spring.existingDestinationSlug ?? spring.slug);
      expect(audit?.operator).toBe(spring.managingOrganization);
      expect(audit?.publicAccess).toBe(spring.publicAccess);
      expect(audit?.accessStatus).toBe(spring.accessStatus);
      expect(audit?.admissionRequired).toBe(spring.feeRequired);
      expect(audit?.reservationsRecommended).toBe(spring.reservationsRecommended);
      expect(audit?.sourceUrl).toBe(spring.officialUrl);
      expect(audit?.sourceName).toBe(spring.sourceName);
      expect(audit?.verificationStatus).toBe("official-source-reviewed");
      expect(audit?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(audit?.accessSummary.trim().length).toBeGreaterThan(0);
      expect(audit?.ecologicalSensitivity.trim().length).toBeGreaterThan(0);
    }
  });

  it("maps San Solomon Springs to the Balmorhea destination", () => {
    const springAudit = getMajorSpringOwnershipAccessAudit("san-solomon-springs");
    const destinationAudit = getMajorSpringOwnershipAccessAuditByDestination(
      "balmorhea-state-park",
    );

    expect(springAudit).not.toBeNull();
    expect(destinationAudit).toEqual(springAudit);
    expect(springAudit?.integrationMode).toBe("enrich-existing");
    expect(springAudit?.ownershipClassification).toBe("public-state-managed");
    expect(springAudit?.visitorAccessModel).toBe("ticketed-public-swimming");
    expect(springAudit?.swimmingPermitted).toBe(true);
  });

  it("preserves restricted swimming access at Spring Lake and Jacob's Well", () => {
    const springLake = getMajorSpringOwnershipAccessAudit(
      "san-marcos-springs-spring-lake",
    );
    const jacobsWell = getMajorSpringOwnershipAccessAudit("jacobs-well-natural-area");

    expect(springLake?.visitorAccessModel).toBe("scheduled-program-access");
    expect(springLake?.swimmingPermitted).toBe(false);
    expect(springLake?.swimmingProgramOnly).toBe(true);

    expect(jacobsWell?.visitorAccessModel).toBe("public-natural-area-no-swimming");
    expect(jacobsWell?.swimmingPermitted).toBe(false);
    expect(jacobsWell?.swimmingProgramOnly).toBe(false);
    expect(jacobsWell?.accessStatus).toBe("open-no-swimming");
  });

  it("supports public and verified private visitor-access ownership models", () => {
    const ownershipClassifications = new Set(
      majorSpringOwnershipAccessAudit.map((audit) => audit.ownershipClassification),
    );

    expect(ownershipClassifications).toEqual(
      expect.objectContaining({
        size: 6,
      }),
    );
    expect(ownershipClassifications).toContain("private-family-operated");
    expect(ownershipClassifications).toContain("private-association-managed");

    for (const audit of majorSpringOwnershipAccessAudit) {
      expect(audit.ownershipClassification).toMatch(/^(public|private)-/);
      expect(audit.ownershipLabel.trim().length).toBeGreaterThan(0);
      expect(audit.operator.trim().length).toBeGreaterThan(0);
      expect(audit.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("classifies Krause Springs and Las Moras Springs without inferring public ownership", () => {
    expect(getMajorSpringOwnershipAccessAudit("krause-springs")).toMatchObject({
      ownershipClassification: "private-family-operated",
      visitorAccessModel: "ticketed-public-swimming",
      swimmingPermitted: true,
    });
    expect(getMajorSpringOwnershipAccessAudit("las-moras-springs-fort-clark")).toMatchObject({
      ownershipClassification: "private-association-managed",
      visitorAccessModel: "ticketed-public-swimming",
      swimmingPermitted: true,
    });
  });
});
