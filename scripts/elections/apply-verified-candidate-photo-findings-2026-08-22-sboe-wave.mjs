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
    candidateId: "candidate-thomas-ray-garcia-democratic-race-2026-state-board-of-education-2",
    imageUrl: "https://static.wixstatic.com/media/1386db_b6a9fa87de7349b398b0e94b2d3ef727f002.jpg",
    sourceUrl: "https://www.thomasraygarciatx.com/",
    altText: "Thomas Ray Garcia, Democratic candidate for Texas State Board of Education District 2",
    credit: "Thomas Ray Garcia for State Board of Education",
    license: null,
    permissionBasis: "Candidate image published on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile",
    discoveredAt: "2026-08-22T12:43:00.000Z"
  },
  {
    candidateId: "candidate-victoria-hinojosa-republican-race-2026-state-board-of-education-2",
    imageUrl: "https://static.wixstatic.com/media/11fb5c_71464a3c36084f0693e8899946b4626a~mv2.jpg",
    sourceUrl: "https://www.victoriafortexas.org/",
    altText: "Victoria Hinojosa, Republican candidate for Texas State Board of Education District 2",
    credit: "Victoria For Texas Campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile",
    discoveredAt: "2026-08-22T12:43:00.000Z"
  },
  {
    candidateId: "candidate-tiffany-perkinz-democratic-race-2026-state-board-of-education-7",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6a4da69cc9a99f555ff32a04/e4aee7ec-1aec-4c96-b36a-d94f57f349c8/92e0cce2-3ece-4aae-95bb-9765a6114b11.JPG",
    sourceUrl: "https://www.tiffanyperkinz.com/",
    altText: "Tiffany Perkinz, Democratic candidate for Texas State Board of Education District 7",
    credit: "Tiffany Perkinz for SBOE 7",
    license: null,
    permissionBasis: "Candidate image published on the official campaign website and used for editorial candidate identification with attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile",
    discoveredAt: "2026-08-22T12:43:00.000Z"
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
console.log(`Applied ${applied} verified SBOE candidate portraits.`);
