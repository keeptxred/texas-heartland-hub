#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-report.json");
const APPLY = process.argv.includes("--apply");

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
const errors = [];
const warnings = [];
const approved = [];

for (const entry of manifest) {
  const candidate = candidateById.get(entry.candidateId);
  if (!candidate) {
    errors.push({ candidateId: entry.candidateId, issue: "Candidate ID does not exist." });
    continue;
  }
  if (!/^https:\/\//.test(entry.imageUrl ?? "")) {
    errors.push({ candidateId: entry.candidateId, issue: "imageUrl must use HTTPS." });
  }
  if (!/^https:\/\//.test(entry.sourceUrl ?? "")) {
    errors.push({ candidateId: entry.candidateId, issue: "sourceUrl must use HTTPS." });
  }
  if (!entry.altText?.trim()) {
    errors.push({ candidateId: entry.candidateId, issue: "altText is required." });
  }
  if (!entry.usageStatus || !["approved", "restricted", "unknown"].includes(entry.usageStatus)) {
    errors.push({ candidateId: entry.candidateId, issue: "usageStatus is invalid." });
  }
  if (entry.usageStatus === "approved" && !entry.license?.trim() && !entry.permissionBasis?.trim()) {
    errors.push({
      candidateId: entry.candidateId,
      issue: "Approved photos require a license or documented permission basis.",
    });
  }
  if (entry.usageStatus !== "approved") {
    warnings.push({ candidateId: entry.candidateId, issue: "Photo will not be displayed publicly." });
  } else {
    approved.push(entry.candidateId);
  }
}

const manifestByCandidateId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const enriched = candidates.map((candidate) => {
  const entry = manifestByCandidateId.get(candidate.id);
  if (!entry || entry.usageStatus !== "approved") return candidate;
  return {
    ...candidate,
    imageUrl: entry.imageUrl,
    imageAltText: entry.altText,
    imageRights: {
      usageStatus: entry.usageStatus,
      sourceUrl: entry.sourceUrl,
      credit: entry.credit ?? null,
      license: entry.license ?? entry.permissionBasis ?? null,
    },
    updatedAt: new Date().toISOString(),
  };
});

const missing = enriched
  .filter((candidate) => !candidate.imageUrl || candidate.imageRights?.usageStatus !== "approved")
  .map((candidate) => ({
    candidateId: candidate.id,
    name: candidate.fullName,
    raceId: candidate.primaryRaceId,
    party: candidate.party,
    priority: candidate.featured ? "featured" : candidate.primaryRaceId?.includes("governor") ? "statewide" : "standard",
  }));

const report = {
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  approvedPhotoCount: enriched.length - missing.length,
  missingPhotoCount: missing.length,
  manifestEntryCount: manifest.length,
  errors,
  warnings,
  missing,
};

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Candidate photo audit failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else if (APPLY) {
  await writeFile(CANDIDATES_PATH, `${JSON.stringify(enriched, null, 2)}\n`);
  console.log(`Applied ${approved.length} approved candidate photo(s).`);
} else {
  console.log(`Audit complete: ${approved.length} approved, ${missing.length} missing.`);
  console.log("Run with --apply to write approved manifest entries into candidates.json.");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
