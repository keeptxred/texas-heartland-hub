import { describe, expect, it } from "vitest";
import { exploreDestinations } from "@/data/explore/all-destinations";
import { relatedCaverns } from "./cavern-discovery";
import {
  buildCavernBreadcrumbSchema,
  buildRelatedCavernItemListSchema,
} from "./cavern-structured-data";

const cavern = exploreDestinations.find((destination) => destination.entityType === "cavern");

if (!cavern) throw new Error("Expected the Explore catalog to contain at least one cavern");

describe("cavern structured data", () => {
  it("uses the cavern collection page in individual cavern breadcrumbs", () => {
    const schema = buildCavernBreadcrumbSchema(cavern);

    expect(schema?.itemListElement).toHaveLength(3);
    expect(schema?.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Texas caverns and caves",
      item: "https://keeptxred.com/explore/caverns",
    });
    expect(schema?.itemListElement[2]).toMatchObject({
      position: 3,
      name: cavern.name,
      item: `https://keeptxred.com/explore/${cavern.slug}`,
    });
  });

  it("builds an ordered related-cavern ItemList without the current cavern", () => {
    const recommendations = relatedCaverns(cavern, exploreDestinations, 3);
    const schema = buildRelatedCavernItemListSchema(cavern, recommendations);

    expect(schema?.numberOfItems).toBe(recommendations.length);
    expect(schema?.itemListElement.map((item) => item.position)).toEqual(
      recommendations.map((_, index) => index + 1),
    );
    expect(schema?.itemListElement.map((item) => item.url)).not.toContain(
      `https://keeptxred.com/explore/${cavern.slug}`,
    );
  });

  it("does not emit cavern schema for other destination types", () => {
    const nonCavern = exploreDestinations.find((destination) => destination.entityType !== "cavern");
    if (!nonCavern) throw new Error("Expected at least one non-cavern destination");

    expect(buildCavernBreadcrumbSchema(nonCavern)).toBeNull();
    expect(buildRelatedCavernItemListSchema(nonCavern, [])).toBeNull();
  });
});
