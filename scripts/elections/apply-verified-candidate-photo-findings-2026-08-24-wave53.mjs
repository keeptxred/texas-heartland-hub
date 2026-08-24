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
    candidateId: "candidate-nicole-king-democratic-race-2026-texas-house-3",
    imageUrl: "https://static.wixstatic.com/media/2809c0_311d8a98d50944b9b3c33e563e71783a~mv2.jpg/v1/fill/w_131,h_109,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/KING_edited.jpg",
    sourceUrl: "https://www.nicolekingforall.com/",
    altText: "Nicole King, Democratic candidate for Texas House District 3",
    credit: "Nicole King campaign",
    license: null,
    permissionBasis: "Candidate-identifying image hosted directly on Nicole King's official campaign homepage, which identifies her as the Democratic candidate for Texas House District 3 and carries the campaign's political-advertising disclaimer. Used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
  },
  {
    candidateId: "candidate-shelley-tatum-democratic-race-2026-texas-house-9",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6937324e7fa5c641cad0186b/44ce9ffc-2b46-4272-ad9f-f6672a660f1d/IMG_20260119_170507.jpg",
    sourceUrl: "https://www.tatum4texas9.com/",
    altText: "Shelley Tatum, Democratic candidate for Texas House District 9",
    credit: "Tatum for Texas 9 campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign photograph hosted directly on the official Tatum for Texas 9 website immediately with the candidate biography. Used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 53.`);
