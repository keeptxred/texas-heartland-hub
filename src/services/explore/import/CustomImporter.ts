import { BaseImporter } from "./BaseImporter";
import {
  extractRecords,
  normalizeFeature,
  type JsonRecord,
} from "@/lib/explore/import/json-feature";
import type { ImportContext, ImportEntityDraft, ImportSourceConfig } from "@/types/explore/import";

export class CustomImporter extends BaseImporter<JsonRecord> {
  readonly sourceType = "custom" as const;

  constructor(config: ImportSourceConfig) {
    super(config);
  }

  async parse(payload: unknown): Promise<JsonRecord[]> {
    return extractRecords(payload);
  }

  async normalize(record: JsonRecord, context: ImportContext): Promise<ImportEntityDraft> {
    const metadata = context.source.metadata ?? {};
    const entityType = requireString(metadata.entityType, "metadata.entityType");
    const idFields = requireStringArray(metadata.idFields, "metadata.idFields");
    const nameFields = requireStringArray(metadata.nameFields, "metadata.nameFields");

    return normalizeFeature(record, {
      entityType,
      sourceUrl: context.source.endpoint,
      idFields,
      nameFields,
      descriptionFields: optionalStringArray(metadata.descriptionFields, [
        "description",
        "summary",
        "notes",
      ]),
      taxonomy: uniqueStrings(["custom-source", ...optionalStringArray(metadata.taxonomy, [])]),
    });
  }
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Custom importer requires ${field}`);
  }
  return value.trim();
}

function requireStringArray(value: unknown, field: string): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim())
  ) {
    throw new Error(`Custom importer requires a non-empty string array at ${field}`);
  }
  return uniqueStrings(value);
}

function optionalStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? uniqueStrings(value)
    : fallback;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
