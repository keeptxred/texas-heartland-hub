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
    candidateId: "candidate-tom-butler-republican-race-2026-texas-house-128",
    imageUrl: "https://i.vimeocdn.com/video/2115227431-9acb31140aedb503e07ec2761c083b3d89166b1ad2c82c824e1edc2a3278b800-d?f=webp",
    sourceUrl: "https://tombutler.org/",
    altText: "Tom Butler, Republican candidate for Texas House District 128",
    credit: "Tom Butler Campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign image published through Tom Butler's official Texas House District 128 campaign homepage, which identifies Butler as the candidate and includes the campaign's paid-political-advertising disclaimer. Used for editorial candidate identification with campaign attribution and exact source provenance.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage-video-frame"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 61.`);
