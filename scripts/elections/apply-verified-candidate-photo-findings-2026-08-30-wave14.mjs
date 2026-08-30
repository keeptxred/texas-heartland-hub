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
    candidateId: "candidate-stephanie-guerrero-saenz-democratic-race-2026-texas-house-34",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/69ef82a23ef5e90e064855a0/d368380a-b174-4f69-b079-a110095d294a/DSC_5978%2B%282%29.jpg",
    sourceUrl: "https://www.stephanie4texas.com/",
    altText: "Stephanie Guerrero Sáenz, Democratic candidate for Texas House District 34",
    credit: "Stephanie Guerrero Sáenz for HD 34 campaign",
    license: null,
    permissionBasis: "Stephanie Guerrero Sáenz's official campaign homepage identifies her as the candidate for Texas House District 34 and publishes this candidate-specific photograph immediately before the Meet Stephanie biography section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T20:42:00.000Z"
  },
  {
    candidateId: "candidate-orlando-lopez-democratic-race-2026-texas-house-33",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6918fe6e12ef476e38603f3e/ac20fb34-e9b1-4b54-bd7f-3eebdfe1d6a6/733756980_122137121661134540_1525171046319516611_n.jpg",
    sourceUrl: "https://www.lopezfortxhd33.com/about",
    altText: "Orlando Lopez, Democratic candidate for Texas House District 33",
    credit: "Lopez for Texas House District 33 campaign",
    license: null,
    permissionBasis: "Orlando Lopez's official campaign biography identifies him as the candidate for Texas House District 33 and publishes this candidate-specific photograph directly beneath the 'Meet Our Candidate: Orlando Lopez' heading. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T20:45:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 14.`);
