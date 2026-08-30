#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const USER_AGENT = "KeepTXRedCandidatePhotoBot/1.0 (+https://keeptxred.com)";

const findings = [
  ["candidate-bryan-hughes-republican-race-2026-texas-senate-1", "BRYAN HUGHES", 1, "https://senate.texas.gov/members/d01/img/Hughes_86-0702D-030-web.jpg"],
  ["candidate-bob-hall-republican-race-2026-texas-senate-2", "BOB HALL", 2, "https://senate.texas.gov/members/d02/img/headshot.jpg"],
  ["candidate-brett-w-ligon-republican-race-2026-texas-senate-4", "BRETT W. LIGON", 4, "https://senate.texas.gov/members/d04/img/Ligon_Brett_Headshot_web.jpg"],
  ["candidate-charles-schwertner-republican-race-2026-texas-senate-5", "CHARLES SCHWERTNER", 5, "https://senate.texas.gov/members/d05/img/headshot.jpg"],
  ["candidate-borris-l-miles-democratic-race-2026-texas-senate-13", "BORRIS L. MILES", 13, "https://senate.texas.gov/members/d13/img/Sen-Miles-2025-Headshot-web.jpg"],
  ["candidate-lois-w-kolkhorst-republican-race-2026-texas-senate-18", "LOIS W. KOLKHORST", 18, "https://senate.texas.gov/members/d18/img/LWK-headshot-2026-web.jpg"],
  ["candidate-roland-gutierrez-democratic-race-2026-texas-senate-19", "ROLAND GUTIERREZ", 19, "https://senate.texas.gov/members/d19/img/Gutierrez_87-0522D-016-Web.jpg"],
  ["candidate-judith-zaffirini-democratic-race-2026-texas-senate-21", "JUDITH ZAFFIRINI", 21, "https://senate.texas.gov/members/d21/img/Zaffirini_2017.jpg"],
  ["candidate-jose-menendez-democratic-race-2026-texas-senate-26", "JOSE MENENDEZ", 26, "https://senate.texas.gov/members/d26/img/headshot.jpg"],
  ["candidate-charles-perry-republican-race-2026-texas-senate-28", "CHARLES PERRY", 28, "https://senate.texas.gov/members/d28/img/Perry-Headshot-2019.jpg"],
  ["candidate-kevin-sparks-republican-race-2026-texas-senate-31", "KEVIN SPARKS", 31, "https://senate.texas.gov/members/d31/img/Sparks_88-0063D-012-web.jpg"],
].map(([candidateId, name, district, imageUrl]) => ({
  candidateId,
  imageUrl,
  sourceUrl: `https://senate.texas.gov/member.php?d=${district}`,
  altText: `Official Texas Senate portrait of ${name}`,
  credit: "Texas State Senate",
  license: null,
  permissionBasis: "Official Texas government portrait used for informational candidate identification with source attribution.",
  usageStatus: "approved",
  discoveredAt: "2026-08-30T15:00:00.000Z",
  discoveryMethod: "verified-official-texas-senate-member-portrait",
}));

const [manifest, candidates] = await Promise.all([
  readJson(MANIFEST_PATH),
  readJson(CANDIDATES_PATH),
]);
const candidateIds = new Set(candidates.map((candidate) => candidate.id));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
let applied = 0;
let preserved = 0;
let skippedUnavailable = 0;

for (const finding of findings) {
  if (!candidateIds.has(finding.candidateId)) {
    throw new Error(`Verified Senate portrait references unknown candidate ${finding.candidateId}`);
  }
  const existing = byId.get(finding.candidateId);
  if (existing?.usageStatus === "approved" && !isKnownSenateGeneric(existing.imageUrl)) {
    preserved += 1;
    continue;
  }
  if (!(await validateImage(finding.imageUrl))) {
    console.warn(`Skipping unavailable Senate portrait for ${finding.candidateId}: ${finding.imageUrl}`);
    skippedUnavailable += 1;
    continue;
  }
  byId.set(finding.candidateId, finding);
  applied += 1;
}

const output = [...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
await writeFile(MANIFEST_PATH, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Applied ${applied} verified Texas Senate member portrait replacement(s); preserved ${preserved} existing non-generic approved portrait(s); skipped ${skippedUnavailable} unavailable image(s).`);

function isKnownSenateGeneric(value) {
  try {
    const parsed = new URL(value);
    return parsed.hostname.toLowerCase() === "senate.texas.gov" && parsed.pathname.toLowerCase() === "/_assets/img/og_image.jpg";
  } catch {
    return true;
  }
}

async function validateImage(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: {
        "user-agent": USER_AGENT,
        accept: "image/*,*/*;q=0.8",
        range: "bytes=0-65535",
      },
    });
    if (!response.ok && response.status !== 206) return false;
    const type = response.headers.get("content-type") ?? "";
    const length = Number(response.headers.get("content-length") ?? 0);
    return type.startsWith("image/") && (!length || length >= 8000);
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
