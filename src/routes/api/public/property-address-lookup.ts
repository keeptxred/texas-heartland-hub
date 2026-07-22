import { createFileRoute } from "@tanstack/react-router";

const STRUCTURED_GEOCODER_URL =
  "https://geocoding.geo.census.gov/geocoder/geographies/address";
const ONELINE_GEOCODER_URL =
  "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

type CensusPayload = {
  result?: {
    addressMatches?: unknown[];
  };
};

type LookupAttempt = {
  name: string;
  url: string;
};

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
  const address = [street, city, state, zip].filter(Boolean).join(", ");
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });
  return `${ONELINE_GEOCODER_URL}?${params.toString()}`;
}

async function runAttempt(attempt: LookupAttempt) {
  const response = await fetch(attempt.url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "KeepTXRedPropertyTaxCalculator/1.0 (+https://www.keeptxred.com)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Census returned ${response.status}`);
  }

  return (await response.json()) as CensusPayload;
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

        const diagnostics: Array<{ attempt: string; outcome: string }> = [];
        let serviceFailures = 0;

        for (const attempt of attempts) {
          try {
            const payload = await runAttempt(attempt);
            const matches = payload.result?.addressMatches ?? [];
            if (matches.length > 0) {
              diagnostics.push({ attempt: attempt.name, outcome: "matched" });
              console.info("[property-address-lookup] matched", {
                attempt: attempt.name,
                city,
                state,
                zip,
              });
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

        if (serviceFailures === attempts.length) {
          return Response.json(
            { error: "Address lookup service unavailable.", lookupMeta: { diagnostics } },
            { status: 502 },
          );
        }

        console.info("[property-address-lookup] no Census match", {
          city,
          state,
          zip,
          diagnostics,
        });
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
