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
    candidateId: "candidate-detrick-deburr-democratic-race-2026-texas-house-65",
    imageUrl: "https://northdallasgazette.com/wp-content/uploads/2021/10/campaignheadshot-1015x1024.jpg",
    sourceUrl: "https://northdallasgazette.com/2021/10/09/detrick-deburr-announces-run-for-city-council-in-the-colony/",
    altText: "Detrick DeBurr, Democratic candidate for Texas House District 65",
    credit: "Detrick DeBurr courtesy photo via North Dallas Gazette",
    license: null,
    permissionBasis: "North Dallas Gazette publishes this candidate-identifying portrait with the explicit caption 'Detrick DeBurr (Courtesy photo)'. Current 2026 election sources identify DeBurr as the Democratic candidate for Texas House District 65. Used only for narrow editorial candidate identification with exact newsroom attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "candidate-courtesy-newsroom-photo",
    discoveredAt: "2026-09-06T02:45:00.000Z"
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
console.log(`Applied ${applied} verified Detrick DeBurr candidate portrait.`);
