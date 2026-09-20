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
    candidateId: "candidate-albert-wittliff-democratic-race-2026-texas-house-129",
    imageUrl: "https://static.wixstatic.com/media/3dda84_450c93d8d0b544448a35ab6a9431b598~mv2.jpg/v1/fill/w_640%2Ch_480%2Cal_c%2Cq_80%2Cenc_auto/3dda84_450c93d8d0b544448a35ab6a9431b598~mv2.jpg",
    sourceUrl: "https://www.votewittliff.com/home1",
    altText: "Albert Wittliff, Democratic candidate for Texas House District 129",
    credit: "Albert Wittliff for Texas House District 129 campaign",
    license: null,
    permissionBasis: "Candidate-identifying photograph is published directly on Albert Wittliff's official campaign home page in the Meet Albert biography section. The page identifies Albert Wittliff as running for Texas House District 129, and TCTA independently links the same official campaign domain to the 2026 HD129 candidate. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T17:43:00.000Z"
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
console.log(`Applied ${applied} verified candidate portrait from August 30 wave 3.`);
