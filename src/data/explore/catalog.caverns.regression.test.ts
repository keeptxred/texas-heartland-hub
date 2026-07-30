import { describe, expect, it } from "vitest";
import type { ExploreJson } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";
import {
  cavernOwnershipAccessAudit,
  getCavernOwnershipAccessAudit,
} from "./catalog.caverns-access";
import { commercialCavernCatalog } from "./catalog.caverns";

const tpwdCavernSlugs = [
  "longhorn-cavern-state-park",
  "kickapoo-cavern-state-park",
] as const;

const getUnifiedDestination = (slug: string) => {
  const matches = exploreDestinations.filter((destination) => destination.slug === slug);
  expect(matches, `${slug} must exist exactly once in the unified catalog`).toHaveLength(1);
  return matches[0];
};

const expectUniqueNormalizedTerms = (terms: string[]) => {
  expect(new Set(terms).size).toBe(terms.length);

  for (const term of terms) {
    expect(term).toBe(term.trim());
    expect(term.length).toBeGreaterThan(0);
    expect(term).toBe(term.toLowerCase());
  }
};

function expectJsonObject(
  value: ExploreJson | undefined,
  label: string,
): { [key: string]: ExploreJson } {
  expect(value, label).toBeDefined();
  expect(value, label).not.toBeNull();
  expect(Array.isArray(value), label).toBe(false);
  expect(typeof value, label).toBe("object");
  return value as { [key: string]: ExploreJson };
}

describe("Explore Texas cavern catalog regression coverage", () => {
  it("keeps every commercial cavern exactly once in the unified destination catalog", () => {
    for (const cavern of commercialCavernCatalog) {
      const destination = getUnifiedDestination(cavern.slug);
      const tourInformation = expectJsonObject(
        destination.profile.tourInformation,
        `${cavern.slug} tourInformation must be an object`,
      );
      const visitorAccess = expectJsonObject(
        destination.profile.visitorAccess,
        `${cavern.slug} visitorAccess must be an object`,
      );

      expect(destination.id).toBe(cavern.slug);
      expect(destination.name).toBe(cavern.name);
      expect(destination.entityType).toBe("cavern");
      expect(destination.officialUrl).toBe(cavern.officialUrl);
      expect(destination.sourceUrl).toBe(cavern.officialUrl);
      expect(destination.feeRequired).toBe(cavern.admission_required);
      expect(destination.profile.operator).toBe(cavern.operator);
      expect(tourInformation.guidedTours).toBe(cavern.guided_tours);
      expect(visitorAccess.petPolicy).toBe(cavern.pet_policy);

      expectUniqueNormalizedTerms(destination.categories);
      expectUniqueNormalizedTerms(destination.tags);
    }
  });

  it("keeps TPWD cavern destinations canonical and duplicate-free", () => {
    for (const slug of tpwdCavernSlugs) {
      const destination = getUnifiedDestination(slug);

      expect(destination.slug).toBe(slug);
      expect(destination.sourceName).toBe("Texas Parks and Wildlife Department");
      expect(destination.officialUrl).toMatch(/^https:\/\/tpwd\.texas\.gov\/state-parks\//);
      expect(destination.profile.operator).toBe("Texas Parks and Wildlife Department");
      expect(destination.categories).toEqual(expect.arrayContaining(["cavern"]));
      expect(destination.tags).toContain("guided cave tour");
    }

    expect(exploreDestinations.some((destination) => destination.slug === "longhorn-cavern")).toBe(
      false,
    );
    expect(exploreDestinations.some((destination) => destination.slug === "kickapoo-cavern")).toBe(
      false,
    );
  });

  it("keeps canonical slugs, IDs, and official URLs unique across cavern destinations", () => {
    const cavernDestinations = exploreDestinations.filter(
      (destination) =>
        destination.entityType === "cavern" ||
        tpwdCavernSlugs.includes(destination.slug as (typeof tpwdCavernSlugs)[number]),
    );

    expect(new Set(cavernDestinations.map((destination) => destination.slug)).size).toBe(
      cavernDestinations.length,
    );
    expect(new Set(cavernDestinations.map((destination) => destination.id)).size).toBe(
      cavernDestinations.length,
    );

    const officialUrls = cavernDestinations
      .map((destination) => destination.officialUrl)
      .filter((url): url is string => Boolean(url));
    expect(new Set(officialUrls).size).toBe(officialUrls.length);

    expect(
      exploreDestinations.some(
        (destination) => destination.slug === "wonder-world-cave-and-adventure-park",
      ),
    ).toBe(false);
    expect(getUnifiedDestination("wonder-world-cave-adventure-park").name).toBe(
      "Wonder World Cave & Adventure Park",
    );
  });

  it("keeps the ownership and access audit complete and aligned with the catalog", () => {
    expect(cavernOwnershipAccessAudit).toHaveLength(commercialCavernCatalog.length);
    expect(
      new Set(cavernOwnershipAccessAudit.map((record) => record.destinationId)).size,
    ).toBe(cavernOwnershipAccessAudit.length);

    for (const cavern of commercialCavernCatalog) {
      const audit = getCavernOwnershipAccessAudit(cavern.id);

      expect(audit).not.toBeNull();
      expect(audit?.operator).toBe(cavern.operator);
      expect(audit?.publicAccess).toBe(true);
      expect(audit?.cavernEntryRequiresGuide).toBe(cavern.guided_tours);
      expect(audit?.admissionRequired).toBe(cavern.admission_required);
      expect(audit?.reservationsRecommended).toBe(cavern.reservations_recommended);
      expect(audit?.sourceUrl).toMatch(/^https:\/\//);
      expect(audit?.verificationStatus).toBe("official-source-reviewed");
      expect(audit?.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(audit?.accessSummary.trim().length).toBeGreaterThan(0);
      expect(audit?.ownershipNotes.trim().length).toBeGreaterThan(0);
    }
  });
});
