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
    candidateId: "candidate-sandy-ibanez-democratic-race-2026-texas-house-28",
    imageUrl: "https://beta2.communityimpact.com/uploads/images/qa/170850_2506.jpg",
    sourceUrl: "https://communityimpact.com/sugar-land-missouri-city/election/qa-meet-the-2-democratic-primary-candidates-for-texas-house-district-28/",
    altText: "Sandy Ibanez, Democratic candidate for Texas House District 28",
    credit: "Sandy Ibanez campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's 2026 Texas House District 28 candidate Q&A explicitly states that all photos were submitted by the respective candidates. The candidate-specific image is attached directly to the Sandy Ibanez profile in that Q&A and is used only for editorial candidate identification with candidate/newsroom attribution and the exact source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T20:54:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 16.`);
