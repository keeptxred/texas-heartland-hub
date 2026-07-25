import { BaseImporter } from "./BaseImporter";
import { extractRecords, normalizeFeature, type JsonRecord } from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class TPWDImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "tpwd" as const;
  constructor(config: ImportSourceConfig) { super(config); }
  async parse(payload: unknown): Promise<JsonRecord[]> { return extractRecords(payload); }
  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, { entityType: "park", sourceUrl: context.source.endpoint, idFields: ["park_id", "site_id", "id", "OBJECTID"], nameFields: ["park_name", "site_name", "name", "title"], taxonomy: ["parks", "tpwd"] });
  }
}
