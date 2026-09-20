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
    candidateId: "candidate-ashley-bean-thornton-democratic-race-2026-texas-house-56",
    imageUrl: "https://ashleybeanthornton.com/wp-content/uploads/2026/05/number-1-2-934x1024.jpg",
    sourceUrl: "https://ashleybeanthornton.com/abt-bio-page/",
    altText: "Ashley Bean Thornton, Democratic candidate for Texas House District 56",
    credit: "Thornton for Texas Campaign",
    license: null,
    permissionBasis: "Ashley Bean Thornton's official campaign biography page identifies her campaign for Texas House District 56 and publishes this candidate-specific image directly below the 'Who is Ashley Bean Thornton?' biography heading. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:38:00.000Z"
  },
  {
    candidateId: "candidate-diana-loya-democratic-race-2026-texas-house-87",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/69431f12e39f331cd774bf65/93a5f94d-9052-40ae-a4bb-c2617584a4fd/1000040062.jpg",
    sourceUrl: "https://www.dianaloyahd87.com/",
    altText: "Diana Loya, Democratic candidate for Texas House District 87",
    credit: "Diana Loya for Texas House District 87 campaign",
    license: null,
    permissionBasis: "Diana Loya's official campaign homepage identifies her as running for State Representative for House District 87 and publishes this candidate-specific image in the Meet Diana section immediately following her biography. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:38:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 11.`);
