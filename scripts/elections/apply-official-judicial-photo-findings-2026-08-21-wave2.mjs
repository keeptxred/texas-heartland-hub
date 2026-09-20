#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-maggie-ellis-democratic-race-2026-texas-supreme-court-place-1",
    imageUrl: "https://www.txcourts.gov/media/1460168/ellis1.jpg",
    sourceUrl: "https://www.txcourts.gov/3rdcoa/about-the-court/justices/justice-maggie-ellis/",
    altText: "Official portrait of Third Court of Appeals Justice Maggie Ellis",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official Texas Judicial Branch portrait published on the justice's court biography page and used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-texas-judicial-biography"
  },
  {
    candidateId: "candidate-chari-kelly-democratic-race-2026-texas-supreme-court-place-2",
    imageUrl: "https://txcourts.gov/media/1445093/kelly-1.jpg",
    sourceUrl: "https://txcourts.gov/3rdcoa/about-the-court/justices/justice-chari-l-kelly/",
    altText: "Official portrait of Third Court of Appeals Justice Chari L. Kelly",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official Texas Judicial Branch portrait published on the justice's court biography page and used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-texas-judicial-biography"
  },
  {
    candidateId: "candidate-gisela-d-triana-democratic-race-2026-texas-supreme-court-place-8",
    imageUrl: "https://www.txcourts.gov/media/1460157/gt.jpg",
    sourceUrl: "https://www.txcourts.gov/3rdcoa/about-the-court/justices/justice-gisela-d-triana/",
    altText: "Official portrait of Third Court of Appeals Justice Gisela D. Triana",
    credit: "Texas Judicial Branch",
    license: null,
    permissionBasis: "Official Texas Judicial Branch portrait published on the justice's court biography page and used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-texas-judicial-biography"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified Texas appellate portraits.`);
