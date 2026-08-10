#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT = path.join(ROOT, "artifacts/elections/candidate-photo-wikimedia-report.json");
const UA = "KeepTXRedCandidatePhotoBot/5.0 (https://keeptxred.com; editorial candidate identification)";
const ALLOWED = /public domain|cc0|cc-by(?:-sa)?(?:-\d\.\d)?|creative commons attribution/i;

const candidates = JSON.parse(await readFile(CANDIDATES, "utf8"));
const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const queue = candidates.filter((candidate) => byId.get(candidate.id)?.usageStatus !== "approved");
const found = [];
const failures = [];

await pool(queue, 3, async (candidate) => {
  const result = await discover(candidate);
  if (result) {
    byId.set(candidate.id, result);
    found.push(result);
  } else {
    failures.push({ candidateId: candidate.id, name: candidate.fullName, raceId: candidate.primaryRaceId });
  }
});

const merged = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await mkdir(path.dirname(REPORT), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(merged, null, 2) + "\n");
await writeFile(REPORT, JSON.stringify({
  generatedAt: new Date().toISOString(),
  scanned: queue.length,
  discovered: found.length,
  approvedTotal: merged.filter((entry) => entry.usageStatus === "approved").length,
  found,
  failures,
}, null, 2) + "\n");
console.log(`Wikidata/Wikimedia discovery added ${found.length} verified portraits.`);

async function discover(candidate) {
  const names = nameVariants(candidate.fullName);
  for (const name of names) {
    const search = await getJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&uselang=en&type=item&limit=8&format=json&origin=*`);
    for (const item of search?.search || []) {
      if (!samePerson(item, candidate)) continue;
      const entityData = await getJson(`https://www.wikidata.org/wiki/Special:EntityData/${item.id}.json`);
      const entity = entityData?.entities?.[item.id];
      const filename = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
      if (!filename) continue;
      const context = JSON.stringify(entity).toLowerCase();
      if (!context.includes("texas") && !raceContext(candidate).some((token) => context.includes(token))) continue;
      const commons = await commonsInfo(filename);
      if (!commons?.url || !ALLOWED.test(`${commons.license} ${commons.usageTerms}`)) continue;
      return {
        candidateId: candidate.id,
        imageUrl: commons.url,
        sourceUrl: `https://www.wikidata.org/wiki/${item.id}`,
        altText: `Portrait of ${candidate.fullName}`,
        credit: commons.artist || "Wikimedia Commons contributor",
        license: commons.license,
        licenseUrl: commons.licenseUrl || null,
        permissionBasis: `Properly licensed Wikimedia Commons image (${commons.license}).`,
        usageStatus: "approved",
        discoveredAt: new Date().toISOString(),
        discoveryMethod: "wikidata-p18-commons-license-verification",
        discoverySource: "wikidata-wikimedia-commons",
        wikidataId: item.id,
        commonsFile: filename,
      };
    }
  }
  return null;
}

async function commonsInfo(filename) {
  const title = `File:${filename}`;
  const data = await getJson(`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(title)}&format=json&origin=*`);
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  const meta = info?.extmetadata || {};
  if (!info?.url) return null;
  return {
    url: info.url,
    license: clean(meta.LicenseShortName?.value || meta.UsageTerms?.value || ""),
    usageTerms: clean(meta.UsageTerms?.value || ""),
    licenseUrl: meta.LicenseUrl?.value || null,
    artist: clean(meta.Artist?.value || meta.Credit?.value || ""),
  };
}

function samePerson(item, candidate) {
  const label = normalize(item.label || "");
  const aliases = nameVariants(candidate.fullName).map(normalize);
  if (!aliases.some((name) => label === name || label.includes(name) || name.includes(label))) return false;
  const text = `${item.description || ""} ${item.match?.text || ""}`.toLowerCase();
  return !/fictional|footballer|musician|actor|baseball|cricketer|artist|singer/i.test(text);
}

function nameVariants(name) {
  const cleanName = String(name).replace(/\s+/g, " ").trim();
  const noSuffix = cleanName.replace(/\b(jr\.?|sr\.?|ii|iii|iv)\b/gi, "").replace(/\s+/g, " ").trim();
  const noMiddle = noSuffix.split(" ").filter(Boolean);
  const firstLast = noMiddle.length > 2 ? `${noMiddle[0]} ${noMiddle.at(-1)}` : noSuffix;
  return [...new Set([cleanName, noSuffix, firstLast, cleanName.replace(/\./g, "")].filter(Boolean))];
}

function raceContext(candidate) {
  return String(candidate.primaryRaceId || "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !["race", "2026", "texas"].includes(token));
}
function normalize(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function clean(value) { return String(value).replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim(); }
async function getJson(url) {
  try {
    const response = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) return null;
    return await response.json();
  } catch { return null; }
}
async function pool(items, size, fn) {
  let index = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (index < items.length) await fn(items[index++]);
  }));
}
