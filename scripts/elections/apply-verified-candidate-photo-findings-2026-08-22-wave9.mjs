#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const sourceUrl = "https://www.txgreens.org/2026_nominated_candidates";
const credit = "Green Party of Texas";
const permissionBasis = "Official Green Party of Texas 2026 nominated-candidate slate portrait used for editorial candidate identification with party attribution and a source link.";

const findings = [
  {
    candidateId: "candidate-kevin-mccormick-green-race-2026-lieutenant-governor",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784300285/kevin_M.jpg?1784300285=",
    altText: "Kevin McCormick, Green Party candidate for Lieutenant Governor of Texas"
  },
  {
    candidateId: "candidate-espoir-ngabo-green-race-2026-us-house-7",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768310337/d057fc31-03b2-4242-b289-b2528bece4a7.jpg?1768310337=",
    altText: "Espoir Ngabo, Green Party candidate for U.S. House District 7 in Texas"
  },
  {
    candidateId: "candidate-alex-mcmenemy-green-race-2026-us-house-38",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768313717/1a2e2914-7c7a-4edf-9b93-451ad78f23dc.jpg?1768313717=",
    altText: "Alex McMenemy, Green Party candidate for U.S. House District 38 in Texas"
  },
  {
    candidateId: "candidate-greg-stoker-green-race-2026-us-house-31",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768581805/Stoker_headshot.jpg?1768581805=",
    altText: "Greg Stoker, Green Party candidate for U.S. House District 31 in Texas"
  },
  {
    candidateId: "candidate-arshia-papari-green-race-2026-texas-house-49",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1769540626/square_2.jpg?1769540626=",
    altText: "Arshia Papari, Green Party candidate for Texas House District 49"
  },
  {
    candidateId: "candidate-julian-villarreal-green-race-2026-texas-senate-26",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1784300332/julian_v.jpg?1784300332=",
    altText: "Julian Villarreal, Green Party candidate for Texas Senate District 26"
  },
  {
    candidateId: "candidate-marlon-duran-green-race-2026-us-house-28",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1768311357/IMG_8310.jpg?1768311357=",
    altText: "Marlon Duran, Green Party candidate for U.S. House District 28 in Texas"
  },
  {
    candidateId: "candidate-eddie-espinoza-green-race-2026-us-house-34",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1767969290/EspinozaCampaignPhoto.jpg?1767969290=",
    altText: "Eddie Espinoza, Green Party candidate for U.S. House District 34 in Texas"
  },
  {
    candidateId: "candidate-anissa-chilmeran-green-race-2026-texas-house-61",
    imageUrl: "https://assets.nationbuilder.com/gptx/pages/5955/attachments/original/1769363904/WhatsApp_Image_2026-01-25_at_11.50.04_AM.jpg?1769363904=",
    altText: "Anissa Chilmeran, Green Party candidate for Texas House District 61"
  }
].map((finding) => ({
  ...finding,
  sourceUrl,
  credit,
  license: null,
  permissionBasis,
  usageStatus: "approved",
  discoveryMethod: "official-state-party-candidate-slate"
}));

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
console.log(`Applied ${applied} verified Green Party candidate portrait(s) from wave 9.`);
