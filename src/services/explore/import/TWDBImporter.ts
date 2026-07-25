import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class TWDBImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "twdb" as const;

  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }

  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, {
      entityType: "water_resource",
      sourceUrl: context.source.endpoint,
      idFields: ["reservoir_id", "lake_id", "station_id", "id", "OBJECTID"],
      nameFields: ["reservoir_name", "lake_name", "station_name", "name", "title"],
      taxonomy: ["water", "twdb"],
    });
  }
}
