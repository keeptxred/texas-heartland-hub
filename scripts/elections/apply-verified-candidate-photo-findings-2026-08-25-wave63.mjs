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
    candidateId: "candidate-jorge-borrego-republican-race-2026-texas-house-118",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/jorge-borrego.jpeg",
    sourceUrl: "https://communityimpact.com/san-antonio/election/qa-meet-the-candidates-running-for-texas-house-district-118-in-the-republican-primary/",
    altText: "Jorge Borrego, Republican candidate for Texas House District 118",
    credit: "Jorge Borrego campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's February 2, 2026 Texas House District 118 candidate Q&A explicitly states that all candidate photos were submitted by the respective candidates and identifies this image as Jorge Borrego. Used only for editorial candidate identification with campaign/newsroom attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo"
  },
  {
    candidateId: "candidate-stan-stanart-republican-race-2026-texas-house-126",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/stan-stanart.png",
    sourceUrl: "https://communityimpact.com/spring-klein/election/qa-meet-the-republican-candidates-for-texas-house-of-representatives-district-126/",
    altText: "Stan Stanart, Republican candidate for Texas House District 126",
    credit: "Stan Stanart campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's January 26, 2026 Texas House District 126 candidate Q&A explicitly states that all candidate photos were submitted by the respective candidates and identifies this image as Stan Stanart. Used only for editorial candidate identification with campaign/newsroom attribution and an exact source link.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 63.`);
