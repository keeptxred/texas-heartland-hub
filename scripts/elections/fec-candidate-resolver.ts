const FEC_API_KEY = process.env.FEC_API_KEY || "DEMO_KEY";

export interface FederalOfficeLookup {
  office: "H" | "S";
  district: string | null;
}

export function federalOfficeForRace(raceId: string | null | undefined): FederalOfficeLookup | null {
  if (raceId === "race-2026-us-senate") return { office: "S", district: null };
  const house = /^race-2026-us-house-(\d+)$/.exec(String(raceId ?? ""));
  return house ? { office: "H", district: house[1].padStart(2, "0") } : null;
}

export async function resolveFecCandidateId(
  fullName: string,
  office: FederalOfficeLookup,
): Promise<string | null> {
  const url = new URL("https://api.open.fec.gov/v1/candidates/search/");
  url.searchParams.set("api_key", FEC_API_KEY);
  url.searchParams.set("q", fullName);
  url.searchParams.set("cycle", "2026");
  url.searchParams.set("office", office.office);
  url.searchParams.set("state", "TX");
  url.searchParams.set("per_page", "20");
  if (office.district) url.searchParams.set("district", office.district);

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "KeepTXRed Election Central finance importer" },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const payload = await response.json();
    const matches = (payload.results ?? [])
      .filter((record: Record<string, unknown>) => recordMatchesOffice(record, office))
      .map((record: Record<string, unknown>) => ({
        id: typeof record.candidate_id === "string" ? record.candidate_id : null,
        score: nameMatchScore(fullName, String(record.name ?? "")),
      }))
      .filter((match: { id: string | null; score: number }) => match.id && match.score >= 0.8)
      .sort((left: { score: number }, right: { score: number }) => right.score - left.score);

    if (!matches.length) return null;
    if (matches.length > 1 && matches[0].score === matches[1].score) return null;
    return matches[0].id;
  } catch (error) {
    console.warn(`OpenFEC candidate search skipped for ${fullName}: ${(error as Error).message}`);
    return null;
  }
}

function recordMatchesOffice(record: Record<string, unknown>, expected: FederalOfficeLookup) {
  const office = String(record.office ?? record.candidate_office ?? "").toUpperCase();
  const state = String(
    record.state ?? record.office_state ?? record.candidate_office_state ?? "",
  ).toUpperCase();
  const district = String(
    record.district ?? record.office_district ?? record.candidate_office_district ?? "",
  ).padStart(2, "0");
  if (office && office !== expected.office) return false;
  if (state && state !== "TX") return false;
  if (expected.district && district && district !== expected.district) return false;
  return true;
}

function nameMatchScore(left: string, right: string) {
  const expected = nameTokens(left);
  const actual = nameTokens(right);
  if (!expected.length || !actual.length) return 0;
  const shared = expected.filter((token) => actual.includes(token));
  const coverage = shared.length / expected.length;
  const surnameMatch = actual.includes(expected.at(-1) ?? "");
  const firstMatch = actual.includes(expected[0] ?? "");
  return coverage * 0.7 + (surnameMatch ? 0.2 : 0) + (firstMatch ? 0.1 : 0);
}

function nameTokens(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token && !["jr", "sr", "ii", "iii", "iv", "the"].includes(token));
}
