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
    candidateId: "candidate-eric-norman-democratic-race-2026-texas-house-44",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/65b92e0117af005a6907acd1/78132d41-5957-4105-8efe-38452fa79e8a/Eric_for_Texas_44_Jacket.jpg",
    sourceUrl: "https://www.ericfortx.com/",
    altText: "Eric Norman, Democratic candidate for Texas House District 44",
    credit: "Eric for Texas 44 campaign",
    license: null,
    permissionBasis: "Eric Norman's official campaign homepage identifies him as running for Texas House District 44 and directly publishes this candidate-specific headshot in the Meet Eric Norman biography section. BallotReady independently links ericfortx.com as Eric Norman's verified campaign website. Used only for editorial candidate identification with exact official-campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-09-02T15:40:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from September 2 wave 21.`);
