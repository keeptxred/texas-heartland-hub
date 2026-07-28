import candidatesJson from "../../../data/elections/2026/candidates.json";
import cycleJson from "../../../data/elections/2026/cycle.json";
import forecastsJson from "../../../data/elections/2026/forecasts.json";
import pollsJson from "../../../data/elections/2026/polls.json";
import racesJson from "../../../data/elections/2026/races.json";
import resultsJson from "../../../data/elections/2026/results.json";
import type {
  CandidateDetail,
  CandidateId,
  CandidateSummary,
  ElectionCandidate,
  ElectionCycleDetail,
  ElectionCycleRecord,
  ElectionCycleSummary,
  ElectionForecast,
  ElectionForecastDetail,
  ElectionForecastSnapshot,
  ElectionForecastSummary,
  ElectionPoll,
  ElectionPollDetail,
  ElectionPollSummary,
  ElectionRace,
  ElectionResult,
  ElectionResultCandidateSummary,
  ElectionResultDetail,
  ElectionResultSnapshot,
  ElectionResultSummary,
  PollQuestionSummary,
  PollTrendPoint,
  RaceDetail,
  RaceId,
  RacePage,
  RaceSummary,
  ReadonlyCandidateRepository,
  ReadonlyElectionCycleRepository,
  ReadonlyElectionForecastRepository,
  ReadonlyElectionPollRepository,
  ReadonlyElectionResultRepository,
  ReadonlyRaceRepository,
} from "../../../types/elections";
import type { ElectionRepositories } from "./types";

type Query = {
  filters?: Readonly<Record<string, unknown>>;
  pagination?: { page?: number; pageSize?: number };
  sort?: readonly { field: string; direction: "asc" | "desc" }[];
};

type ExtendedRace = ElectionRace & {
  counties?: readonly { id: string; name: string; slug: string }[];
  zipCodes?: readonly string[];
};
type ExtendedCandidate = ElectionCandidate & {
  fundraising?: CandidateDetail["fundraising"];
  campaignFinanceUrl?: string | null;
  endorsements?: CandidateDetail["endorsements"];
  officeHistory?: CandidateDetail["officeHistory"];
  sources?: CandidateDetail["sources"];
  profileDepth?: CandidateDetail["profileDepth"];
  relatedCandidateIds?: readonly CandidateId[];
  issuePositions?: CandidateDetail["issuePositions"];
  recentStatements?: CandidateDetail["recentStatements"];
  votingRecord?: CandidateDetail["votingRecord"];
};
type ExtendedForecast = ElectionForecast & { snapshots?: readonly ElectionForecastSnapshot[] };
type ExtendedResult = ElectionResult & { snapshots?: readonly ElectionResultSnapshot[] };

const cycles = publicRecords(cycleJson as unknown as readonly ElectionCycleRecord[]);
const races = publicRecords(racesJson as unknown as readonly ExtendedRace[]);
const candidates = publicRecords(candidatesJson as unknown as readonly ExtendedCandidate[]);
const polls = publicRecords(pollsJson as unknown as readonly ElectionPoll[]);
const forecasts = publicRecords(forecastsJson as unknown as readonly ExtendedForecast[]);
const results = publicRecords(resultsJson as unknown as readonly ExtendedResult[]);

const raceById = new Map(races.map((record) => [record.id, record]));
const candidateById = new Map(candidates.map((record) => [record.id, record]));
const pollById = new Map(polls.map((record) => [record.id, record]));
const forecastById = new Map(forecasts.map((record) => [record.id, record]));
const resultById = new Map(results.map((record) => [record.id, record]));

function publicRecords<T extends { publicationStatus: string; verificationStatus: string }>(
  input: readonly T[],
): readonly T[] {
  return Object.freeze(
    input.filter(
      (record) =>
        record.publicationStatus === "published" && record.verificationStatus === "verified",
    ),
  );
}

function page<T>(items: readonly T[], query?: Query): RacePage<T> {
  const currentPage = Math.max(1, query?.pagination?.page ?? 1);
  const pageSize = Math.max(1, query?.pagination?.pageSize ?? Math.max(items.length, 1));
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);
  const start = (currentPage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1 && totalPages > 0,
  };
}

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLocaleLowerCase("en-US");
}

function arrayIncludes(value: unknown, expected: unknown): boolean {
  return Array.isArray(value)
    ? value.some((item) => normalize(item) === normalize(expected))
    : normalize(value) === normalize(expected);
}

