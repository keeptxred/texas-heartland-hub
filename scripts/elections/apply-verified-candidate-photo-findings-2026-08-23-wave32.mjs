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
    candidateId: "candidate-allison-mitchell-democratic-race-2026-texas-house-108",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67ffddb45703ac4b27b46355/0d77af0d-55ac-4816-b096-543943f8c58a/AllisonMitchel-110.jpg",
    sourceUrl: "https://www.allisonmitchellfortexas.com/about-allison",
    altText: "Allison Mitchell, Democratic candidate for Texas House District 108",
    credit: "Allison Mitchell for Texas House",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on Allison Mitchell's official Texas House District 108 campaign biography page and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography"
  },
  {
    candidateId: "candidate-zach-herbert-democratic-race-2026-texas-house-112",
    imageUrl: "https://i0.wp.com/zach4texas.com/wp-content/uploads/2025/09/image001-1.jpg?fit=800%2C532&ssl=1",
    sourceUrl: "https://zach4texas.com/about-2/",
    altText: "Zach Herbert, Democratic candidate for Texas House District 112",
    credit: "Zach Herbert for Texas Campaign",
    license: null,
    permissionBasis: "Candidate-identifying photograph directly hosted at the start of Zach Herbert's official Texas House District 112 campaign biography page and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified official-campaign portrait(s) from wave 32.`);
