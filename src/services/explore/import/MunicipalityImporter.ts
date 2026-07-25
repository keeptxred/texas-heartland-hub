import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class MunicipalityImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "municipality" as const;

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
      idFields: stringArray(metadata.idFields, ["id", "facility_id", "location_id", "OBJECTID"]),
      nameFields: stringArray(metadata.nameFields, [
        "name",
        "facility_name",
        "location_name",
        "title",
      ]),
      descriptionFields: stringArray(metadata.descriptionFields, [
        "description",
        "summary",
        "details",
        "notes",
      ]),
      taxonomy: uniqueStrings(["municipal", ...stringArray(metadata.taxonomy, [])]),
    });
  }
}

function stringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : fallback;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