const FILTER_ALIASES: Readonly<Record<string, string>> = {
  ids: "id",
  raceIds: "raceId",
  candidateIds: "candidateId",
  electionCycleIds: "electionCycleId",
  officeIds: "officeId",
  districtIds: "districtId",
  countyIds: "countyIds",
  primaryRaceIds: "primaryRaceId",
  currentOfficeIds: "currentOfficeId",
  officeLevels: "officeLevel",
  raceTypes: "raceType",
  electionTypes: "electionType",
  jurisdictionTypes: "jurisdictionType",
  partyScopes: "partyScope",
  statuses: "status",
  ratings: "rating",
  parties: "party",
  filingStatuses: "filingStatus",
  incumbencyTypes: "incumbencyType",
  campaignStatuses: "campaignStatus",
  ballotAccessStatuses: "ballotAccessStatus",
  populations: "methodology.population",
  modes: "methodology.mode",
  grades: "pollster.grade",
  pollsterNames: "pollster.name",
  publicationStatuses: "publicationStatus",
  verificationStatuses: "verificationStatus",
  freshnessStatuses: "freshnessStatus",
  stateCodes: "stateCode",
  confidenceLevels: "confidenceLevel",
  models: "model.model",
  reportingStatuses: "reportingStatus",
  certificationStatuses: "certificationStatus",
  tabulationScopes: "tabulationScope",
};

function readPath(record: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
}

function recordMatches(record: unknown, filters?: Readonly<Record<string, unknown>>): boolean {
  if (!filters) return true;
  const object = record as Record<string, unknown>;
  return Object.entries(filters).every(([filterKey, expected]) => {
    if (expected === undefined || expected === null || expected === "") return true;
    if (filterKey === "search") {
      const needle = normalize(expected);
      return JSON.stringify(record).toLocaleLowerCase("en-US").includes(needle);
    }
    if (filterKey.endsWith("From") || filterKey.endsWith("To")) {
      const isFrom = filterKey.endsWith("From");
      const base = filterKey.slice(0, -4);
      const dateAliases: Record<string, string> = {
        electionDate: "electionDate",
        fieldDate: isFrom ? "fieldStartDate" : "fieldEndDate",
        releaseDate: "releaseDate",
        filingDate: "filingDate",
        updated: "updatedAt",
        captured: "capturedAt",
      };
      const actual = readPath(record, dateAliases[base] ?? `${base}At`);
      if (!actual) return false;
      return isFrom ? String(actual) >= String(expected) : String(actual) <= String(expected);
    }
    if (filterKey === "hasImage") return Boolean(object.imageUrl) === Boolean(expected);
    if (filterKey === "hasCampaignWebsite") return Boolean(object.campaignUrl ?? object.websiteUrl) === Boolean(expected);
    if (filterKey === "hasRace") return Boolean(object.raceId) === Boolean(expected);
    if (filterKey === "hasWinner") return Boolean(object.winnerCandidateId) === Boolean(expected);
    if (filterKey === "hasRunoff") return Boolean((object.runoffCandidateIds as unknown[])?.length) === Boolean(expected);
    if (filterKey === "certified") return (object.certificationStatus === "certified") === Boolean(expected);
    if (filterKey === "live") {
      return ["counting", "polls_open", "polls_closed"].includes(String(object.status)) === Boolean(expected);
    }
    if (filterKey === "active") return (object.status === "active") === Boolean(expected);
    if (filterKey === "final") return (object.status === "final") === Boolean(expected);

    const field = FILTER_ALIASES[filterKey] ?? filterKey;
    let actual = readPath(record, field);
    if (field === "candidateId") {
      actual = object.candidateIds ?? object.raceIds ?? (object.candidateResults as unknown[])?.map((item) => (item as { candidateId?: string }).candidateId);
    }
    if (Array.isArray(expected)) return expected.some((item) => arrayIncludes(actual, item));
    return arrayIncludes(actual, expected);
  });
}

function sortRecords<T>(items: readonly T[], sort?: Query["sort"]): readonly T[] {
  if (!sort?.length) return items;
  const aliases: Record<string, string> = {
    election_date: "electionDate",
    field_end_date: "fieldEndDate",
    release_date: "releaseDate",
    updated_at: "updatedAt",
    published_at: "publishedAt",
    last_vote_update_at: "lastVoteUpdateAt",
    reporting_percentage: "reporting.reportingPercentage",
    total_votes: "totalVotes",
    sample_size: "methodology.sampleSize",
    pollster_name: "pollster.name",
    confidence_level: "confidenceLevel",
    projected_margin: "projectedMargin",
    office_level: "officeLevel",
    ballot_name: "ballotName",
    last_name: "lastName",
    filing_date: "filingDate",
  };
  return [...items].sort((left, right) => {
    for (const rule of sort) {
      const path = aliases[rule.field] ?? rule.field;
      const leftValue = readPath(left, path);
      const rightValue = readPath(right, path);
      const result = String(leftValue ?? "").localeCompare(String(rightValue ?? ""), "en-US", {
        numeric: true,
      });
      if (result !== 0) return rule.direction === "desc" ? -result : result;
    }
    return 0;
  });
}

function filtered<T>(items: readonly T[], query?: Query): readonly T[] {
  return sortRecords(items.filter((record) => recordMatches(record, query?.filters)), query?.sort);
}

function latest<T extends { updatedAt: string }>(items: readonly T[]): T | null {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null;
}

