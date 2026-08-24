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
    candidateId: "candidate-junior-ezeonu-democratic-race-2026-texas-house-101",
    imageUrl: "https://static.wixstatic.com/media/0a8871_446d938a96944e68bd55bd39942dee39~mv2.jpg/v1/fill/w_2500%2Ch_2040%2Cal_c/0a8871_446d938a96944e68bd55bd39942dee39~mv2.jpg",
    sourceUrl: "https://www.votejuniorezeonu.com/",
    altText: "Junior Ezeonu, Democratic candidate for Texas House District 101",
    credit: "Junior Ezeonu for Texas House District 101 campaign",
    license: null,
    permissionBasis: "Candidate portrait published by the official campaign website and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-roxanne-lathan-democratic-race-2026-texas-house-11",
    imageUrl: "https://images.squarespace-cdn.com/content/68e58c8b8b6d880c64714bab/ce4d23b8-f3e3-4f31-b724-c3ce8324a502/IMG_0515.jpeg?content-type=image%2Fjpeg",
    sourceUrl: "https://www.roxanne4texans.com/",
    altText: "Roxanne Lathan, Democratic candidate for Texas House District 11",
    credit: "Roxanne Lathan for Texas House District 11 campaign",
    license: null,
    permissionBasis: "Candidate image published by the official campaign website and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-andie-ho-democratic-race-2026-texas-house-12",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6972769d4f6b7575c547e702/d9e2bf72-f81e-4afd-9538-c04390b08d67/T_DSC9554-Edit%2Bcopy.png",
    sourceUrl: "https://www.andiefortexas.com/",
    altText: "Andie Ho, Democratic candidate for Texas House District 12",
    credit: "Andie for Texas campaign",
    license: null,
    permissionBasis: "Candidate portrait published by the official campaign website and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
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
console.log(`Applied ${applied} verified candidate portraits from new official campaign sources.`);
