import { BaseImporter } from "./BaseImporter";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

type OSMElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

export class OSMImporter extends BaseImporter<OSMElement> {
  readonly sourceType = "osm" as const;
  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<OSMElement[]> {
    if (
      !payload ||
      typeof payload !== "object" ||
      !Array.isArray((payload as { elements?: unknown }).elements)
    ) {
      throw new Error("Invalid Overpass API response");
    }
    return (payload as { elements: OSMElement[] }).elements.filter((element) => element.tags?.name);
  }

  async normalize(record: OSMElement, context: ImportContext): Promise<ImportEntityDraft> {
    const tags = record.tags ?? {};
    const latitude = record.lat ?? record.center?.lat ?? null;
    const longitude = record.lon ?? record.center?.lon ?? null;
    const entityType =
      tags.leisure === "park" ? "park" : (tags.tourism ?? tags.historic ?? "point_of_interest");
    return {
      externalId: `${record.type}/${record.id}`,
      entityType,
      name: tags.name,
      description: tags.description ?? null,
      latitude,
      longitude,
      address: {
        street: tags["addr:street"],
        houseNumber: tags["addr:housenumber"],
        city: tags["addr:city"],
        state: tags["addr:state"],
        postcode: tags["addr:postcode"],
      },
      taxonomy: ["openstreetmap", entityType],
      relationships: [],
      media: tags.image ? [{ url: tags.image, type: "image" }] : [],
      sourceUpdatedAt: null,
      sourceUrl: `https://www.openstreetmap.org/${record.type}/${record.id}`,
      metadata: { ...tags, importEndpoint: context.source.endpoint },
      raw: record,
    };
  }
}
