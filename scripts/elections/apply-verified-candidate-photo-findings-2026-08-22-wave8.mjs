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
    candidateId: "candidate-vicente-gonzalez-democratic-race-2026-us-house-34",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Vicente_Gonzalez%2C_official_portrait%2C_118th_Congress_%28cropped%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vicente_Gonzalez,_official_portrait,_118th_Congress_(cropped).jpg",
    altText: "Official congressional portrait of U.S. Representative Vicente Gonzalez of Texas",
    credit: "U.S. House of Representatives via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons identifies the image as an official U.S. House portrait by the U.S. House of Representatives and marks it public domain as a U.S. federal government work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
  },
  {
    candidateId: "candidate-colin-allred-democratic-race-2026-us-house-33",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Colin_Allred%2C_official_portrait%2C_117th_Congress_%283x4%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colin_Allred,_official_portrait,_117th_Congress_(3x4).jpg",
    altText: "Official congressional portrait of former U.S. Representative Colin Allred of Texas",
    credit: "Ike Hayman, House Creative Services via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons identifies the source as Representative Allred's official House biography, credits House Creative Services photographer Ike Hayman, and marks the image public domain as a U.S. Congress work.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-public-domain-us-congress"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 8.`);
