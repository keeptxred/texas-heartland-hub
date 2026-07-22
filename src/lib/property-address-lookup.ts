import { COUNTIES } from "@/data/counties";

const PROPERTY_LOOKUP_API_URL = "/api/public/property-address-lookup";

export type LookupConfidence = "high" | "medium";

export type PropertyLookupResult = {
  matchedAddress: string;
  countyName: string;
  countySlug: string;
  cityName: string;
  schoolDistrictName: string;
  countyRate: number;
  cityRate: number;
  schoolRate: number;
  confidence: LookupConfidence;
  missingFields: Array<"cityRate" | "schoolRate">;
};

type CensusGeography = {
  NAME?: string;
};

type CensusAddressMatch = {
  matchedAddress?: string;
  geographies?: Record<string, CensusGeography[]>;
};

type CensusResponse = {
  result?: {
    addressMatches?: CensusAddressMatch[];
  };
};

export class PropertyLookupError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_ADDRESS" | "NOT_FOUND" | "OUTSIDE_TEXAS" | "SERVICE_ERROR",
  ) {
    super(message);
    this.name = "PropertyLookupError";
  }
}

function firstGeographyName(
  geographies: Record<string, CensusGeography[]> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const name = geographies?.[key]?.[0]?.NAME?.trim();
    if (name) return name;
  }
  return "";
}

function normalizeCountyName(name: string) {
  return name.replace(/\s+County$/i, "").trim();
}

function normalizeDistrictName(name: string) {
  return name
    .replace(/\s+Unified School District$/i, " ISD")
    .replace(/\s+Independent School District$/i, " ISD")
    .trim();
}

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findSchoolDistrict(
  districts: Array<{ name: string; rate: number }>,
  censusName: string,
) {
  const target = normalized(normalizeDistrictName(censusName));
  if (!target) return undefined;

  return districts.find((district) => {
    const candidate = normalized(district.name);
    return candidate === target || candidate.includes(target) || target.includes(candidate);
  });
}

export async function lookupTexasProperty(
  address: string,
  signal?: AbortSignal,
): Promise<PropertyLookupResult> {
  const query = address.trim();
  if (query.length < 8) {
    throw new PropertyLookupError(
      "Enter a complete street address, city, state, and ZIP code.",
      "INVALID_ADDRESS",
    );
  }

  const params = new URLSearchParams({ address: query });

  let response: Response;
  try {
    response = await fetch(`${PROPERTY_LOOKUP_API_URL}?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new PropertyLookupError(
      "The address service is temporarily unavailable. Continue manually or try again.",
      "SERVICE_ERROR",
    );
  }

  if (!response.ok) {
    throw new PropertyLookupError(
      "The address service is temporarily unavailable. Continue manually or try again.",
      "SERVICE_ERROR",
    );
  }

  const payload = (await response.json()) as CensusResponse;
  const match = payload.result?.addressMatches?.[0];
  if (!match) {
    throw new PropertyLookupError(
      "We could not verify that address. Check the spelling and ZIP code or continue manually.",
      "NOT_FOUND",
    );
  }

  const countyFromCensus = firstGeographyName(match.geographies, ["Counties"]);
  const countyName = normalizeCountyName(countyFromCensus);
  const county = COUNTIES.find(
    (item) => normalized(item.name) === normalized(countyName),
  );

  if (!county) {
    throw new PropertyLookupError(
      "This calculator currently supports Texas properties only.",
      "OUTSIDE_TEXAS",
    );
  }

  const cityName = firstGeographyName(match.geographies, [
    "Incorporated Places",
    "Census Designated Places",
  ]);
  const censusDistrictName = firstGeographyName(match.geographies, [
    "Unified School Districts",
    "Secondary School Districts",
    "Elementary School Districts",
  ]);
  const schoolDistrict = findSchoolDistrict(county.schoolDistricts, censusDistrictName);

  const missingFields: PropertyLookupResult["missingFields"] = [];
  if (!county.cityAvgRate) missingFields.push("cityRate");
  if (!schoolDistrict?.rate) missingFields.push("schoolRate");

  return {
    matchedAddress: match.matchedAddress?.trim() || query,
    countyName: county.name,
    countySlug: county.slug,
    cityName,
    schoolDistrictName:
      schoolDistrict?.name || normalizeDistrictName(censusDistrictName),
    countyRate: county.countyRate,
    cityRate: county.cityAvgRate,
    schoolRate: schoolDistrict?.rate || 0,
    confidence: missingFields.length === 0 ? "high" : "medium",
    missingFields,
  };
}

export function buildShareableCalculationUrl(
  values: {
    countySlug: string;
    schoolDistrictName: string;
    countyRate: number;
    cityRate: number;
    schoolRate: number;
    currentValue: number;
    priorValue: number;
  },
  locationHref = typeof window === "undefined" ? "https://www.keeptxred.com/tax-calculator" : window.location.href,
) {
  const url = new URL(locationHref);
  url.search = "";
  url.hash = "";
  url.searchParams.set("county", values.countySlug);
  if (values.schoolDistrictName) url.searchParams.set("isd", values.schoolDistrictName);
  url.searchParams.set("countyRate", String(values.countyRate));
  url.searchParams.set("cityRate", String(values.cityRate));
  url.searchParams.set("schoolRate", String(values.schoolRate));
  url.searchParams.set("value", String(values.currentValue));
  url.searchParams.set("prior", String(values.priorValue));
  return url.toString();
}
