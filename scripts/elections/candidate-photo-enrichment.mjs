#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const REPORT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-report.json");
const APPLY = process.argv.includes("--apply");
const TARGET_COVERAGE = 0.85;

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
const errors = [];
const warnings = [];
const approved = [];
const approvedByImageUrl = new Map();

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
  if (entry.usageStatus === "approved" && isKnownGenericImage(entry.imageUrl)) {
    warnings.push({
      candidateId: entry.candidateId,
      imageUrl: entry.imageUrl,
      issue: "Approved manifest entry is a known generic or placeholder image. It is excluded from coverage and will be removed by the cleanup step.",
    });
    continue;
  }
  if (entry.usageStatus !== "approved") {
    warnings.push({ candidateId: entry.candidateId, issue: "Photo will not be displayed publicly." });
  } else {
    approved.push(entry.candidateId);
    const sameUrl = approvedByImageUrl.get(entry.imageUrl) ?? [];
    sameUrl.push(entry.candidateId);
    approvedByImageUrl.set(entry.imageUrl, sameUrl);
  }
}

for (const [imageUrl, candidateIds] of approvedByImageUrl) {
  if (candidateIds.length < 2) continue;
  warnings.push({
    candidateIds,
    imageUrl,
    issue: "Approved image URL is shared by multiple candidate records; verify that this is intentional and not a generic asset.",
  });
}

const manifestByCandidateId = new Map(manifest.map((entry) => [entry.candidateId, entry]));
const enriched = candidates.map((candidate) => {
  const entry = manifestByCandidateId.get(candidate.id);
  if (!entry || entry.usageStatus !== "approved" || isKnownGenericImage(entry.imageUrl)) return clearKnownGenericCandidateImage(candidate);
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

const coverageEligible = enriched.filter(isCoverageEligible);
const excludedFromCoverage = enriched
  .filter((candidate) => !isCoverageEligible(candidate))
  .map((candidate) => ({
    candidateId: candidate.id,
    name: candidate.fullName,
    raceId: candidate.primaryRaceId,
    status: candidate.status ?? null,
    filingStatus: candidate.filingStatus ?? null,
    ballotAccessStatus: candidate.ballotAccessStatus ?? null,
    reason: coverageExclusionReason(candidate),
  }));

const missing = coverageEligible
  .filter((candidate) => !candidate.imageUrl || candidate.imageRights?.usageStatus !== "approved" || isKnownGenericImage(candidate.imageUrl))
  .map((candidate) => ({
    candidateId: candidate.id,
    name: candidate.fullName,
    raceId: candidate.primaryRaceId,
    party: candidate.party,
    priority: candidate.featured ? "featured" : candidate.primaryRaceId?.includes("governor") ? "statewide" : "standard",
  }));

const approvedPhotoCount = coverageEligible.length - missing.length;
const targetApprovedPhotoCount = Math.ceil(coverageEligible.length * TARGET_COVERAGE);
const coverage = coverageEligible.length ? approvedPhotoCount / coverageEligible.length : 0;
const report = {
  generatedAt: new Date().toISOString(),
  candidateCount: candidates.length,
  eligibleCandidateCount: coverageEligible.length,
  excludedCandidateCount: excludedFromCoverage.length,
  approvedPhotoCount,
  missingPhotoCount: missing.length,
  manifestEntryCount: manifest.length,
  coverage,
  coveragePercent: Number((coverage * 100).toFixed(2)),
  targetCoverage: TARGET_COVERAGE,
  targetApprovedPhotoCount,
  photosNeededForTarget: Math.max(0, targetApprovedPhotoCount - approvedPhotoCount),
  targetMet: approvedPhotoCount >= targetApprovedPhotoCount,
  errors,
  warnings,
  excludedFromCoverage,
  missing,
};

await mkdir(path.dirname(REPORT_PATH), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error(`Candidate photo audit failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else if (APPLY) {
  await writeFile(CANDIDATES_PATH, `${JSON.stringify(enriched, null, 2)}\n`);
  console.log(`Applied ${approved.length} approved non-generic candidate photo(s).`);
  console.log(`Coverage: ${approvedPhotoCount}/${coverageEligible.length} eligible candidates (${report.coveragePercent}%). Target: ${targetApprovedPhotoCount}.`);
  if (excludedFromCoverage.length) console.log(`Excluded ${excludedFromCoverage.length} candidates from the coverage denominator using supported verified lifecycle fields.`);
} else {
  console.log(`Audit complete: ${approvedPhotoCount} approved, ${missing.length} missing among ${coverageEligible.length} eligible candidates.`);
  console.log(`Coverage: ${report.coveragePercent}%. Target: ${targetApprovedPhotoCount} (${TARGET_COVERAGE * 100}%).`);
  console.log("Run with --apply to write approved manifest entries into candidates.json.");
}

function isKnownGenericImage(value) {
  if (!value) return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return true;
  }
  const host = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  if (host === "senate.texas.gov" && pathname === "/_assets/img/og_image.jpg") return true;
  if (/(?:^|\/)(?:placeholder|default-avatar|default-profile|default-user|no-photo|no_image|no-image)(?:[._/-]|$)/i.test(pathname)) return true;
  if (/\/(?:logo|favicon|seal)(?:[._/-]|$)/i.test(pathname)) return true;
  return false;
}

function clearKnownGenericCandidateImage(candidate) {
  if (!isKnownGenericImage(candidate.imageUrl)) return candidate;
  const next = { ...candidate };
  delete next.imageUrl;
  delete next.imageAltText;
  delete next.imageRights;
  return next;
}

function isCoverageEligible(candidate) {
  if (["withdrawn", "disqualified"].includes(candidate.status)) return false;
  if (["rejected", "withdrawn"].includes(candidate.filingStatus)) return false;
  if (candidate.ballotAccessStatus === "removed") return false;
  return true;
}

function coverageExclusionReason(candidate) {
  if (["withdrawn", "disqualified"].includes(candidate.status)) return `status:${candidate.status}`;
  if (["rejected", "withdrawn"].includes(candidate.filingStatus)) return `filingStatus:${candidate.filingStatus}`;
  if (candidate.ballotAccessStatus === "removed") return "ballotAccessStatus:removed";
  return "unknown";
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
