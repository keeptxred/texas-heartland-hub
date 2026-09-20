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
    candidateId: "candidate-angie-carraway-democratic-race-2026-texas-house-89",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6967d9112db7e61e6fcfe424/88a739ca-2dc5-4416-8bb7-7b55e26b3c23/hero-angie-web.jpg?format=1000w",
    sourceUrl: "https://www.citizensforcarraway.com/",
    altText: "Angie Carraway, Democratic candidate for Texas House District 89",
    credit: "Citizens for Carraway campaign",
    license: null,
    permissionBasis: "Angie Carraway's official campaign homepage identifies her as running for Texas House District 89 and publishes this candidate-specific portrait with alt text 'Angie Carraway, Democratic candidate for Texas House District 89'. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:42:00.000Z"
  },
  {
    candidateId: "candidate-michelle-winder-democratic-race-2026-texas-house-99",
    imageUrl: "https://michellforhd99.com/wp-content/uploads/2026/03/image-e1773457012451.webp",
    sourceUrl: "https://michellforhd99.com/about-us/",
    altText: "Michelle Winder, Democratic candidate for Texas House District 99",
    credit: "Michelle Winder campaign",
    license: null,
    permissionBasis: "Michelle Winder's official campaign biography identifies her as a candidate for Texas House District 99 and publishes this candidate-specific image directly in the Meet Michelle biography section. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:42:00.000Z"
  },
  {
    candidateId: "candidate-elizabeth-eliz-markowitz-democratic-race-2026-texas-house-26",
    imageUrl: "https://static.wixstatic.com/media/d850b9_6fb7ade0b64846e3b9a21faf582c1c33~mv2.png/v1/crop/x_0,y_0,w_946,h_412/fill/w_932,h_412,al_c,q_90,enc_avif,quality_auto/IMG_5992%203_edited.png",
    sourceUrl: "https://www.eliz4tx.com/",
    altText: "Elizabeth Eliz Markowitz, Democratic candidate for Texas House District 26",
    credit: "Eliz Markowitz for Texas HD 26 campaign",
    license: null,
    permissionBasis: "Eliz Markowitz's official campaign homepage identifies her campaign for Texas House District 26 and publishes the candidate-specific image named 'IMG_5992 3_edited.png' prominently on the campaign page. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage",
    discoveredAt: "2026-08-30T18:42:00.000Z"
  },
  {
    candidateId: "candidate-jennifer-jj-dominguez-democratic-race-2026-texas-house-31",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/691a70dc279b972b0aa1a263/2a5e0888-0944-4487-9e78-541cac7583f9/JJ_Photo--1.jpg",
    sourceUrl: "https://www.jjdominguez4tx.com/",
    altText: "Jennifer JJ Dominguez, Democratic candidate for Texas House District 31",
    credit: "JJ Dominguez4TX campaign",
    license: null,
    permissionBasis: "Jennifer 'JJ' Dominguez's official campaign homepage identifies her District 31 candidacy and publishes the candidate-specific image 'JJ_Photo--1.jpg' immediately before the ABOUT JJ biography section, with descriptive alt text showing her at a podium. Used only for editorial candidate identification with exact official-campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography",
    discoveredAt: "2026-08-30T18:42:00.000Z"
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
console.log(`Applied ${applied} verified candidate portraits from August 30 wave 12.`);
