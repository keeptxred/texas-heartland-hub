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
  },
  {
    candidateId: "candidate-steve-toth-republican-race-2026-us-house-2",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/SteveToth--CongressCampaignAnnouce--GraceWoodlands--SpringTX--sm2--15July2025.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:SteveToth--CongressCampaignAnnouce--GraceWoodlands--SpringTX--sm2--15July2025.jpg",
    altText: "Steve Toth announcing his campaign for Texas's 2nd Congressional District",
    credit: "LiwenAristodemos via Wikimedia Commons",
    license: "CC0 1.0 Universal",
    permissionBasis: "Wikimedia Commons identifies Steve Toth in this July 15, 2025 congressional-campaign photograph and records the photographer/copyright holder's CC0 1.0 public-domain dedication.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-cc0-candidate-photo"
  },
  {
    candidateId: "candidate-tano-e-tijerina-republican-race-2026-us-house-28",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tano_Tijerina.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tano_Tijerina.jpg",
    altText: "Portrait of Tano Tijerina",
    credit: "E. R. Softwood via Wikimedia Commons",
    license: "CC BY-SA 4.0",
    permissionBasis: "Wikimedia Commons identifies the subject as Tano Tijerina and licenses the portrait under Creative Commons Attribution-ShareAlike 4.0 International.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-cc-by-sa-candidate-photo"
  },
  {
    candidateId: "candidate-bobby-pulido-democratic-race-2026-us-house-15",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bobby_Pulido_%28CROPPED%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bobby_Pulido_(CROPPED).jpg",
    altText: "Portrait of Bobby Pulido",
    credit: "Kim-bodia via Wikimedia Commons",
    license: "CC BY 4.0",
    permissionBasis: "Wikimedia Commons identifies the subject as Bobby Pulido and licenses the cropped portrait under Creative Commons Attribution 4.0 International; the file is extracted from a Flickr image whose reusable Creative Commons license was independently reviewed on Commons.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-cc-by-candidate-photo"
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
console.log(`Applied ${applied} verified Wikimedia Commons candidate portrait(s).`);
