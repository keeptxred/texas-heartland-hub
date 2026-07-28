import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const COLLECTIONS = ["cycle", "races", "candidates", "polls", "forecasts", "results"];
const ALLOWED_TYPES = new Set([
  "official",
  "government",
  "campaign",
  "pollster",
  "forecast_provider",
  "news_organization",
  "academic",
  "manual",
  "other",
]);

const existing = JSON.parse(await readFile(path.join(DATA_DIR, "sources.json"), "utf8"));
const records = Object.fromEntries(
  await Promise.all(
    COLLECTIONS.map(async (name) => [
      name,
      JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
    ]),
  ),
);
const sources = new Map();
const sourceIdByUrl = new Map();
const primarySourceIds = new Set();

for (const existingSource of existing) {
  const sourceUrl = existingSource.sourceUrl ?? existingSource.url;
  if (!existingSource.id || !String(sourceUrl ?? "").startsWith("https://")) continue;
  if (sourceIdByUrl.has(sourceUrl)) continue;
  const sourceType = ALLOWED_TYPES.has(existingSource.sourceType)
    ? existingSource.sourceType
    : ALLOWED_TYPES.has(existingSource.type)
      ? existingSource.type
      : inferType(sourceUrl);
  const normalized = {
    ...existingSource,
    sourceType,
    sourceUrl,
    type: sourceType,
    url: sourceUrl,
  };
  sources.set(normalized.id, normalized);
  sourceIdByUrl.set(sourceUrl, normalized.id);
}

for (const [collection, values] of Object.entries(records)) {
  for (const record of values) {
    if (record.source?.sourceUrl) {
      addSource({
        id: record.source.sourceId,
        name: record.source.sourceName,
        sourceType: record.source.sourceType,
        sourceUrl: record.source.sourceUrl,
        retrievedAt: record.source.retrievedAt,
        lastVerifiedAt: record.verifiedAt ?? record.source.retrievedAt,
        notes:
          record.source.attributionText ??
          `${collection} source for ${record.id ?? record.slug ?? "an election record"}.`,
        primary: true,
      });
    }

    for (const source of record.sources ?? []) {
      if (!source?.url) continue;
      addSource({
        name: source.label,
        sourceType: inferType(source.url),
        sourceUrl: source.url,
        retrievedAt: source.retrievedAt ?? record.updatedAt,
        lastVerifiedAt: record.verifiedAt ?? source.retrievedAt ?? record.updatedAt,
        notes: `Candidate profile source for ${record.id}.`,
      });
    }

    if (record.fundraising?.sourceUrl) {
      addSource({
        name: record.fundraising.sourceUrl.includes("fec.gov")
          ? "Federal Election Commission"
          : "Campaign finance filing source",
        sourceType: "government",
        sourceUrl: record.fundraising.sourceUrl,
        retrievedAt: record.fundraising.updatedAt ?? record.updatedAt,
        lastVerifiedAt: record.fundraising.updatedAt ?? record.verifiedAt ?? record.updatedAt,
        notes: `Campaign finance summary source for ${record.id}.`,
      });
    }

    if (record.geographySource?.sourceUrl) {
      addSource({
        name: record.geographySource.sourceName ?? "Election geography source",
        sourceType: "government",
        sourceUrl: record.geographySource.sourceUrl,
        retrievedAt: record.geographySource.retrievedAt ?? record.updatedAt,
        lastVerifiedAt: record.geographySource.retrievedAt ?? record.verifiedAt ?? record.updatedAt,
        notes: `District and county geography source for ${record.id}.`,
      });
    }

    if (record.countyElectionLinkSource?.sourceUrl) {
      addSource({
        name: record.countyElectionLinkSource.sourceName ?? "Official county election links",
        sourceType: "official",
        sourceUrl: record.countyElectionLinkSource.sourceUrl,
        retrievedAt: record.countyElectionLinkSource.retrievedAt ?? record.updatedAt,
        lastVerifiedAt:
          record.countyElectionLinkSource.retrievedAt ?? record.verifiedAt ?? record.updatedAt,
        notes: `Official county election-link directory used by ${record.id}.`,
      });
    }

    for (const url of record.model?.fundamentals?.sourceUrls ?? []) {
      addSource({
        name: `Forecast input source: ${hostname(url)}`,
        sourceType: inferType(url),
        sourceUrl: url,
        retrievedAt: record.model.fundamentals.dataAsOf ?? record.updatedAt,
        lastVerifiedAt: record.verifiedAt ?? record.updatedAt,
        notes: `Forecast fundamentals source for ${record.id}.`,
      });
    }
  }
}

const output = [...sources.values()].sort((left, right) => String(left.id).localeCompare(String(right.id)));
await writeFile(path.join(DATA_DIR, "sources.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Rebuilt canonical election source catalog with ${output.length} source(s).`);

function addSource(input) {
  const sourceUrl = String(input.sourceUrl ?? "");
  if (!sourceUrl.startsWith("https://")) return;
  const requestedId = input.id || sourceId(input.name, sourceUrl);
  const id = sourceIdByUrl.get(sourceUrl) ?? requestedId;
  const previous = sources.get(id);
  const incomingType = ALLOWED_TYPES.has(input.sourceType) ? input.sourceType : inferType(sourceUrl);
  const preferIncoming = Boolean(input.primary) || !primarySourceIds.has(id);
  const sourceType = preferIncoming ? incomingType : previous?.sourceType ?? incomingType;
  const source = {
    ...(previous ?? {}),
    id,
    name: preferIncoming
      ? input.name || previous?.name || hostname(sourceUrl)
      : previous?.name || input.name || hostname(sourceUrl),
    sourceType,
    sourceUrl,
    type: sourceType,
    url: sourceUrl,
    retrievedAt: preferIncoming
      ? input.retrievedAt || previous?.retrievedAt || new Date().toISOString()
      : previous?.retrievedAt || input.retrievedAt || new Date().toISOString(),
    lastVerifiedAt: preferIncoming
      ? input.lastVerifiedAt || previous?.lastVerifiedAt || input.retrievedAt || new Date().toISOString()
      : previous?.lastVerifiedAt || input.lastVerifiedAt || input.retrievedAt || new Date().toISOString(),
    notes: preferIncoming
      ? input.notes || previous?.notes || null
      : previous?.notes || input.notes || null,
  };
  const conflicting = sources.get(id);
  if (conflicting && conflicting.sourceUrl !== sourceUrl) {
    const disambiguated = `${requestedId}-${shortHash(sourceUrl)}`;
    sources.set(disambiguated, { ...source, id: disambiguated });
    sourceIdByUrl.set(sourceUrl, disambiguated);
    if (input.primary) primarySourceIds.add(disambiguated);
  } else {
    sources.set(id, source);
    sourceIdByUrl.set(sourceUrl, id);
    if (input.primary) primarySourceIds.add(id);
  }
}

function sourceId(name, url) {
  const base = slugify(name || hostname(url)) || "election-source";
  return `source-${base}-${shortHash(url)}`;
}

function shortHash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 8);
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

function inferType(url) {
  const host = hostname(url);
  if (/sos\.texas\.gov|sos\.state\.tx\.us|texas-election\.com|txelections\./.test(host)) {
    return "official";
  }
  if (/\.gov$|\.gov\./.test(host)) return "government";
  if (/utexas\.edu|\.edu$/.test(host)) return "academic";
  if (/fec\.gov|ethics\.state\.tx\.us/.test(host)) return "government";
  return "other";
}
