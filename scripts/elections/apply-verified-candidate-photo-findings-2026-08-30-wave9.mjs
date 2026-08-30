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
    candidateId: "candidate-ray-stith-democratic-race-2026-texas-house-57",
    imageUrl: "https://static.wixstatic.com/media/7e85cb_032d0955b1754f0d9895fbcb391c22f5~mv2.png/v1/fill/w_490,h_562,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7e85cb_032d0955b1754f0d9895fbcb391c22f5~mv2.png",
    sourceUrl: "https://www.raystithfortx57.com/",
    altText: "Ray Stith, Democratic candidate for Texas House District 57",
    credit: "Ray Stith Campaign",
    license: null,
    permissionBasis: "Ray Stith's official campaign homepage identifies him as running to represent District 57 in the Texas House and publishes a candidate-specific image labeled 'IMG_20251125_143808_edited_edited.png' immediately above the campaign identification. TCTA independently links the same campaign domain to Ray Stith's District 57 candidacy. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:33:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 9.`);
