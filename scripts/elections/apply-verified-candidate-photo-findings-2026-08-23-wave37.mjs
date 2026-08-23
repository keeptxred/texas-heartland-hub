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
    candidateId: "candidate-sean-huffman-democratic-race-2026-texas-house-1",
    imageUrl: "https://huffmanforhd1.com/wp-content/uploads/2025/04/imageedit_3_6821879798.jpg",
    sourceUrl: "https://huffmanforhd1.com/",
    altText: "Sean Huffman, Democratic candidate for Texas House District 1",
    credit: "Huffman for HD1 campaign",
    license: null,
    permissionBasis: "Candidate-identifying image directly hosted on the official Huffman for HD1 campaign website and used for editorial candidate identification with campaign attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-junior-ezeonu-democratic-race-2026-texas-house-101",
    imageUrl: "https://static.wixstatic.com/media/0a8871_b84abb8e458e4538b14306836c003da0~mv2.jpeg/v1/fill/w_980%2Ch_968%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/2026%20headshot.jpeg",
    sourceUrl: "https://www.votejuniorezeonu.com/",
    altText: "Junior Ezeonu, Democratic candidate for Texas House District 101",
    credit: "Junior Ezeonu campaign",
    license: null,
    permissionBasis: "2026 candidate headshot directly hosted and labeled on the official Junior Ezeonu campaign homepage, used for editorial candidate identification with campaign attribution and a source link.",
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
console.log(`Applied ${applied} verified candidate portraits from wave 37.`);
