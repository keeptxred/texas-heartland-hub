import { BaseImporter } from "./BaseImporter";
import { extractRecords, normalizeFeature, type JsonRecord } from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class NOAAImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "noaa" as const;
  constructor(config: ImportSourceConfig) { super(config); }
  async parse(payload: unknown): Promise<JsonRecord[]> { return extractRecords(payload); }
  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    return normalizeFeature(record, { entityType: "weather_station", sourceUrl: context.source.endpoint, idFields: ["id", "station", "station_id"], nameFields: ["name", "stationName", "title"], taxonomy: ["noaa", "weather"] });
  }
}
