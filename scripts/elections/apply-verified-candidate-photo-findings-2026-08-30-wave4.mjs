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
    candidateId: "candidate-karen-reeder-democratic-race-2026-texas-house-29",
    imageUrl: "https://votereederxp.com/images/karen-photo.png",
    sourceUrl: "https://votereederxp.com/about.html",
    altText: "Karen Reeder, Democratic candidate for Texas House District 29",
    credit: "Karen Reeder for Texas House District 29 campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait is published directly on Karen Reeder's official campaign biography page, which labels the image path as images/karen-photo.png, identifies Karen Reeder as running for Texas House District 29 in the 2026 election, and states that the site is paid for by Karen Reeder for Texas House District 29. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T17:59:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 4.`);
