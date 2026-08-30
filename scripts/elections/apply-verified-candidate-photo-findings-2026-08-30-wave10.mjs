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
    candidateId: "candidate-diana-luna-democratic-race-2026-texas-house-71",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6942dc176f71f32f0f754bfc/5b1a55e6-41e0-457a-898a-584986f4c44c/edited%2Bheadshot%2B%2B-%2BDiana%2BLuna.jpg",
    sourceUrl: "https://www.dianalunafortexas.com/",
    altText: "Diana Luna, Democratic candidate for Texas House District 71",
    credit: "Diana Luna for House District 71 campaign",
    license: null,
    permissionBasis: "Diana Luna's official campaign homepage identifies her as running for Texas House District 71 and publishes the candidate-specific image named 'edited headshot - Diana Luna.jpg' in the Meet Diana section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:35:00.000Z"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, finding);
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 10.`);
