import { describe, expect, it } from "vitest";
import { extractRecords, normalizeFeature } from "./json-feature";

describe("Explore import JSON feature utilities", () => {
  it("extracts GeoJSON features", () => {
    const records = extractRecords({
      type: "FeatureCollection",
      features: [
        { type: "Feature", properties: { id: "one" } },
        null,
        "invalid",
      ],
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ type: "Feature" });
  });

  it("normalizes identifiers, coordinates, media, and dates", () => {
    const draft = normalizeFeature({
      type: "Feature",
      geometry: { type: "Point", coordinates: [-97.7431, 30.2672] },
      properties: {
        OBJECTID: 42,
        site_name: "Capitol Grounds",
        description: "Public grounds surrounding the Texas Capitol.",
        image_url: "https://example.gov/capitol.jpg",
        updated_at: "2026-07-24T12:00:00Z",
      },
    }, {
      entityType: "historic_site",
      sourceUrl: "https://example.gov/data",
      idFields: ["OBJECTID"],
      nameFields: ["site_name"],
      taxonomy: ["historic-sites"],
    });

    expect(draft).toMatchObject({
      externalId: "42",
      entityType: "historic_site",
      name: "Capitol Grounds",
      latitude: 30.2672,
      longitude: -97.7431,
      taxonomy: ["historic-sites"],
      sourceUpdatedAt: "2026-07-24T12:00:00.000Z",
    });
    expect(draft.media).toEqual([{ url: "https://example.gov/capitol.jpg", type: "image" }]);
  });

  it("rejects records without stable identifiers", () => {
    expect(() => normalizeFeature({ name: "Unnamed record" }, {
      entityType: "place",
      idFields: ["id"],
      nameFields: ["name"],
    })).toThrow("Missing external identifier");
  });
});
