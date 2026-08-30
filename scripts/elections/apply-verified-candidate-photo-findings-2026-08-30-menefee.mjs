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
    candidateId: "candidate-christian-dashaun-menefee-democratic-race-2026-us-house-18",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Christian_Menefee%2C_official_portrait_%28119th_Congress%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Christian_Menefee,_official_portrait_(119th_Congress).jpg",
    altText: "Official congressional portrait of U.S. Representative Christian D. Menefee of Texas",
    credit: "U.S. House of Representatives via Wikimedia Commons",
    license: "Public domain — U.S. Congress",
    permissionBasis: "Wikimedia Commons identifies this as Christian Menefee's official 119th Congress portrait, sourced from the Biographical Directory of the United States Congress and authored by the U.S. House of Representatives, and marks the image as public domain.",
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
console.log(`Applied ${applied} verified public-domain Christian Menefee portrait(s).`);
