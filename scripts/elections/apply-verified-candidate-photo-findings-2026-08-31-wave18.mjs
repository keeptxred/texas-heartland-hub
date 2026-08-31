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
    candidateId: "candidate-kelly-hall-democratic-race-2026-texas-house-19",
    imageUrl: "https://assets.communityimpact.com/uploads/elections/candidates/kelly-hall-6694.jpeg",
    sourceUrl: "https://communityimpact.com/round-rock/election/qa-meet-the-candidates-for-round-rock-mayor/",
    altText: "Kelly Hall, Democratic nominee for Texas House District 19",
    credit: "Kelly Hall campaign, via Community Impact",
    license: null,
    permissionBasis: "Community Impact's March 20, 2026 Round Rock mayor candidate Q&A explicitly states that all photos were submitted by the respective candidates. The candidate-specific Kelly Hall portrait is attached directly to his profile, and the profile itself states that he won the HD19 primary. Used only for editorial candidate identification with candidate/newsroom attribution and exact source link; this image approval does not resolve or change the separate House eligibility/lifecycle question.",
    usageStatus: "approved",
    discoveryMethod: "candidate-supplied-newsroom-photo-cross-office-identity-verified",
    discoveredAt: "2026-08-31T07:38:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 31 wave 18.`);
