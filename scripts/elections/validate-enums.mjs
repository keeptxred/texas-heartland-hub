import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const errors = [];

const data = Object.fromEntries(
  await Promise.all(
    ["cycle", "races", "candidates", "polls", "forecasts", "results"].map(async (name) => [
      name,
      JSON.parse(await readFile(path.join(DATA_DIR, `${name}.json`), "utf8")),
    ]),
  ),
);

const values = {
  verificationStatus: ["unverified", "pending_review", "verified", "rejected", "needs_update"],
  publicationStatus: ["draft", "in_review", "scheduled", "published", "unpublished", "archived"],
  freshnessStatus: ["fresh", "aging", "stale", "expired", "unknown"],
  sourceType: [
    "official",
    "government",
    "campaign",
    "pollster",
    "forecast_provider",
    "news_organization",
    "academic",
    "manual",
    "other",
  ],
  electionStatus: [
    "scheduled",
    "early_voting",
    "polls_open",
    "polls_closed",
    "counting",
    "called",
    "certified",
    "recount",
    "cancelled",
  ],
  officeLevel: ["federal", "state", "county", "municipal", "school_district", "special_district", "other"],
  raceType: ["executive", "legislative", "judicial", "administrative", "ballot_measure", "party_office", "other"],
  electionType: [
    "general",
    "primary",
    "primary_runoff",
    "runoff",
    "special",
    "special_runoff",
    "local",
    "constitutional_amendment",
  ],
  jurisdictionType: [
    "statewide",
    "congressional_district",
    "state_senate_district",
    "state_house_district",
    "state_board_of_education_district",
    "judicial_district",
    "county",
    "commissioners_precinct",
    "municipality",
    "school_district",
    "special_district",
    "precinct",
    "other",
  ],
  partyScope: [
    "partisan",
    "nonpartisan",
    "republican_primary",
    "democratic_primary",
    "libertarian_primary",
    "green_primary",
    "other_party_primary",
  ],
  raceStatus: [
    "draft",
    "scheduled",
    "filing_open",
    "filing_closed",
    "candidate_review",
    "early_voting",
    "polls_open",
    "polls_closed",
    "counting",
    "called",
    "recount",
    "runoff_required",
    "certified",
    "cancelled",
    "postponed",
  ],
  raceRating: [
    "safe_republican",
    "likely_republican",
    "leans_republican",
    "toss_up",
    "leans_democratic",
    "likely_democratic",
    "safe_democratic",
    "unrated",
  ],
  party: ["republican", "democratic", "libertarian", "green", "independent", "nonpartisan", "other"],
  candidateStatus: [
    "prospective",
    "active",
    "withdrawn",
    "suspended",
    "disqualified",
    "deceased",
    "write_in",
    "nominee",
    "elected",
    "defeated",
  ],
  filingStatus: ["not_filed", "filed", "pending_review", "accepted", "rejected", "withdrawn", "challenged"],
  incumbencyType: [
    "incumbent",
    "appointed_incumbent",
    "former_officeholder",
    "challenger",
    "open_seat_candidate",
    "unknown",
  ],
  campaignStatus: ["exploratory", "announced", "active", "suspended", "ended", "transition", "unknown"],
  ballotAccessStatus: ["not_applicable", "pending", "qualified", "challenged", "removed", "write_in_only", "unknown"],
  profileDepth: ["standard", "expanded"],
  pollStatus: ["draft", "fielding", "completed", "published", "revised", "withdrawn", "archived"],
  pollPopulation: ["adults", "registered_voters", "likely_voters", "primary_voters", "caucus_goers", "party_members", "other", "unknown"],
  pollMode: ["live_phone", "automated_phone", "online_panel", "text_message", "mail", "in_person", "mixed_mode", "other", "unknown"],
  pollGrade: ["a_plus", "a", "a_minus", "b_plus", "b", "b_minus", "c_plus", "c", "c_minus", "d", "f", "unrated"],
  pollQuestionType: ["head_to_head", "multi_candidate", "approval", "favorability", "ballot_measure", "issue", "generic_ballot", "primary_ballot", "runoff_ballot", "other"],
  pollSponsorType: ["news_organization", "academic", "nonprofit", "campaign", "political_party", "advocacy_group", "pollster", "government", "other", "unknown"],
  forecastStatus: ["draft", "active", "paused", "final", "archived"],
  forecastModel: ["fundamentals", "polling", "hybrid", "expert_rating", "simulation", "other"],
  forecastRating: [
    "safe_republican",
    "likely_republican",
    "leans_republican",
    "toss_up",
    "leans_democratic",
    "likely_democratic",
    "safe_democratic",
    "safe_other",
    "unrated",
  ],
  forecastConfidence: ["low", "medium", "high", "very_high", "unknown"],
  resultStatus: ["not_started", "in_progress", "projected", "called", "final_unofficial", "certified", "recount", "contested", "voided"],
  reportingStatus: ["not_reporting", "partial", "substantially_complete", "complete", "delayed", "paused", "unknown"],
  certificationStatus: ["not_applicable", "not_started", "pending", "partially_certified", "certified", "amended", "rescinded", "challenged", "unknown"],
  tabulationScope: ["statewide", "county", "district", "precinct", "municipality", "school_district", "special_district", "race_total", "unknown"],
};

