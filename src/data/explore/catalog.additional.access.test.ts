import { describe, expect, it } from "vitest";
import { destinations } from "./catalog.additional";

type AccessExpectation = {
  name: string;
  publicAccess: boolean;
  ownership: "Federal" | "Private conservation easement" | "Federal/state management overlay";
  parentUnit: string;
};

const accessExpectations: AccessExpectation[] = [
  {
    name: "Jocelyn Nungaray National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "McFaddin National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "Texas Point National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "Moody National Wildlife Refuge",
    publicAccess: false,
    ownership: "Private conservation easement",
    parentUnit: "Texas Chenier Plain National Wildlife Refuge Complex",
  },
  {
    name: "Brazoria National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "San Bernard National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "Big Boggy National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "Matagorda Island National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal/state management overlay",
    parentUnit: "Aransas National Wildlife Refuge",
  },
  {
    name: "Laguna Atascosa National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "South Texas National Wildlife Refuge Complex",
  },
  {
    name: "Lower Rio Grande Valley National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "South Texas National Wildlife Refuge Complex",
  },
  {
    name: "Santa Ana National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "South Texas National Wildlife Refuge Complex",
  },
  {
    name: "Aransas National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Aransas National Wildlife Refuge Complex",
  },
  {
    name: "Hagerman National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Hagerman National Wildlife Refuge",
  },
  {
    name: "Attwater Prairie Chicken National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Texas Mid-Coast National Wildlife Refuge Complex",
  },
  {
    name: "Balcones Canyonlands National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Balcones Canyonlands National Wildlife Refuge",
  },
  {
    name: "Caddo Lake National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Caddo Lake National Wildlife Refuge",
  },
  {
    name: "Muleshoe National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Muleshoe National Wildlife Refuge",
  },
  {
    name: "Buffalo Lake National Wildlife Refuge",
    publicAccess: true,
    ownership: "Federal",
    parentUnit: "Buffalo Lake National Wildlife Refuge",
  },
];

const getRefuge = (name: string) => {
  const destination = destinations.find((item) => item.name === name);
  expect(destination, `${name} must exist in the structured catalog`).toBeDefined();
  return destination!;
};

describe("Explore Texas wildlife refuge access and ownership audit", () => {
  it.each(accessExpectations)(
    "keeps verified access, ownership, and parent-unit data for $name",
    ({ name, publicAccess, ownership, parentUnit }) => {
      const refuge = getRefuge(name);

      expect(refuge.profile).toMatchObject({
        publicAccess,
        ownership,
        parentUnit,
      });

      expect(refuge.profile.accessNotes).toBe(refuge.profile.accessNotes.trim());
      expect(refuge.profile.accessNotes.length).toBeGreaterThan(20);
      expect(refuge.profile.accessNotes).toMatch(/[.!]$/);
    },
  );

  it("keeps closed refuges free of visitor activities and amenities", () => {
    const refuge = getRefuge("Moody National Wildlife Refuge");

    expect(refuge.profile.publicAccess).toBe(false);
    expect(refuge.activities).toEqual([]);
    expect(refuge.amenities).toEqual([]);
    expect(refuge.isFamilyFriendly).toBe(false);
    expect(refuge.isAccessible).toBe(false);
    expect(refuge.profile.accessNotes).toMatch(/closed to public access/i);
  });

  it("labels Big Boggy as limited-use rather than general visitor access", () => {
    const refuge = getRefuge("Big Boggy National Wildlife Refuge");

    expect(refuge.profile.publicAccess).toBe(true);
    expect(refuge.profile.accessNotes).toMatch(/not open for general public use/i);
    expect(refuge.profile.accessNotes).toMatch(/regulated waterfowl hunting and fishing/i);
    expect(refuge.profile.accessNotes).toMatch(/no refuge restrooms or developed visitor facilities/i);
    expect(refuge.amenities).not.toContain("restrooms");
    expect(refuge.amenities).not.toContain("visitor center");
    expect(refuge.amenities).not.toContain("trails");
  });

  it("documents boat-only access and shared management for Matagorda Island", () => {
    const refuge = getRefuge("Matagorda Island National Wildlife Refuge");

    expect(refuge.profile.accessNotes).toMatch(/no public road or ferry/i);
    expect(refuge.profile.accessNotes).toMatch(/private boat access/i);
    expect(refuge.profile.ownership).toBe("Federal/state management overlay");
    expect(refuge.profile.parentUnit).toBe("Aransas National Wildlife Refuge");
    expect(refuge.amenities).toContain("boat access");
  });

  it("does not expose unsupported ownership or blank parent-unit values", () => {
    const allowedOwnershipValues = new Set([
      "Federal",
      "Private conservation easement",
      "Federal/state management overlay",
    ]);

    for (const { name } of accessExpectations) {
      const refuge = getRefuge(name);
      expect(allowedOwnershipValues.has(refuge.profile.ownership)).toBe(true);
      expect(refuge.profile.parentUnit.trim().length).toBeGreaterThan(0);
    }
  });
});
