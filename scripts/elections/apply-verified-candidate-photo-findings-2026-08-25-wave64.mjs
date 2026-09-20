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
    candidateId: "candidate-brett-robinson-democratic-race-2026-texas-house-130",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/brett-robinson.jpeg",
    sourceUrl: "https://communityimpact.com/houston/tomball-magnolia/election/2026/01/22/meet-the-democratic-primary-candidates-for-texas-house-district-130/",
    altText: "Brett Robinson, Democratic candidate for Texas House District 130",
    credit: "Brett Robinson campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's January 23, 2026 Texas House District 130 candidate Q&A explicitly states that all candidate photos were submitted by the respective candidates and identifies this image as Brett Robinson. Used only for editorial candidate identification with campaign/newsroom attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 64.`);