for (const [collection, records] of Object.entries(data)) {
  records.forEach((record, index) => validateMetadata(record, `${collection}[${index}]`));
}

data.cycle.forEach((record, index) => enumValue(record.status, values.electionStatus, `cycle[${index}].status`));
data.races.forEach((record, index) => {
  const base = `races[${index}]`;
  enumValue(record.officeLevel, values.officeLevel, `${base}.officeLevel`);
  enumValue(record.raceType, values.raceType, `${base}.raceType`);
  enumValue(record.electionType, values.electionType, `${base}.electionType`);
  enumValue(record.jurisdictionType, values.jurisdictionType, `${base}.jurisdictionType`);
  enumValue(record.partyScope, values.partyScope, `${base}.partyScope`);
  enumValue(record.status, values.raceStatus, `${base}.status`);
  enumValue(record.rating, values.raceRating, `${base}.rating`);
});
data.candidates.forEach((record, index) => {
  const base = `candidates[${index}]`;
  enumValue(record.party, values.party, `${base}.party`);
  enumValue(record.status, values.candidateStatus, `${base}.status`);
  enumValue(record.filingStatus, values.filingStatus, `${base}.filingStatus`);
  enumValue(record.incumbencyType, values.incumbencyType, `${base}.incumbencyType`);
  enumValue(record.campaignStatus, values.campaignStatus, `${base}.campaignStatus`);
  enumValue(record.ballotAccessStatus, values.ballotAccessStatus, `${base}.ballotAccessStatus`);
  if (record.profileDepth != null) enumValue(record.profileDepth, values.profileDepth, `${base}.profileDepth`);
});
data.polls.forEach((record, index) => {
  const base = `polls[${index}]`;
  enumValue(record.status, values.pollStatus, `${base}.status`);
  enumValue(record.pollster?.grade, values.pollGrade, `${base}.pollster.grade`);
  enumValue(record.methodology?.population, values.pollPopulation, `${base}.methodology.population`);
  enumValue(record.methodology?.mode, values.pollMode, `${base}.methodology.mode`);
  (record.sponsors ?? []).forEach((sponsor, sponsorIndex) =>
    enumValue(sponsor.type, values.pollSponsorType, `${base}.sponsors[${sponsorIndex}].type`),
  );
  (record.questions ?? []).forEach((question, questionIndex) =>
    enumValue(question.type, values.pollQuestionType, `${base}.questions[${questionIndex}].type`),
  );
});
data.forecasts.forEach((record, index) => {
  const base = `forecasts[${index}]`;
  enumValue(record.status, values.forecastStatus, `${base}.status`);
  enumValue(record.rating, values.forecastRating, `${base}.rating`);
  enumValue(record.confidenceLevel, values.forecastConfidence, `${base}.confidenceLevel`);
  enumValue(record.model?.model, values.forecastModel, `${base}.model.model`);
});
data.results.forEach((record, index) => {
  const base = `results[${index}]`;
  enumValue(record.status, values.resultStatus, `${base}.status`);
  enumValue(record.reportingStatus, values.reportingStatus, `${base}.reportingStatus`);
  enumValue(record.certificationStatus, values.certificationStatus, `${base}.certificationStatus`);
  enumValue(record.tabulationScope, values.tabulationScope, `${base}.tabulationScope`);
});

if (errors.length) {
  console.error(`Election enum validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Election enum validation passed.");

function validateMetadata(record, location) {
  enumValue(record.verificationStatus, values.verificationStatus, `${location}.verificationStatus`);
  enumValue(record.publicationStatus, values.publicationStatus, `${location}.publicationStatus`);
  enumValue(record.freshnessStatus, values.freshnessStatus, `${location}.freshnessStatus`);
  enumValue(record.source?.sourceType, values.sourceType, `${location}.source.sourceType`);
}

function enumValue(value, allowed, location) {
  if (!allowed.includes(value)) errors.push(`${location} has unsupported value: ${String(value)}`);
}