function cycleSummary(record: ElectionCycleRecord): ElectionCycleSummary {
  return {
    id: record.id,
    slug: record.slug,
    year: record.year,
    name: record.name,
    stateCode: record.stateCode,
    status: record.status,
    electionDate: record.milestones.generalElectionDate,
    earlyVotingStart: record.milestones.earlyVotingStart,
    earlyVotingEnd: record.milestones.earlyVotingEnd,
    active: record.active,
    featured: record.featured,
    raceCount: races.filter((race) => race.electionCycleId === record.id).length,
    candidateCount: candidates.filter((candidate) => candidate.electionCycleId === record.id).length,
    freshnessStatus: record.freshnessStatus,
    verificationStatus: record.verificationStatus,
    updatedAt: record.updatedAt,
  };
}

function cycleDetail(record: ElectionCycleRecord): ElectionCycleDetail {
  return {
    ...record,
    raceCount: races.filter((race) => race.electionCycleId === record.id).length,
    candidateCount: candidates.filter((candidate) => candidate.electionCycleId === record.id).length,
    pollCount: polls.filter((poll) => poll.electionCycleId === record.id).length,
    forecastCount: forecasts.filter((forecast) => forecast.electionCycleId === record.id).length,
    resultCount: results.filter((result) => result.electionCycleId === record.id).length,
  };
}

function raceCandidateStatus(
  status: ElectionCandidate["status"],
): "active" | "withdrawn" | "disqualified" | "write_in" {
  if (status === "withdrawn" || status === "disqualified" || status === "write_in") return status;
  return "active";
}

function raceCandidate(candidate: ExtendedCandidate) {
  return {
    id: candidate.id,
    slug: candidate.slug,
    fullName: candidate.fullName,
    shortName: candidate.preferredName ?? candidate.ballotName,
    party: candidate.party,
    partyLabel: candidate.partyLabel,
    incumbent:
      candidate.incumbencyType === "incumbent" ||
      candidate.incumbencyType === "appointed_incumbent",
    imageUrl: candidate.imageUrl,
    status: raceCandidateStatus(candidate.status),
  } as const;
}

function raceSummary(record: ExtendedRace): RaceSummary {
  const raceCandidates = candidates.filter((candidate) => candidate.raceIds.includes(record.id));
  const latestPoll = latest(polls.filter((poll) => poll.raceId === record.id));
  const latestForecast = latest(forecasts.filter((forecast) => forecast.raceId === record.id));
  const latestResult = latest(results.filter((result) => result.raceId === record.id));
  return {
    id: record.id,
    electionCycleId: record.electionCycleId,
    slug: record.slug,
    name: record.name,
    shortName: record.shortName,
    officeName: record.officeName,
    officeLevel: record.officeLevel,
    raceType: record.raceType,
    electionType: record.electionType,
    jurisdictionType: record.jurisdictionType,
    partyScope: record.partyScope,
    districtName: record.districtName,
    districtNumber: record.districtNumber,
    counties: record.counties ?? [],
    zipCodes: record.zipCodes ?? [],
    stateCode: record.stateCode,
    electionDate: record.electionDate,
    status: record.status,
    rating: record.rating,
    featured: record.featured,
    competitive: record.competitive,
    uncontested: record.uncontested,
    candidates: raceCandidates.map(raceCandidate),
    incumbentCandidateId: record.incumbentCandidateId,
    winnerCandidateId: record.winnerCandidateId,
    latestPollId: latestPoll?.id ?? null,
    latestForecastId: latestForecast?.id ?? null,
    latestResultId: latestResult?.id ?? null,
    freshnessStatus: record.freshnessStatus,
    verificationStatus: record.verificationStatus,
    updatedAt: record.updatedAt,
  };
}

function raceDetail(record: ExtendedRace): RaceDetail {
  const poll = latest(polls.filter((item) => item.raceId === record.id));
  const forecast = latest(forecasts.filter((item) => item.raceId === record.id));
  const result = latest(results.filter((item) => item.raceId === record.id));
  return {
    ...record,
    candidates: candidates.filter((candidate) => candidate.raceIds.includes(record.id)).map(raceCandidate),
    latestPoll: poll
      ? {
          id: poll.id,
          pollsterName: poll.pollster.name,
          fieldStartDate: poll.fieldStartDate,
          fieldEndDate: poll.fieldEndDate,
          sampleSize: poll.methodology.sampleSize,
          marginOfError: poll.methodology.marginOfError,
          publishedAt: poll.publishedAt ?? poll.updatedAt,
        }
      : null,
    latestForecast: forecast
      ? {
          id: forecast.id,
          providerName: forecast.source.sourceName,
          rating: forecast.rating,
          projectedMargin: forecast.projectedMargin,
          confidence: confidenceNumber(forecast.confidenceLevel),
          generatedAt: forecast.model.lastModelRunAt ?? forecast.updatedAt,
        }
      : null,
    latestResult: result
      ? {
          id: result.id,
          reportingPercent: result.reporting.reportingPercentage ?? 0,
          totalVotes: result.totalVotes,
          called: result.status === "called" || result.winnerCandidateId != null,
          certified: result.certificationStatus === "certified",
          updatedAt: result.updatedAt,
        }
      : null,
    relatedRaceIds: races
      .filter(
        (item) =>
          item.id !== record.id &&
          (item.officeId === record.officeId || item.districtId === record.districtId),
      )
      .map((item) => item.id),
  };
}

