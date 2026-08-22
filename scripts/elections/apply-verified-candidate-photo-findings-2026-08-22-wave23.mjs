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
    candidateId: "candidate-ben-mostyn-republican-race-2026-texas-house-117",
    imageUrl: "https://mostynfortexas.com/wp-content/uploads/2023/03/Benjamin-Mostyn-1N1A0972-a-Edited-1.png",
    sourceUrl: "https://mostynfortexas.com/",
    altText: "Ben Mostyn, Republican candidate for Texas House District 117",
    credit: "Mostyn for Texas",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on Ben Mostyn's official Texas House District 117 campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-kristian-carranza-democratic-race-2026-texas-house-118",
    imageUrl: "https://kristianfortexas.com/wp-content/uploads/kristian-carranza-06.jpg",
    sourceUrl: "https://kristianfortexas.com/",
    altText: "Kristian Carranza, Democratic candidate for Texas House District 118",
    credit: "Kristian Carranza for Texas",
    license: null,
    permissionBasis: "Candidate-identifying photograph directly hosted on Kristian Carranza's official Texas House District 118 campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified official-campaign portrait(s) from wave 23.`);
