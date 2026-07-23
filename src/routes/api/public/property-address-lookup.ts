import { createFileRoute } from "@tanstack/react-router";

const STRUCTURED_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/geographies/address";
const ONELINE_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
const COORDINATE_GEOGRAPHY_URL = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates";
const ARCGIS_GEOCODER_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

type CensusPayload = {
  result?: {
    addressMatches?: unknown[];
    geographies?: Record<string, unknown[]>;
  };
};

type ArcGisCandidate = {
  address?: string;
  score?: number;
  location?: { x?: number; y?: number };
  attributes?: {
    Match_addr?: string;
    City?: string;
    RegionAbbr?: string;
    Postal?: string;
    CountryCode?: string;
  };
};

type ArcGisPayload = { candidates?: ArcGisCandidate[] };
type LookupAttempt = { name: string; url: string };
type Diagnostic = { attempt: string; outcome: string };

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeStreetSuffix(street: string) {
  const suffixes: Array<[RegExp, string]> = [
    [/\bDRIVE\b/gi, "DR"],
    [/\bSTREET\b/gi, "ST"],
    [/\bROAD\b/gi, "RD"],
    [/\bLANE\b/gi, "LN"],
    [/\bBOULEVARD\b/gi, "BLVD"],
    [/\bPARKWAY\b/gi, "PKWY"],
    [/\bCOURT\b/gi, "CT"],
    [/\bAVENUE\b/gi, "AVE"],
    [/\bCIRCLE\b/gi, "CIR"],
    [/\bTRAIL\b/gi, "TRL"],
    [/\bPLACE\b/gi, "PL"],
    [/\bHIGHWAY\b/gi, "HWY"],
  ];
  return suffixes.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    clean(street).toUpperCase(),
  );
}

