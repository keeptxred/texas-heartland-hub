import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class HistoricalCommissionImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "thc" as const;
  constructor(config: ImportSourceConfig) {
    super(config);
  }
  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }
  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, {
      entityType: "historic_site",
      sourceUrl: context.source.endpoint,
      idFields: ["atlas_number", "resource_id", "id", "OBJECTID"],
      nameFields: ["resource_name", "site_name", "name", "title"],
      descriptionFields: ["historical_text", "description", "summary"],
      taxonomy: ["history", "texas-historical-commission"],
    });
  }
}
