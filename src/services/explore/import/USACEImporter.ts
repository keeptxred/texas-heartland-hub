import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class USACEImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "usace" as const;

  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }

  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, {
      entityType: "recreation_area",
      sourceUrl: context.source.endpoint,
      idFields: ["facility_id", "recarea_id", "project_id", "id", "OBJECTID"],
      nameFields: ["facility_name", "recarea_name", "project_name", "name", "title"],
      taxonomy: ["recreation", "usace"],
    });
  }
}
