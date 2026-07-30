import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const CANDIDATE_FILE = path.join(DATA_DIR, "candidates.json");
const RACE_FILE = path.join(DATA_DIR, "races.json");
const DEFAULT_IMPORT_FILE = path.join(ROOT, "scripts/elections/import/candidates.json");
const CYCLE_ID = "election-cycle-2026-texas-general";
const RUNOFF_URL = "https://electionresults.sos.state.tx.us/results.html";
const INDEPENDENT_URL =
  "https://www.sos.texas.gov/elections/laws/independent-declarations-2026.shtml";
const OFFICIAL_CANDIDATE_URL =
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const timestamp = new Date(process.env.ELECTION_IMPORT_AS_OF ?? Date.now()).toISOString();

const [existingCandidates, races] = await Promise.all([
  readJson(CANDIDATE_FILE),
  readJson(RACE_FILE),
]);
const raceById = new Map(races.map((race) => [race.id, race]));
const rows = [];

rows.push(...(await loadNormalizedRows(process.env.ELECTION_CANDIDATE_IMPORT ?? DEFAULT_IMPORT_FILE)));
rows.push(...(await fetchRunoffWinners()));
rows.push(...(await fetchIndependentCandidates()));
if (process.env.ELECTION_CANDIDATE_LIST_URL) {
  rows.push(...(await loadNormalizedRows(process.env.ELECTION_CANDIDATE_LIST_URL)));
}

const normalizedRows = deduplicateRows(
  rows
    .map(normalizeRow)
    .filter((row) => row && raceById.has(row.raceId) && row.sourceUrl?.startsWith("https://")),
);
const existingByKey = new Map(
  existingCandidates.map((candidate) => [candidateKey(candidate.fullName, candidate.party, candidate.primaryRaceId), candidate]),
);
const imported = normalizedRows.map((row) => buildCandidate(row, existingByKey.get(candidateKey(row.fullName, row.party, row.raceId))));
const importedKeys = new Set(imported.map((candidate) => candidateKey(candidate.fullName, candidate.party, candidate.primaryRaceId)));
const preserved = existingCandidates.filter((candidate) => !importedKeys.has(candidateKey(candidate.fullName, candidate.party, candidate.primaryRaceId)));
const output = [...preserved, ...imported].sort((left, right) =>
  `${left.primaryRaceId}|${left.party}|${left.ballotName}`.localeCompare(
    `${right.primaryRaceId}|${right.party}|${right.ballotName}`,
    "en-US",
  ),
);

const candidateIdsByRace = new Map();
for (const candidate of output) {
  for (const raceId of candidate.raceIds) {
    const list = candidateIdsByRace.get(raceId) ?? [];
    list.push(candidate.id);
    candidateIdsByRace.set(raceId, list);
  }
}
const updatedRaces = races.map((race) => {
  const candidateIds = [...new Set(candidateIdsByRace.get(race.id) ?? [])].sort();
  const hasOfficialCandidates = candidateIdsByRace.has(race.id);
  return {
    ...race,
    candidateIds,
    uncontested: hasOfficialCandidates ? candidateIds.length === 1 : race.uncontested,
    updatedAt: hasOfficialCandidates ? timestamp : race.updatedAt,
  };
});

await Promise.all([
  writeFile(CANDIDATE_FILE, `${JSON.stringify(output, null, 2)}\n`),
  writeFile(RACE_FILE, `${JSON.stringify(updatedRaces, null, 2)}\n`),
]);
console.log(
  `Imported or refreshed ${imported.length} source-backed candidate(s); ${output.length} total candidate record(s).`,
);
console.log(
  `Official candidate listing remains the preferred full source: ${OFFICIAL_CANDIDATE_URL}`,
);

