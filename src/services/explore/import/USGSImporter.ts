import { BaseImporter } from "./BaseImporter";
import { extractRecords, normalizeFeature, type JsonRecord } from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class USGSImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "usgs" as const;
  constructor(config: ImportSourceConfig) { super(config); }
  async parse(payload: unknown): Promise<JsonRecord[]> { return extractRecords(payload); }
  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, { entityType: "natural_feature", sourceUrl: context.source.endpoint, idFields: ["id", "site_no", "OBJECTID"], nameFields: ["name", "site_name", "title", "place"], taxonomy: ["usgs", "natural-features"] });
  }
}
