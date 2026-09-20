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
    candidateId: "candidate-zack-dunn-democratic-race-2026-texas-house-121",
    imageUrl: "https://zackdunn.com/wp-content/uploads/2025/11/IMG_7665-731x1024.jpeg",
    sourceUrl: "https://zackdunn.com/",
    altText: "Zack Dunn, Democratic candidate for Texas House District 121",
    credit: "Dunn for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait hosted on Zack Dunn's official Texas House District 121 campaign website, which identifies Dunn as the candidate and is paid for by Dunn for Texas. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
  },
  {
    candidateId: "candidate-melva-perez-republican-race-2026-texas-house-119",
    imageUrl: "https://img1.wsimg.com/isteam/ip/a99ce1c8-419e-4cd6-8f47-d9b57a3944cf/blob-b368fb0.png",
    sourceUrl: "https://melvafortexas.com/",
    altText: "Melva Rivera Perez, Republican candidate for Texas House District 119",
    credit: "Melva Rivera Perez for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign portrait hosted on Melva Rivera Perez's official Texas House District 119 campaign website, which identifies her as the candidate. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 33.`);