function candidateRace(record: ExtendedRace, candidate: ExtendedCandidate) {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    officeName: record.officeName,
    officeLevel: record.officeLevel,
    raceType: record.raceType,
    electionType: record.electionType,
    districtName: record.districtName,
    electionDate: record.electionDate,
    status: record.status,
    isPrimaryRace: candidate.primaryRaceId === record.id,
    isWinner: record.winnerCandidateId === candidate.id,
  } as const;
}

function candidateSummary(record: ExtendedCandidate): CandidateSummary {
  const primaryRace = record.primaryRaceId ? raceById.get(record.primaryRaceId) : undefined;
  return {
    id: record.id,
    electionCycleId: record.electionCycleId,
    slug: record.slug,
    fullName: record.fullName,
    preferredName: record.preferredName,
    ballotName: record.ballotName,
    party: record.party,
    partyLabel: record.partyLabel,
    status: record.status,
    filingStatus: record.filingStatus,
    incumbencyType: record.incumbencyType,
    campaignStatus: record.campaignStatus,
    ballotAccessStatus: record.ballotAccessStatus,
    imageUrl: record.imageUrl,
    imageAltText: record.imageAltText,
    imageRights: record.imageRights,
    occupation: record.occupation,
    hometown: record.hometown,
    stateCode: record.stateCode,
    featured: record.featured,
    endorsed: record.endorsed,
    primaryRace: primaryRace ? candidateRace(primaryRace, record) : null,
    freshnessStatus: record.freshnessStatus,
    verificationStatus: record.verificationStatus,
    updatedAt: record.updatedAt,
  };
}

function candidateDetail(record: ExtendedCandidate): CandidateDetail {
  return {
    ...record,
    races: record.raceIds
      .map((id) => raceById.get(id))
      .filter((race): race is ExtendedRace => Boolean(race))
      .map((race) => candidateRace(race, record)),
    currentOffice: record.currentOfficeId
      ? {
          id: record.currentOfficeId,
          name: record.currentOfficeName ?? "Current office",
          level: raceById.get(record.primaryRaceId as RaceId)?.officeLevel ?? "state",
          districtName: raceById.get(record.primaryRaceId as RaceId)?.districtName ?? null,
          assumedOfficeDate: null,
          termEndDate: null,
        }
      : null,
    fundraising: record.fundraising ?? null,
    campaignFinanceUrl: record.campaignFinanceUrl ?? null,
    endorsements: record.endorsements ?? [],
    officeHistory: record.officeHistory ?? [],
    sources: record.sources ?? [
      {
        label: record.source.sourceName,
        url: record.source.sourceUrl,
        retrievedAt: record.source.retrievedAt,
      },
    ],
    profileDepth: record.profileDepth ?? "standard",
    relatedCandidateIds: record.relatedCandidateIds ?? [],
  };
}

function pollRace(record: ElectionPoll) {
  const race = record.raceId ? raceById.get(record.raceId) : undefined;
  return race
    ? {
        id: race.id,
        slug: race.slug,
        name: race.name,
        officeName: race.officeName,
        districtName: race.districtName,
        jurisdictionName: race.districtName ?? (race.jurisdictionType === "statewide" ? "Texas" : null),
        electionDate: race.electionDate,
      }
    : null;
}

function questionSummary(question: ElectionPoll["questions"][number]): PollQuestionSummary {
  const responses = question.responses.map((response) => {
    const candidate = response.candidateId ? candidateById.get(response.candidateId) : undefined;
    return {
      ...response,
      candidateSlug: candidate?.slug ?? null,
      candidateName: candidate?.fullName ?? null,
      candidateImageUrl: candidate?.imageUrl ?? null,
      partyLabel: candidate?.partyLabel ?? candidate?.party ?? null,
    };
  });
  const ordered = responses
    .filter((response) => response.percentage != null)
    .sort((left, right) => (right.percentage ?? 0) - (left.percentage ?? 0));
  const leader = ordered[0];
  const runnerUp = ordered[1];
  return {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    sampleSize: question.sampleSize,
    population: question.population,
    responses,
    leaderCandidateId: leader?.candidateId ?? null,
    leaderLabel: leader?.candidateName ?? leader?.label ?? null,
    leaderPercentage: leader?.percentage ?? null,
    leadMargin:
      leader?.percentage != null && runnerUp?.percentage != null
        ? Math.round((leader.percentage - runnerUp.percentage) * 10) / 10
        : null,
  };
}

function pollSummary(record: ElectionPoll): ElectionPollSummary {
  const primary = record.questions.find((question) => question.id === record.primaryQuestionId);
  const race = pollRace(record);
  return {
    id: record.id,
    slug: record.slug,
    electionCycleId: record.electionCycleId,
    race,
    jurisdictionId: record.jurisdictionId,
    jurisdictionName: race?.jurisdictionName ?? null,
    title: record.title,
    status: record.status,
    pollsterName: record.pollster.name,
    pollsterGrade: record.pollster.grade,
    sponsors: record.sponsors,
    fieldStartDate: record.fieldStartDate,
    fieldEndDate: record.fieldEndDate,
    releaseDate: record.releaseDate,
    sourceUrl: record.source.sourceUrl,
    toplineUrl: record.toplineUrl,
    methodology: record.methodology,
    primaryQuestion: primary ? questionSummary(primary) : null,
    internalPoll: record.internalPoll,
    partisanPoll: record.partisanPoll,
    trackingPoll: record.trackingPoll,
    freshnessStatus: record.freshnessStatus,
    verificationStatus: record.verificationStatus,
    updatedAt: record.updatedAt,
  };
}

