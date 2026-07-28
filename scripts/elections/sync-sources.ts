import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const COLLECTIONS = ["cycle", "races", "candidates", "polls", "forecasts", "results"];
const sources = new Map<string, Record<string, unknown>>();

for (const collection of COLLECTIONS) {
  const records = JSON.parse(await readFile(path.join(DATA_DIR, `${collection}.json`), "utf8"));
  for (const record of records) {
    collectSource(record.source, collection, record.id);
    for (const source of record.sources ?? []) {
      collectSource(
        {
          sourceId: null,
          sourceName: source.label,
          sourceType: "editorial_reference",
          sourceUrl: source.url,
          retrievedAt: source.retrievedAt,
          attributionText: null,
          sourceRecordId: record.id,
        },
        collection,
        record.id,
      );
    }
    for (const url of record.model?.fundamentals?.sourceUrls ?? []) {
      collectSource(
        {
          sourceId: null,
          sourceName: "Forecast fundamentals source",
          sourceType: "forecast_input",
          sourceUrl: url,
          retrievedAt: record.dataAsOf ?? record.updatedAt,
          sourceRecordId: record.id,
          attributionText: null,
        },
        collection,
        record.id,
      );
    }
  }
}

const output = [...sources.values()].sort((left, right) =>
  String(left.name).localeCompare(String(right.name), "en-US") ||
  String(left.url).localeCompare(String(right.url), "en-US"),
);
await writeFile(path.join(DATA_DIR, "sources.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${output.length} canonical election source record(s).`);

function collectSource(
  source: Record<string, unknown> | null | undefined,
  collection: string,
  recordId: string,
) {
  if (!source) return;
  const url = String(source.sourceUrl ?? source.url ?? "");
  if (!url.startsWith("https://")) return;
  const key = url.toLowerCase();
  const previous = sources.get(key);
  const usedBy = new Set<string>(
    Array.isArray(previous?.usedBy) ? (previous?.usedBy as string[]) : [],
  );
  usedBy.add(`${collection}:${recordId}`);
  sources.set(key, {
    id: String(source.sourceId ?? previous?.id ?? `source-${slugify(url)}`),
    name: String(source.sourceName ?? previous?.name ?? "Election source"),
    url,
    type: String(source.sourceType ?? previous?.type ?? "official"),
    sourceRecordId: source.sourceRecordId ?? previous?.sourceRecordId ?? null,
    attributionText: source.attributionText ?? previous?.attributionText ?? null,
    retrievedAt: newestDate(
      String(source.retrievedAt ?? ""),
      String(previous?.retrievedAt ?? ""),
    ),
    usedBy: [...usedBy].sort(),
  });
}

function newestDate(left: string, right: string) {
  if (!left) return right;
  if (!right) return left;
  return left >= right ? left : right;
}

function slugify(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname}-${url.pathname}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120);
  } catch {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120);
  }
}
