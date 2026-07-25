import { BaseImporter } from "./BaseImporter";
import { extractRecords, normalizeFeature, type JsonRecord } from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class NPSImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "nps" as const;
  constructor(config: ImportSourceConfig) { super(config); }
  async parse(payload: unknown): Promise<JsonRecord[]> { return extractRecords(payload); }
  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    const draft = normalizeFeature(record, { entityType: "national_park", sourceUrl: context.source.endpoint, idFields: ["parkCode", "id", "url"], nameFields: ["fullName", "name", "title"], descriptionFields: ["description", "designation"], taxonomy: ["parks", "national-park-service"] });
    const latitude = typeof record.latitude === "string" ? Number(record.latitude) : null;
    const longitude = typeof record.longitude === "string" ? Number(record.longitude) : null;
    return { ...draft, latitude: Number.isFinite(latitude) ? latitude : draft.latitude, longitude: Number.isFinite(longitude) ? longitude : draft.longitude };
  }
}