function pollDetail(record: ElectionPoll): ElectionPollDetail {
  const summaries = record.questions.map(questionSummary);
  return {
    ...record,
    race: pollRace(record),
    jurisdictionName: pollRace(record)?.jurisdictionName ?? null,
    questionSummaries: summaries,
    primaryQuestion: summaries.find((question) => question.id === record.primaryQuestionId) ?? null,
    supersededByPoll: record.supersededByPollId
      ? pollById.get(record.supersededByPollId)
        ? pollSummary(pollById.get(record.supersededByPollId)!)
        : null
      : null,
  };
}

function forecastCoverage(race: ExtendedRace): ElectionForecastSummary["race"]["forecastCoverage"] {
  if (race.officeName === "U.S. Senate") return "us_senate";
  if (race.jurisdictionType === "statewide") return "statewide_executive";
  if (race.jurisdictionType === "congressional_district") return "us_house";
  if (race.jurisdictionType === "state_senate_district") return "texas_senate";
  return "texas_house";
}

function forecastRace(record: ElectionForecast) {
  const race = raceById.get(record.raceId);
  if (!race) throw new Error(`Forecast ${record.id} references missing public race ${record.raceId}.`);
  return {
    id: race.id,
    slug: race.slug,
    name: race.name,
    officeName: race.officeName,
    officeLevel: race.officeLevel,
    districtName: race.districtName,
    electionDate: race.electionDate,
    forecastCoverage: forecastCoverage(race),
    competitive: race.competitive,
  } as const;
}

function forecastCandidates(record: ElectionForecast) {
  return record.candidateProbabilities.map((probability) => {
    const candidate = candidateById.get(probability.candidateId);
    return {
      candidateId: probability.candidateId,
      candidateSlug: candidate?.slug ?? (probability.candidateId as unknown as CandidateSummary["slug"]),
      candidateName: candidate?.fullName ?? probability.candidateId,
      party: probability.party,
      imageUrl: candidate?.imageUrl ?? null,
      winProbability: probability.winProbability,
      projectedVoteShare: probability.projectedVoteShare,
      projectedVoteShareLow: probability.projectedVoteShareLow,
      projectedVoteShareHigh: probability.projectedVoteShareHigh,
      pollingAverage: probability.pollingAverage,
      winProbabilityChange: probability.winProbabilityChange,
    };
  });
}

function forecastSummary(record: ElectionForecast): ElectionForecastSummary {
  return {
    id: record.id,
    slug: record.slug,
    electionCycleId: record.electionCycleId,
    race: forecastRace(record),
    sourceId: record.source.sourceId ?? null,
    sourceName: record.source.sourceName,
    title: record.title,
    status: record.status,
    rating: record.rating,
    confidenceLevel: record.confidenceLevel,
    model: record.model.model,
    projectedWinnerCandidateId: record.projectedWinnerCandidateId,
    projectedMargin: record.projectedMargin,
    candidates: forecastCandidates(record),
    freshnessStatus: record.freshnessStatus,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
  };
}

function forecastDetail(record: ElectionForecast): ElectionForecastDetail {
  const candidateSummaries = forecastCandidates(record);
  return {
    ...record,
    race: forecastRace(record),
    candidateSummaries,
    projectedWinner:
      candidateSummaries.find(
        (candidate) => candidate.candidateId === record.projectedWinnerCandidateId,
      ) ?? null,
  };
}

function resultRace(record: ElectionResult) {
  const race = raceById.get(record.raceId);
  if (!race) throw new Error(`Result ${record.id} references missing public race ${record.raceId}.`);
  return {
    id: race.id,
    slug: race.slug,
    name: race.name,
    officeName: race.officeName,
    officeLevel: race.officeLevel,
    raceType: race.raceType,
    electionType: race.electionType,
    districtName: race.districtName,
    jurisdictionName: race.districtName ?? (race.jurisdictionType === "statewide" ? "Texas" : null),
    electionDate: race.electionDate,
  };
}

function resultCandidates(record: ElectionResult): readonly ElectionResultCandidateSummary[] {
  return record.candidateResults.map((result) => {
    const candidate = candidateById.get(result.candidateId);
    return {
      ...result,
      candidateSlug: candidate?.slug ?? (result.candidateId as unknown as CandidateSummary["slug"]),
      candidateName: candidate?.fullName ?? result.candidateId,
      ballotName: candidate?.ballotName ?? result.candidateId,
      party: candidate?.party ?? "other",
      partyLabel: candidate?.partyLabel ?? null,
      imageUrl: candidate?.imageUrl ?? null,
    };
  });
}

