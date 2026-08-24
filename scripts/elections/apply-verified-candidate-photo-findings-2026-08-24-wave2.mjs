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
    candidateId: "candidate-will-campbell-republican-race-2026-texas-house-109",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6940b325cdecf430273ee3c7/1ef0cc31-e667-4a54-96f9-ad1ab9010b3b/Aragon-Headshot-Wilson-Campbell-98.jpg",
    sourceUrl: "https://www.willcampbellfortexas.com/about-will-campbell",
    altText: "Will Campbell, Republican candidate for Texas House District 109",
    credit: "Will Campbell for Texas campaign",
    license: null,
    permissionBasis: "Candidate headshot published on the official campaign biography page and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography-headshot"
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
console.log(`Applied ${applied} verified candidate portrait from 2026-08-24 wave 2.`);
