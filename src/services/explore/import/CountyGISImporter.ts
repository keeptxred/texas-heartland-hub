import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class CountyGISImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "county_gis" as const;

  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }

  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    const metadata = context.source.metadata ?? {};
    return normalizeFeature(record, {
      entityType: typeof metadata.entityType === "string" ? metadata.entityType : "place",
      sourceUrl: context.source.endpoint,
      idFields: stringArray(metadata.idFields, [
        "OBJECTID",
        "objectid",
        "id",
        "facility_id",
        "site_id",
      ]),
      nameFields: stringArray(metadata.nameFields, [
        "name",
        "site_name",
        "facility_name",
        "park_name",
        "title",
      ]),
      descriptionFields: stringArray(metadata.descriptionFields, [
        "description",
        "summary",
        "notes",
      ]),
      taxonomy: uniqueStrings(["county-gis", ...stringArray(metadata.taxonomy, [])]),
    });
  }
}

function stringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : fallback;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