function structuredUrl(street: string, city: string, state: string, zip: string) {
  const params = new URLSearchParams({
    street,
    city,
    state,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  if (zip) params.set("zip", zip);
  return `${STRUCTURED_GEOCODER_URL}?${params.toString()}`;
}

function oneLineUrl(street: string, city: string, state: string, zip: string) {
  const params = new URLSearchParams({
    address: [street, city, state, zip].filter(Boolean).join(", "),
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  return `${ONELINE_GEOCODER_URL}?${params.toString()}`;
}

function coordinateUrl(longitude: number, latitude: number) {
  const params = new URLSearchParams({
    x: String(longitude),
    y: String(latitude),
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  return `${COORDINATE_GEOGRAPHY_URL}?${params.toString()}`;
}

function arcGisUrl(street: string, city: string, state: string, zip: string) {
  const params = new URLSearchParams({
    SingleLine: [street, city, state, zip].filter(Boolean).join(", "),
    category: "Address",
    sourceCountry: "USA",
    outFields: "Match_addr,City,RegionAbbr,Postal,CountryCode",
    maxLocations: "5",
    forStorage: "false",
    f: "json",
  });
  return `${ARCGIS_GEOCODER_URL}?${params.toString()}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "KeepTXRedPropertyTaxCalculator/1.0 (+https://www.keeptxred.com)",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Lookup service returned ${response.status}`);
  return (await response.json()) as T;
}

function isTexasCandidate(candidate: ArcGisCandidate, requestedZip: string) {
  const attributes = candidate.attributes;
  const region = clean(attributes?.RegionAbbr ?? "").toUpperCase();
  const country = clean(attributes?.CountryCode ?? "").toUpperCase();
  const postal = clean(attributes?.Postal ?? "");
  const score = Number(candidate.score ?? 0);
  const longitude = Number(candidate.location?.x);
  const latitude = Number(candidate.location?.y);
  if (score < 80 || region !== "TX") return false;
  if (country && country !== "USA" && country !== "US") return false;
  if (requestedZip && postal && postal.slice(0, 5) !== requestedZip.slice(0, 5)) return false;
  return Number.isFinite(longitude) && Number.isFinite(latitude);
}

async function runCoordinateFallback(
  street: string,
  city: string,
  state: string,
  zip: string,
  diagnostics: Diagnostic[],
): Promise<CensusPayload | null> {
  try {
    const geocode = await fetchJson<ArcGisPayload>(arcGisUrl(street, city, state, zip));
    const candidates = geocode.candidates ?? [];
    const candidate = candidates.find((item) => isTexasCandidate(item, zip));
    if (!candidate) {
      diagnostics.push({
        attempt: "arcgis-address",
        outcome: candidates.length === 0 ? "no-candidates" : "no-qualified-match",
      });
      return null;
    }

    diagnostics.push({ attempt: "arcgis-address", outcome: `matched-${Math.round(candidate.score ?? 0)}` });
    const longitude = Number(candidate.location?.x);
    const latitude = Number(candidate.location?.y);
    const geography = await fetchJson<CensusPayload>(coordinateUrl(longitude, latitude));
    const geographies = geography.result?.geographies;
    if (!geographies || Object.keys(geographies).length === 0) {
      diagnostics.push({ attempt: "census-coordinate-geography", outcome: "no-geographies" });
      return null;
    }

    diagnostics.push({ attempt: "census-coordinate-geography", outcome: "matched" });
    return {
      result: {
        addressMatches: [
          {
            matchedAddress:
              candidate.attributes?.Match_addr ??
              candidate.address ??
              [street, city, state, zip].filter(Boolean).join(", "),
            coordinates: { x: longitude, y: latitude },
            geographies,
          },
        ],
      },
    };
  } catch (error) {
    diagnostics.push({ attempt: "coordinate-fallback", outcome: "service-error" });
    console.error("[property-address-lookup] coordinate fallback failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export const Route = createFileRoute("/api/public/property-address-lookup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const street = clean(requestUrl.searchParams.get("street") ?? "");
        const city = clean(requestUrl.searchParams.get("city") ?? "");
        const state = clean(requestUrl.searchParams.get("state") ?? "").toUpperCase();
        const zip = clean(requestUrl.searchParams.get("zip") ?? "");

        if (street.length < 3 || city.length < 2 || state.length !== 2) {
          return Response.json(
            { error: "Enter a complete street address, city, state, and ZIP code." },
            { status: 400 },
          );
        }

        const normalizedStreet = normalizeStreetSuffix(street);
        const attempts: LookupAttempt[] = [
          {
            name: "structured-normalized-with-zip",
            url: structuredUrl(normalizedStreet, city, state, zip),
          },
        ];
        if (normalizedStreet !== street.toUpperCase()) {
          attempts.push({
            name: "structured-original-with-zip",
            url: structuredUrl(street, city, state, zip),
          });
        }
        attempts.push(
          {
            name: "structured-normalized-without-zip",
            url: structuredUrl(normalizedStreet, city, state, ""),
          },
          {
            name: "oneline-normalized",
            url: oneLineUrl(normalizedStreet, city, state, zip),
          },
        );

        const diagnostics: Diagnostic[] = [];
        let serviceFailures = 0;
        for (const attempt of attempts) {
          try {
            const payload = await fetchJson<CensusPayload>(attempt.url);
            const matches = payload.result?.addressMatches ?? [];
            if (matches.length > 0) {
              diagnostics.push({ attempt: attempt.name, outcome: "matched" });
              return Response.json(
                { ...payload, lookupMeta: { matchedAttempt: attempt.name, diagnostics } },
                {
                  status: 200,
                  headers: { "Cache-Control": "private, max-age=300" },
                },
              );
            }
            diagnostics.push({ attempt: attempt.name, outcome: "no-match" });
          } catch (error) {
            serviceFailures += 1;
            diagnostics.push({ attempt: attempt.name, outcome: "service-error" });
            console.error("[property-address-lookup] attempt failed", {
              attempt: attempt.name,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }

        const fallbackPayload = await runCoordinateFallback(
          normalizedStreet,
          city,
          state,
          zip,
          diagnostics,
        );
        if ((fallbackPayload?.result?.addressMatches ?? []).length > 0) {
          return Response.json(
            {
              ...fallbackPayload,
              lookupMeta: { matchedAttempt: "arcgis-plus-census-coordinates", diagnostics },
            },
            {
              status: 200,
              headers: { "Cache-Control": "private, max-age=300" },
            },
          );
        }

        if (serviceFailures === attempts.length) {
          return Response.json(
            { error: "Address lookup service unavailable.", lookupMeta: { diagnostics } },
            { status: 502 },
          );
        }

        return Response.json(
          {
            result: { addressMatches: [] },
            lookupMeta: { diagnostics },
          },
          {
            status: 200,
            headers: { "Cache-Control": "private, max-age=60" },
          },
        );
      },
    },
  },
});