function resultSummary(record: ElectionResult): ElectionResultSummary {
  return {
    id: record.id,
    slug: record.slug,
    electionCycleId: record.electionCycleId,
    race: resultRace(record),
    status: record.status,
    reportingStatus: record.reportingStatus,
    certificationStatus: record.certificationStatus,
    tabulationScope: record.tabulationScope,
    totalVotes: record.totalVotes,
    turnoutPercentage: record.turnoutPercentage,
    reporting: record.reporting,
    leaderCandidateId: record.leaderCandidateId,
    winnerCandidateId: record.winnerCandidateId,
    candidates: resultCandidates(record),
    recountRequested: record.recountRequested,
    contested: record.contested,
    lastVoteUpdateAt: record.lastVoteUpdateAt,
    freshnessStatus: record.freshnessStatus,
    verificationStatus: record.verificationStatus,
    updatedAt: record.updatedAt,
  };
}

function resultDetail(record: ElectionResult): ElectionResultDetail {
  const summaries = resultCandidates(record);
  return {
    ...record,
    race: resultRace(record),
    candidateSummaries: summaries,
    leader: summaries.find((candidate) => candidate.candidateId === record.leaderCandidateId) ?? null,
    winner: summaries.find((candidate) => candidate.candidateId === record.winnerCandidateId) ?? null,
    runoffCandidates: summaries.filter((candidate) => record.runoffCandidateIds.includes(candidate.candidateId)),
    subdivisions: record.subdivisions.map((subdivision) => ({
      ...subdivision,
      entitySlug: null,
      parentEntityId: subdivision.countyId,
      parentEntityName: subdivision.countyName,
      candidateSummaries: subdivision.candidateResults.map((candidateResult) => {
        const candidate = candidateById.get(candidateResult.candidateId);
        return {
          ...candidateResult,
          candidateSlug: candidate?.slug ?? (candidateResult.candidateId as unknown as CandidateSummary["slug"]),
          candidateName: candidate?.fullName ?? candidateResult.candidateId,
          ballotName: candidate?.ballotName ?? candidateResult.candidateId,
          party: candidate?.party ?? "other",
          partyLabel: candidate?.partyLabel ?? null,
          imageUrl: candidate?.imageUrl ?? null,
        };
      }),
    })),
    voteMethodBreakdowns: record.voteMethodBreakdowns,
  };
}

function confidenceNumber(value: ElectionForecast["confidenceLevel"]): number | null {
  return { low: 35, medium: 60, high: 80, very_high: 95, unknown: null }[value];
}

