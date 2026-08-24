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
    imageUrl: "https://huffmanforhd1.com/wp-content/uploads/2025/04/we-help-you-1920-x-800-px.png",
    sourceUrl: "https://huffmanforhd1.com/",
    altText: "Sean Huffman, Democratic candidate for Texas House District 1",
    credit: "Sean Huffman campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign hero image directly hosted on the official Sean Huffman for Texas House District 1 website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-chris-spencer-republican-race-2026-texas-house-1",
    imageUrl: "https://lirp.cdn-website.com/e481f125/dms3rep/multi/opt/chris-cutout-66f61142-1920w.png",
    sourceUrl: "https://www.chrisspencer.com/",
    altText: "Chris Spencer, Republican candidate for Texas House District 1",
    credit: "Chris Spencer campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on the official Chris Spencer for Texas House campaign website and used for editorial candidate identification with attribution and source link.",
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
console.log(`Applied ${applied} verified candidate portraits from wave 29.`);