async function loadNormalizedRows(location) {
  if (!location) return [];
  let text;
  if (/^https:\/\//.test(location)) {
    const response = await fetch(location, {
      headers: { "user-agent": "KeepTXRed Election Central candidate importer" },
    });
    if (!response.ok) throw new Error(`Candidate import failed for ${location}: ${response.status}`);
    text = await response.text();
  } else {
    text = await readFile(path.resolve(location), "utf8");
  }
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : parsed.candidates ?? parsed.records ?? [];
  }
  if (/<(?:html|table|tr|div)[\s>]/i.test(trimmed)) return parseCandidateTableHtml(trimmed, location);
  return parseCsv(trimmed);
}

async function fetchRunoffWinners() {
  try {
    const response = await fetch(RUNOFF_URL, {
      headers: { "user-agent": "KeepTXRed Election Central candidate importer" },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const html = await response.text();
    return parseOfficialRunoffHtml(html);
  } catch (error) {
    console.warn(`Runoff winner import skipped: ${error.message}`);
    return [];
  }
}

async function fetchIndependentCandidates() {
  try {
    const response = await fetch(INDEPENDENT_URL, {
      headers: { "user-agent": "KeepTXRed Election Central candidate importer" },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const text = htmlToText(await response.text());
    const rows = [];
    const lines = text.split("\n").map(clean).filter(Boolean);
    for (let index = 0; index < lines.length - 4; index += 1) {
      const statusIndex = lines.slice(index, index + 8).findIndex((line) =>
        /Candidate in the General Election/i.test(line),
      );
      if (statusIndex < 0) continue;
      const candidateName = lines[index];
      const officeName = lines[index + 1];
      const raceId = raceIdFromOffice(officeName);
      if (!raceId || !looksLikePerson(candidateName)) continue;
      rows.push({
        fullName: candidateName,
        ballotName: candidateName,
        party: "independent",
        raceId,
        occupation: lines[index + 3] ?? null,
        status: "nominee",
        filingStatus: "accepted",
        ballotAccessStatus: "qualified",
        sourceName: "Texas Secretary of State Independent Candidate Filings",
        sourceUrl: INDEPENDENT_URL,
        sourceType: "official",
        sourceRecordId: slugify(`${candidateName}-${officeName}`),
        sourceRetrievedAt: timestamp,
      });
      index += statusIndex;
    }
    return deduplicateRows(rows);
  } catch (error) {
    console.warn(`Independent candidate import skipped: ${error.message}`);
    return [];
  }
}

function parseOfficialRunoffHtml(html) {
  const text = htmlToText(html);
  const lines = text.split("\n").map(clean).filter(Boolean);
  const rows = [];
  let party = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/2026 DEMOCRATIC PRIMARY RUNOFF ELECTION/i.test(line)) {
      party = "democratic";
      continue;
    }
    if (/2026 REPUBLICAN PRIMARY RUNOFF ELECTION/i.test(line)) {
      party = "republican";
      continue;
    }
    if (!party) continue;
    const raceId = raceIdFromOffice(line);
    if (!raceId) continue;
    const candidateMarker = lines.slice(index + 1, index + 8).findIndex((item) => /^Candidate$/i.test(item));
    if (candidateMarker < 0) continue;
    const start = index + 1 + candidateMarker + 2;
    const firstName = lines[start];
    const firstVotes = lines[start + 1];
    if (!looksLikePerson(firstName) || !/^\d[\d,]*$/.test(firstVotes ?? "")) continue;
    rows.push({
      fullName: stripIncumbent(firstName),
      ballotName: stripIncumbent(firstName),
      party,
      raceId,
      incumbencyType: /\(I\)/i.test(firstName) ? "incumbent" : "unknown",
      status: "nominee",
      filingStatus: "accepted",
      ballotAccessStatus: "qualified",
      sourceName: "Texas Secretary of State 2026 Primary Runoff Results",
      sourceUrl: RUNOFF_URL,
      sourceType: "official_election_results",
      sourceRecordId: slugify(`${party}-${line}-${firstName}`),
      sourceRetrievedAt: timestamp,
    });
  }
  return deduplicateRows(rows);
}

function parseCandidateTableHtml(html, sourceUrl) {
  const rows = [];
  const trMatches = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  for (const tr of trMatches) {
    const cells = [...tr.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) =>
      clean(htmlToText(match[1])),
    );
    if (cells.length < 3 || /candidate name/i.test(cells.join(" "))) continue;
    const officeIndex = cells.findIndex((cell) => raceIdFromOffice(cell));
    if (officeIndex < 0) continue;
    const name = cells.find((cell, index) => index !== officeIndex && looksLikePerson(cell));
    const partyCell = cells.find((cell) => /Republican|Democratic|Libertarian|Green|Independent/i.test(cell));
    if (!name || !partyCell) continue;
    rows.push({
      fullName: name,
      ballotName: name,
      party: partyFromText(partyCell),
      raceId: raceIdFromOffice(cells[officeIndex]),
      status: "nominee",
      filingStatus: "accepted",
      ballotAccessStatus: "qualified",
      sourceName: "Texas Secretary of State Candidate Listing",
      sourceUrl: /^https:\/\//.test(sourceUrl) ? sourceUrl : OFFICIAL_CANDIDATE_URL,
      sourceType: "official_candidate_listing",
      sourceRecordId: slugify(`${name}-${cells[officeIndex]}-${partyCell}`),
      sourceRetrievedAt: timestamp,
    });
  }
  return rows;
}

function normalizeRow(input) {
  if (!input || typeof input !== "object") return null;
  const fullName = clean(input.fullName ?? input.candidateName ?? input.name ?? input.ballotName);
  const party = partyFromText(input.party ?? input.partyName ?? input.partyCode);
  const raceId = clean(input.raceId) || raceIdFromOffice(input.officeName ?? input.office ?? input.raceName);
  const sourceUrl = input.sourceUrl ?? input.source?.url ?? input.originalSourceUrl;
  if (!fullName || !party || !raceId || !sourceUrl) return null;
  return {
    ...input,
    fullName,
    ballotName: clean(input.ballotName ?? fullName),
    party,
    raceId,
    sourceUrl,
    sourceName: input.sourceName ?? input.source?.name ?? "Official candidate source",
    sourceType: input.sourceType ?? input.source?.type ?? "official",
    sourceRecordId: input.sourceRecordId ?? input.source?.recordId ?? slugify(`${fullName}-${party}-${raceId}`),
    sourceRetrievedAt: input.sourceRetrievedAt ?? input.source?.retrievedAt ?? timestamp,
  };
}

function buildCandidate(row, previous) {
  const name = splitName(row.fullName);
  const slug = previous?.slug ?? slugify(`${row.fullName}-${row.party}-${row.raceId}`);
  const id = previous?.id ?? `candidate-${slug}`;
  const source = {
    sourceId: row.sourceId ?? `source-${slugify(row.sourceName)}`,
    sourceName: row.sourceName,
    sourceType: row.sourceType,
    sourceUrl: row.sourceUrl,
    sourceRecordId: row.sourceRecordId,
    retrievedAt: row.sourceRetrievedAt,
    attributionText: row.attributionText ?? null,
  };
  return {
    id,
    electionCycleId: CYCLE_ID,
    slug,
    fullName: row.fullName,
    firstName: row.firstName ?? name.firstName,
    middleName: row.middleName ?? name.middleName,
    lastName: row.lastName ?? name.lastName,
    suffix: row.suffix ?? name.suffix,
    preferredName: row.preferredName ?? previous?.preferredName ?? null,
    ballotName: row.ballotName,
    pronunciation: row.pronunciation ?? previous?.pronunciation ?? null,
    party: row.party,
    partyLabel: row.partyLabel ?? partyLabel(row.party),
    status: row.status ?? "nominee",
    filingStatus: row.filingStatus ?? "accepted",
    incumbencyType: row.incumbencyType ?? previous?.incumbencyType ?? "unknown",
    campaignStatus: row.campaignStatus ?? previous?.campaignStatus ?? "active",
    ballotAccessStatus: row.ballotAccessStatus ?? "qualified",
    raceIds: [row.raceId],
    primaryRaceId: row.raceId,
    currentOfficeId: row.currentOfficeId ?? previous?.currentOfficeId ?? null,
    currentOfficeName: row.currentOfficeName ?? previous?.currentOfficeName ?? null,
    biography: row.biography ?? previous?.biography ?? null,
    occupation: row.occupation ?? previous?.occupation ?? null,
    employer: row.employer ?? previous?.employer ?? null,
    hometown: row.hometown ?? previous?.hometown ?? null,
    residenceCity: row.residenceCity ?? previous?.residenceCity ?? null,
    residenceCountyId: row.residenceCountyId ?? previous?.residenceCountyId ?? null,
    stateCode: "TX",
    dateOfBirth: row.dateOfBirth ?? previous?.dateOfBirth ?? null,
    imageUrl: row.imageUrl ?? previous?.imageUrl ?? null,
    imageAltText: row.imageAltText ?? previous?.imageAltText ?? null,
    imageRights: row.imageRights ?? previous?.imageRights ?? null,
    websiteUrl: row.websiteUrl ?? previous?.websiteUrl ?? null,
    campaignUrl: row.campaignUrl ?? previous?.campaignUrl ?? null,
    donationUrl: row.donationUrl ?? previous?.donationUrl ?? null,
    contactEmail: row.contactEmail ?? previous?.contactEmail ?? null,
    contactPhone: row.contactPhone ?? previous?.contactPhone ?? null,
    socialLinks: row.socialLinks ?? previous?.socialLinks ?? {
      facebookUrl: null,
      xUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
      linkedinUrl: null,
    },
    externalIds: row.externalIds ?? previous?.externalIds ?? {
      fecCandidateId: row.fecCandidateId ?? null,
      texasEthicsId: row.texasEthicsId ?? null,
      ballotpediaId: null,
      wikidataId: null,
    },
    filingDate: row.filingDate ?? previous?.filingDate ?? null,
    withdrawalDate: null,
    campaignAnnouncedAt: row.campaignAnnouncedAt ?? previous?.campaignAnnouncedAt ?? null,
    campaignEndedAt: null,
    featured: row.featured ?? previous?.featured ?? false,
    endorsed: row.endorsed ?? previous?.endorsed ?? false,
    notes: row.notes ?? previous?.notes ?? null,
    createdAt: previous?.createdAt ?? timestamp,
    updatedAt: timestamp,
    verificationStatus: "verified",
    verifiedAt: timestamp,
    verifiedBy: "Election candidate import pipeline",
    verificationNotes: "Candidate identity and ballot status supported by the cited authoritative record.",
    publicationStatus: "published",
    publishedAt: previous?.publishedAt ?? timestamp,
    unpublishedAt: null,
    scheduledFor: null,
    publishedBy: previous?.publishedBy ?? "Election candidate import pipeline",
    dataAsOf: timestamp,
    lastCheckedAt: timestamp,
    staleAfter: addDays(new Date(timestamp), 14).toISOString(),
    expiresAt: "2026-11-04T12:00:00.000Z",
    freshnessStatus: "fresh",
    source,
    campaignFinanceUrl: row.campaignFinanceUrl ?? previous?.campaignFinanceUrl ?? null,
    sources: deduplicateSources([
      ...(previous?.sources ?? []),
      { label: source.sourceName, url: source.sourceUrl, retrievedAt: source.retrievedAt },
    ]),
    profileDepth: previous?.profileDepth ?? "basic",
  };
}

function raceIdFromOffice(value) {
  const office = clean(value).toUpperCase().replace(/\./g, "");
  if (!office) return null;
  if (/^U S SENATOR$|^UNITED STATES SENATOR$/.test(office)) return "race-2026-us-senate";
  if (/^GOVERNOR$/.test(office)) return "race-2026-governor";
  if (/LIEUTENANT GOVERNOR/.test(office)) return "race-2026-lieutenant-governor";
  if (/ATTORNEY GENERAL/.test(office)) return "race-2026-attorney-general";
  if (/COMPTROLLER/.test(office)) return "race-2026-comptroller";
  if (/GENERAL LAND|LAND COMMISSIONER/.test(office)) return "race-2026-land-commissioner";
  if (/AGRICULTURE/.test(office)) return "race-2026-agriculture-commissioner";
  if (/RAILROAD COMMISSIONER/.test(office)) return "race-2026-railroad-commissioner";
  let match = office.match(/U S REPRESENTATIVE(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-us-house-${Number(match[1])}`;
  match = office.match(/STATE SENATOR(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-texas-senate-${Number(match[1])}`;
  match = office.match(/STATE REPRESENTATIVE(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-texas-house-${Number(match[1])}`;
  match = office.match(/STATE BOARD OF EDUCATION(?:,)? DISTRICT (\d+)/);
  if (match) return `race-2026-state-board-of-education-${Number(match[1])}`;
  if (/^CHIEF JUSTICE,? SUPREME COURT$/.test(office)) {
    return "race-2026-texas-supreme-court-place-1";
  }
  match = office.match(/SUPREME COURT.*PLACE (\d+)/);
  if (match) return `race-2026-texas-supreme-court-place-${Number(match[1])}`;
  match = office.match(/COURT OF CRIMINAL APPEALS.*PLACE (\d+)/);
  if (match) return `race-2026-court-of-criminal-appeals-place-${Number(match[1])}`;
  return null;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = csvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) =>
    Object.fromEntries(csvLine(line).map((value, index) => [headers[index], value.trim()])),
  );
}

function csvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else current += char;
  }
  values.push(current);
  return values;
}

function htmlToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>|<\/div>|<\/tr>|<\/td>|<\/th>|<\/li>|<\/h\d>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/\r/g, "");
}

function splitName(fullName) {
  const cleanName = stripIncumbent(fullName).replace(/\s+/g, " ").trim();
  const suffixMatch = cleanName.match(/,?\s+(JR\.?|SR\.?|II|III|IV)$/i);
  const suffix = suffixMatch?.[1]?.replace(/\./g, "") ?? null;
  const withoutSuffix = suffixMatch ? cleanName.slice(0, suffixMatch.index).replace(/,$/, "") : cleanName;
  const parts = withoutSuffix.split(" ");
  return {
    firstName: titleCase(parts[0] ?? withoutSuffix),
    middleName: parts.length > 2 ? titleCase(parts.slice(1, -1).join(" ")) : null,
    lastName: titleCase(parts.at(-1) ?? withoutSuffix),
    suffix,
  };
}

function partyFromText(value) {
  const normalized = clean(value).toLowerCase();
  if (/republican|^rep$|^r$|gop/.test(normalized)) return "republican";
  if (/democratic|democrat|^dem$|^d$/.test(normalized)) return "democratic";
  if (/libertarian|^lib$|^l$/.test(normalized)) return "libertarian";
  if (/green|^grn$|^g$/.test(normalized)) return "green";
  if (/independent|^ind$|^i$/.test(normalized)) return "independent";
  if (/nonpartisan/.test(normalized)) return "nonpartisan";
  if (/other/.test(normalized)) return "other";
  return null;
}

function partyLabel(party) {
  return {
    republican: "Republican",
    democratic: "Democratic",
    libertarian: "Libertarian",
    green: "Green",
    independent: "Independent",
    nonpartisan: "Nonpartisan",
    other: "Other",
  }[party];
}

function deduplicateRows(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row) continue;
    map.set(candidateKey(row.fullName, row.party, row.raceId), row);
  }
  return [...map.values()];
}

function deduplicateSources(sources) {
  return [...new Map(sources.filter(Boolean).map((source) => [source.url, source])).values()];
}

function candidateKey(name, party, raceId) {
  return `${normalizeName(name)}|${party}|${raceId}`;
}

function normalizeName(value) {
  return stripIncumbent(clean(value)).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function stripIncumbent(value) {
  return clean(value).replace(/\s*\(I\)\s*$/i, "");
}

function looksLikePerson(value) {
  const text = clean(value);
  return text.length >= 3 && /[A-Za-z]/.test(text) && !/^(candidate|ballots cast|polling|race total|status)$/i.test(text);
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/(^|[\s'-])([a-z])/g, (_match, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86_400_000);
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}
