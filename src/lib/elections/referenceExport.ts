type ElectionRecord = Record<string, unknown>;

type SourceRecord = {
  sourceName?: unknown;
  sourceType?: unknown;
  sourceUrl?: unknown;
  retrievedAt?: unknown;
};

export type ElectionReferenceRace = {
  id: string;
  slug: string;
  name: string;
  officeName: string;
  officeLevel: string;
  electionType: string;
  jurisdictionType: string;
  districtName: string | null;
  districtNumber: string | null;
  electionDate: string;
  status: string;
  candidateIds: string[];
  canonicalUrl: string;
  source: PublicSource | null;
  verifiedAt: string | null;
  updatedAt: string | null;
  dataAsOf: string | null;
};

export type ElectionReferenceCandidate = {
  id: string;
  slug: string;
  fullName: string;
  ballotName: string;
  party: string;
  partyLabel: string | null;
  status: string;
  filingStatus: string;
  incumbencyType: string;
  raceIds: string[];
  primaryRaceId: string | null;
  canonicalUrl: string;
  source: PublicSource | null;
  verifiedAt: string | null;
  updatedAt: string | null;
  dataAsOf: string | null;
};

export type PublicSource = {
  sourceName: string;
  sourceType: string;
  sourceUrl: string;
  retrievedAt: string | null;
};

export type ElectionReferenceExport = {
  schemaVersion: 1;
  site: 'Keep TX Red';
  electionCycle: '2026';
  canonicalHub: 'https://keeptxred.com/elections/2026';
  generatedFrom: 'published_verified_records';
  asOf: string | null;
  methodologyUrl: 'https://keeptxred.com/elections/methodology';
  races: ElectionReferenceRace[];
  candidates: ElectionReferenceCandidate[];
};

export function buildElectionReferenceExport(
  raceRecords: readonly ElectionRecord[],
  candidateRecords: readonly ElectionRecord[],
): ElectionReferenceExport {
  const races = raceRecords
    .filter(isPublicVerified)
    .flatMap(projectRace)
    .sort((a, b) => a.electionDate.localeCompare(b.electionDate) || a.name.localeCompare(b.name));

  const candidates = candidateRecords
    .filter(isPublicVerified)
    .flatMap(projectCandidate)
    .sort((a, b) => a.ballotName.localeCompare(b.ballotName));

  const asOf = newestDate([
    ...races.flatMap((race) => [race.verifiedAt, race.updatedAt, race.dataAsOf]),
    ...candidates.flatMap((candidate) => [candidate.verifiedAt, candidate.updatedAt, candidate.dataAsOf]),
  ]);

  return {
    schemaVersion: 1,
    site: 'Keep TX Red',
    electionCycle: '2026',
    canonicalHub: 'https://keeptxred.com/elections/2026',
    generatedFrom: 'published_verified_records',
    asOf,
    methodologyUrl: 'https://keeptxred.com/elections/methodology',
    races,
    candidates,
  };
}

function isPublicVerified(record: ElectionRecord) {
  return record.publicationStatus === 'published' && record.verificationStatus === 'verified';
}

function projectRace(record: ElectionRecord): ElectionReferenceRace[] {
  const id = string(record.id);
  const slug = string(record.slug);
  const name = string(record.name);
  const officeName = string(record.officeName);
  const electionDate = string(record.electionDate);
  if (!id || !slug || !name || !officeName || !electionDate) return [];

  return [{
    id,
    slug,
    name,
    officeName,
    officeLevel: string(record.officeLevel) ?? 'unknown',
    electionType: string(record.electionType) ?? 'unknown',
    jurisdictionType: string(record.jurisdictionType) ?? 'unknown',
    districtName: nullableString(record.districtName),
    districtNumber: nullableString(record.districtNumber),
    electionDate,
    status: string(record.status) ?? 'unknown',
    candidateIds: stringArray(record.candidateIds),
    canonicalUrl: `https://keeptxred.com/elections/races/${slug}`,
    source: publicSource(record.source),
    verifiedAt: nullableDate(record.verifiedAt),
    updatedAt: nullableDate(record.updatedAt),
    dataAsOf: nullableDate(record.dataAsOf),
  }];
}

function projectCandidate(record: ElectionRecord): ElectionReferenceCandidate[] {
  const id = string(record.id);
  const slug = string(record.slug);
  const fullName = string(record.fullName);
  const ballotName = string(record.ballotName);
  if (!id || !slug || !fullName || !ballotName) return [];

  return [{
    id,
    slug,
    fullName,
    ballotName,
    party: string(record.party) ?? 'unknown',
    partyLabel: nullableString(record.partyLabel),
    status: string(record.status) ?? 'unknown',
    filingStatus: string(record.filingStatus) ?? 'unknown',
    incumbencyType: string(record.incumbencyType) ?? 'unknown',
    raceIds: stringArray(record.raceIds),
    primaryRaceId: nullableString(record.primaryRaceId),
    canonicalUrl: `https://keeptxred.com/elections/candidates/${slug}`,
    source: publicSource(record.source),
    verifiedAt: nullableDate(record.verifiedAt),
    updatedAt: nullableDate(record.updatedAt),
    dataAsOf: nullableDate(record.dataAsOf),
  }];
}

function publicSource(value: unknown): PublicSource | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as SourceRecord;
  const sourceName = string(source.sourceName);
  const sourceType = string(source.sourceType);
  const sourceUrl = string(source.sourceUrl);
  if (!sourceName || !sourceType || !sourceUrl) return null;
  return { sourceName, sourceType, sourceUrl, retrievedAt: nullableDate(source.retrievedAt) };
}

function string(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nullableString(value: unknown) {
  return string(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : [];
}

function nullableDate(value: unknown) {
  const candidate = string(value);
  return candidate && !Number.isNaN(Date.parse(candidate)) ? candidate : null;
}

function newestDate(values: Array<string | null>) {
  const dates = values.filter((value): value is string => Boolean(value) && !Number.isNaN(Date.parse(value)));
  dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  return dates[0] ?? null;
}
