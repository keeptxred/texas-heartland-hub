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
    candidateId: "candidate-julie-evans-democratic-race-2026-texas-house-64",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/julie-evans.jpeg",
    sourceUrl: "https://communityimpact.com/denton/election/qa-meet-the-democratic-primary-candidates-for-texas-house-district-64/",
    altText: "Julie Evans, Democratic candidate for Texas House District 64",
    credit: "Julie Evans campaign / Community Impact",
    license: null,
    permissionBasis: "Community Impact's February 13, 2026 Texas House District 64 candidate Q&A identifies Julie Evans as a Democratic HD64 candidate and states that the candidate photos are courtesy of the candidates/Community Impact. The page exposes the candidate-specific Julie Evans image asset. Used only for editorial candidate identification with exact article attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo",
    discoveredAt: "2026-08-30T18:12:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 5.`);