const cycleRepository: ReadonlyElectionCycleRepository = {
  async findById(id) {
    return cycles.find((record) => record.id === id) ?? null;
  },
  async findBySlug(slug) {
    return cycles.find((record) => record.slug === slug) ?? null;
  },
  async findByYear(year, stateCode) {
    return cycles.find((record) => record.year === year && (!stateCode || record.stateCode === stateCode)) ?? null;
  },
  async findActive(stateCode) {
    return cycles.find((record) => record.active && (!stateCode || record.stateCode === stateCode)) ?? null;
  },
  async findSummaryById(id) {
    const record = cycles.find((item) => item.id === id);
    return record ? cycleSummary(record) : null;
  },
  async findDetailById(id) {
    const record = cycles.find((item) => item.id === id);
    return record ? cycleDetail(record) : null;
  },
  async list(query) {
    return page(filtered(cycles, query as Query).map(cycleSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(cycles, query as Query), query as Query);
  },
  async listUpcoming(stateCode, limit) {
    return cycles
      .filter((record) => (!stateCode || record.stateCode === stateCode) && record.status === "scheduled")
      .sort((left, right) => left.milestones.generalElectionDate.localeCompare(right.milestones.generalElectionDate))
      .slice(0, limit)
      .map(cycleSummary);
  },
  async count(filters) {
    return cycles.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return cycles.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

const raceRepository: ReadonlyRaceRepository = {
  async findById(id) {
    return raceById.get(id) ?? null;
  },
  async findBySlug(slug, cycleId) {
    return races.find((record) => record.slug === slug && (!cycleId || record.electionCycleId === cycleId)) ?? null;
  },
  async findSummaryById(id) {
    const record = raceById.get(id);
    return record ? raceSummary(record) : null;
  },
  async findDetailById(id) {
    const record = raceById.get(id);
    return record ? raceDetail(record) : null;
  },
  async findDetailBySlug(slug, cycleId) {
    const record = races.find((item) => item.slug === slug && (!cycleId || item.electionCycleId === cycleId));
    return record ? raceDetail(record) : null;
  },
  async list(query) {
    return page(filtered(races, query as Query).map(raceSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(races, query as Query), query as Query);
  },
  async listFeatured(cycleId, limit) {
    return races.filter((record) => record.electionCycleId === cycleId && record.featured).slice(0, limit).map(raceSummary);
  },
  async listCompetitive(cycleId, limit) {
    return races.filter((record) => record.electionCycleId === cycleId && record.competitive).slice(0, limit).map(raceSummary);
  },
  async listByCandidate(candidateId) {
    return races.filter((record) => record.candidateIds.includes(candidateId)).map(raceSummary);
  },
  async count(filters) {
    return races.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return races.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

const candidateRepository: ReadonlyCandidateRepository = {
  async findById(id) {
    return candidateById.get(id) ?? null;
  },
  async findBySlug(slug, cycleId) {
    return candidates.find((record) => record.slug === slug && (!cycleId || record.electionCycleId === cycleId)) ?? null;
  },
  async findSummaryById(id) {
    const record = candidateById.get(id);
    return record ? candidateSummary(record) : null;
  },
  async findDetailById(id) {
    const record = candidateById.get(id);
    return record ? candidateDetail(record) : null;
  },
  async findDetailBySlug(slug, cycleId) {
    const record = candidates.find((item) => item.slug === slug && (!cycleId || item.electionCycleId === cycleId));
    return record ? candidateDetail(record) : null;
  },
  async list(query) {
    return page(filtered(candidates, query as Query).map(candidateSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(candidates, query as Query), query as Query);
  },
  async listByRace(raceId) {
    return candidates.filter((record) => record.raceIds.includes(raceId)).map(candidateSummary);
  },
  async listByOffice(officeId) {
    return candidates.filter((record) => record.currentOfficeId === officeId).map(candidateSummary);
  },
  async listFeatured(cycleId, limit) {
    return candidates.filter((record) => record.electionCycleId === cycleId && record.featured).slice(0, limit).map(candidateSummary);
  },
  async listEndorsed(cycleId, limit) {
    return candidates.filter((record) => record.electionCycleId === cycleId && record.endorsed).slice(0, limit).map(candidateSummary);
  },
  async count(filters) {
    return candidates.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return candidates.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

const pollRepository: ReadonlyElectionPollRepository = {
  async findById(id) {
    return pollById.get(id) ?? null;
  },
  async findBySlug(slug, cycleId) {
    return polls.find((record) => record.slug === slug && (!cycleId || record.electionCycleId === cycleId)) ?? null;
  },
  async findSummaryById(id) {
    const record = pollById.get(id);
    return record ? pollSummary(record) : null;
  },
  async findDetailById(id) {
    const record = pollById.get(id);
    return record ? pollDetail(record) : null;
  },
  async findDetailBySlug(slug, cycleId) {
    const record = polls.find((item) => item.slug === slug && (!cycleId || item.electionCycleId === cycleId));
    return record ? pollDetail(record) : null;
  },
  async list(query) {
    return page(filtered(polls, query as Query).map(pollSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(polls, query as Query), query as Query);
  },
  async listByRace(raceId, query) {
    const items = filtered(polls.filter((record) => record.raceId === raceId), query as Query).map(pollSummary);
    return page(items, query as Query);
  },
  async listByCandidate(candidateId, cycleId) {
    return polls
      .filter(
        (record) =>
          (!cycleId || record.electionCycleId === cycleId) &&
          record.questions.some((question) => question.responses.some((response) => response.candidateId === candidateId)),
      )
      .map(pollSummary);
  },
  async listLatest(cycleId, limit) {
    return [...polls]
      .filter((record) => record.electionCycleId === cycleId)
      .sort((left, right) => right.fieldEndDate.localeCompare(left.fieldEndDate))
      .slice(0, limit)
      .map(pollSummary);
  },
  async listTrackingSeries(raceId) {
    return polls.filter((record) => record.raceId === raceId && record.trackingPoll).map(pollSummary);
  },
  async listTrendPoints(query) {
    const points: PollTrendPoint[] = [];
    for (const record of polls.filter((poll) => poll.raceId === query.raceId)) {
      for (const question of record.questions) {
        if (query.questionTypes?.length && !query.questionTypes.includes(question.type)) continue;
        if (query.populations?.length && !query.populations.includes(question.population)) continue;
        for (const response of question.responses) {
          if (query.candidateIds?.length && response.candidateId && !query.candidateIds.includes(response.candidateId)) continue;
          const candidate = response.candidateId ? candidateById.get(response.candidateId) : undefined;
          points.push({
            pollId: record.id,
            pollSlug: record.slug,
            pollsterName: record.pollster.name,
            fieldEndDate: record.fieldEndDate,
            releaseDate: record.releaseDate,
            questionId: question.id,
            candidateId: response.candidateId,
            candidateName: candidate?.fullName ?? null,
            party: response.party ?? candidate?.party ?? null,
            percentage: response.percentage,
            sampleSize: question.sampleSize,
            population: question.population,
            marginOfError: record.methodology.marginOfError,
          });
        }
      }
    }
    return points
      .filter((point) => (!query.fieldDateFrom || point.fieldEndDate >= query.fieldDateFrom) && (!query.fieldDateTo || point.fieldEndDate <= query.fieldDateTo))
      .sort((left, right) => left.fieldEndDate.localeCompare(right.fieldEndDate))
      .slice(0, query.limit);
  },
  async count(filters) {
    return polls.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return polls.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

const forecastRepository: ReadonlyElectionForecastRepository = {
  async findById(id) {
    return forecastById.get(id) ?? null;
  },
  async findBySlug(slug, cycleId) {
    return forecasts.find((record) => record.slug === slug && (!cycleId || record.electionCycleId === cycleId)) ?? null;
  },
  async findByRaceId(raceId) {
    return latest(forecasts.filter((record) => record.raceId === raceId));
  },
  async findSummaryById(id) {
    const record = forecastById.get(id);
    return record ? forecastSummary(record) : null;
  },
  async findDetailById(id) {
    const record = forecastById.get(id);
    return record ? forecastDetail(record) : null;
  },
  async findDetailBySlug(slug, cycleId) {
    const record = forecasts.find((item) => item.slug === slug && (!cycleId || item.electionCycleId === cycleId));
    return record ? forecastDetail(record) : null;
  },
  async findDetailByRaceId(raceId) {
    const record = latest(forecasts.filter((item) => item.raceId === raceId));
    return record ? forecastDetail(record) : null;
  },
  async list(query) {
    return page(filtered(forecasts, query as Query).map(forecastSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(forecasts, query as Query), query as Query);
  },
  async listActive(cycleId, limit) {
    return forecasts.filter((record) => record.electionCycleId === cycleId && record.status === "active").slice(0, limit).map(forecastSummary);
  },
  async listByCandidate(candidateId) {
    return forecasts.filter((record) => record.candidateProbabilities.some((candidate) => candidate.candidateId === candidateId)).map(forecastSummary);
  },
  async listSnapshots(query) {
    const record = forecastById.get(query.forecastId) as ExtendedForecast | undefined;
    const snapshots = record?.snapshots ?? [];
    return snapshots
      .filter((snapshot) => (!query.capturedFrom || snapshot.capturedAt >= query.capturedFrom) && (!query.capturedTo || snapshot.capturedAt <= query.capturedTo))
      .sort((left, right) => query.direction === "asc" ? left.capturedAt.localeCompare(right.capturedAt) : right.capturedAt.localeCompare(left.capturedAt))
      .slice(0, query.limit);
  },
  async count(filters) {
    return forecasts.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return forecasts.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

const resultRepository: ReadonlyElectionResultRepository = {
  async findById(id) {
    return resultById.get(id) ?? null;
  },
  async findBySlug(slug, cycleId) {
    return results.find((record) => record.slug === slug && (!cycleId || record.electionCycleId === cycleId)) ?? null;
  },
  async findByRaceId(raceId) {
    return latest(results.filter((record) => record.raceId === raceId));
  },
  async findSummaryById(id) {
    const record = resultById.get(id);
    return record ? resultSummary(record) : null;
  },
  async findDetailById(id) {
    const record = resultById.get(id);
    return record ? resultDetail(record) : null;
  },
  async findDetailBySlug(slug, cycleId) {
    const record = results.find((item) => item.slug === slug && (!cycleId || item.electionCycleId === cycleId));
    return record ? resultDetail(record) : null;
  },
  async findDetailByRaceId(raceId) {
    const record = latest(results.filter((item) => item.raceId === raceId));
    return record ? resultDetail(record) : null;
  },
  async list(query) {
    return page(filtered(results, query as Query).map(resultSummary), query as Query);
  },
  async listCore(query) {
    return page(filtered(results, query as Query), query as Query);
  },
  async listLive(cycleId, limit) {
    return results.filter((record) => record.electionCycleId === cycleId && ["counting", "polls_open", "polls_closed"].includes(record.status)).slice(0, limit).map(resultSummary);
  },
  async listCertified(cycleId, limit) {
    return results.filter((record) => record.electionCycleId === cycleId && record.certificationStatus === "certified").slice(0, limit).map(resultSummary);
  },
  async listByCandidate(candidateId) {
    return results.filter((record) => record.candidateResults.some((candidate) => candidate.candidateId === candidateId)).map(resultSummary);
  },
  async listBySubdivision(entityId, cycleId) {
    return results.filter((record) => (!cycleId || record.electionCycleId === cycleId) && record.subdivisions.some((subdivision) => subdivision.entityId === entityId)).map(resultSummary);
  },
  async listSnapshots(query) {
    const record = resultById.get(query.resultId) as ExtendedResult | undefined;
    return (record?.snapshots ?? [])
      .filter((snapshot) => (!query.capturedFrom || snapshot.capturedAt >= query.capturedFrom) && (!query.capturedTo || snapshot.capturedAt <= query.capturedTo))
      .sort((left, right) => query.direction === "asc" ? left.capturedAt.localeCompare(right.capturedAt) : right.capturedAt.localeCompare(left.capturedAt))
      .slice(0, query.limit);
  },
  async count(filters) {
    return results.filter((record) => recordMatches(record, filters as Record<string, unknown>)).length;
  },
  async exists(lookup) {
    return results.some((record) => recordMatches(record, lookup as Record<string, unknown>));
  },
};

export function createStaticElectionRepositories(): ElectionRepositories {
  return {
    mode: "static",
    cycles: cycleRepository,
    races: raceRepository,
    candidates: candidateRepository,
    polls: pollRepository,
    forecasts: forecastRepository,
    results: resultRepository,
  };
}
