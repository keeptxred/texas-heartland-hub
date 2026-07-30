import type { ImportEntityDraft } from "@/types/explore/import";

export type JsonRecord = Record<string, unknown>;

export function extractRecords(payload: unknown): JsonRecord[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) throw new Error("Import payload must be an object or array");
  for (const key of ["features", "results", "data", "items", "records"]) {
    const value = payload[key];
    if (Array.isArray(value)) return value.filter(isRecord);
  }
  return [payload];
}

export function normalizeFeature(record: JsonRecord, options: {
  entityType: string;
  sourceUrl?: string;
  idFields: string[];
  nameFields: string[];
  descriptionFields?: string[];
  taxonomy?: string[];
}): ImportEntityDraft {
  const properties = isRecord(record.properties) ? record.properties : record;
  const geometry = isRecord(record.geometry) ? record.geometry : undefined;
  const coordinates = Array.isArray(geometry?.coordinates) ? geometry.coordinates : undefined;
  const externalId = firstString(properties, options.idFields) ?? firstString(record, options.idFields);
  const name = firstString(properties, options.nameFields) ?? firstString(record, options.nameFields);
  if (!externalId) throw new Error(`Missing external identifier (${options.idFields.join(", ")})`);
  if (!name) throw new Error(`Missing name (${options.nameFields.join(", ")})`);
  const description = firstString(properties, options.descriptionFields ?? ["description", "summary", "notes"]);
  const longitude = typeof coordinates?.[0] === "number" ? coordinates[0] : numberValue(properties.longitude ?? properties.lon ?? properties.x);
  const latitude = typeof coordinates?.[1] === "number" ? coordinates[1] : numberValue(properties.latitude ?? properties.lat ?? properties.y);

  return {
    externalId,
    entityType: options.entityType,
    name,
    description: description ?? null,
    latitude,
    longitude,
    taxonomy: options.taxonomy ?? [],
    relationships: [],
    media: extractMedia(properties),
    sourceUpdatedAt: dateValue(properties.updated_at ?? properties.updated ?? properties.last_modified),
    sourceUrl: firstString(properties, ["url", "website", "link"]) ?? options.sourceUrl ?? null,
    metadata: properties,
    raw: record,
  };
}

function extractMedia(record: JsonRecord): ImportEntityDraft["media"] {
  const values = [record.image, record.image_url, record.photo, record.photo_url, record.thumbnail];
  return values.filter((value): value is string => typeof value === "string" && /^https?:\/\//.test(value))
    .map((url) => ({ url, type: "image" as const }));
}

function firstString(record: JsonRecord, fields: string[]): string | undefined {
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function dateValue(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
