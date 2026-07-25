import { BaseImporter } from "./BaseImporter";
import { extractRecords, normalizeFeature, type JsonRecord } from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class USFSImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "usfs" as const;

  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }

  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, {
      entityType: "public_land",
      sourceUrl: context.source.endpoint,
      idFields: ["facility_id", "forest_id", "site_id", "id", "OBJECTID"],
      nameFields: ["facility_name", "forest_name", "site_name", "name", "title"],
      taxonomy: ["public-lands", "usfs"],
    });
  }
}
