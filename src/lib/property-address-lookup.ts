import { COUNTIES } from "@/data/counties";

const PROPERTY_LOOKUP_API_URL = "/api/public/property-address-lookup";

export type LookupConfidence = "high" | "medium";

export type PropertyAddressInput = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

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
  error?: string;
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

function stripTexasSuffix(name: string) {
  return name
    .replace(/,\s*(Texas|TX)\s*$/i, "")
    .replace(/\s+(Texas|TX)\s*$/i, "")
    .trim();
}

function normalizeCountyName(name: string) {
  return stripTexasSuffix(name)
    .replace(/\s+County$/i, "")
    .trim();
}

function normalizeDistrictName(name: string) {
  return stripTexasSuffix(name)
    .replace(/\s+Unified School District$/i, " ISD")
    .replace(/\s+Independent School District$/i, " ISD")
    .replace(/\s+School District$/i, " ISD")
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

function parseAddressInput(input: PropertyAddressInput | string): PropertyAddressInput {
  if (typeof input !== "string") return input;

  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    street: parts[0] ?? "",
    city: parts[1] ?? "",
    state: parts[2] ?? "",
    zip: parts[3] ?? "",
  };
}

export async function lookupTexasProperty(
  rawInput: PropertyAddressInput | string,
  signal?: AbortSignal,
): Promise<PropertyLookupResult> {
  const input = parseAddressInput(rawInput);
  const street = input.street.trim();
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  const zip = input.zip.trim();

  if (street.length < 3 || city.length < 2 || state.length !== 2 || zip.length < 5) {
    throw new PropertyLookupError(
      "Enter a complete street address, city, state, and ZIP code.",
      "INVALID_ADDRESS",
    );
  }

  const params = new URLSearchParams({ street, city, state, zip });

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

  const payload = (await response.json().catch(() => ({}))) as CensusResponse;

  if (!response.ok) {
    throw new PropertyLookupError(
      payload.error || "The address service is temporarily unavailable. Continue manually or try again.",
      response.status === 400 ? "INVALID_ADDRESS" : "SERVICE_ERROR",
    );
  }

  const match = payload.result?.addressMatches?.[0];
  if (!match) {
    throw new PropertyLookupError(
      "We could not verify this property through the available address services. Continue manually to enter the county and school district rates.",
      "NOT_FOUND",
    );
  }

  const countyFromCensus = firstGeographyName(match.geographies, ["Counties"]);
  const countyName = normalizeCountyName(countyFromCensus);
  const county = COUNTIES.find(
    (item) => normalized(normalizeCountyName(item.name)) === normalized(countyName),
  );

  if (!county) {
    console.warn("[property-address-lookup] unmatched county geography", {
      rawCountyName: countyFromCensus,
      normalizedCountyName: countyName,
      state,
      zip,
    });
    throw new PropertyLookupError(
      "We found the address but could not match its Texas county. Continue manually or try again.",
      "SERVICE_ERROR",
    );
  }

  const cityName = stripTexasSuffix(firstGeographyName(match.geographies, [
    "Incorporated Places",
    "Census Designated Places",
  ]));
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
    matchedAddress:
      match.matchedAddress?.trim() || [street, city, state, zip].join(", "),
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
