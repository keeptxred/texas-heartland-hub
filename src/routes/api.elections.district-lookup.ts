import { createFileRoute } from "@tanstack/react-router";

const CENSUS_GEOCODER =
  "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const TIGERWEB_LEGISLATIVE =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer";

type DistrictLookup = {
  matchedAddress: string;
  districts: {
    congressional: string;
    texasSenate: string;
    texasHouse: string;
  };
};

type CensusGeocoderResponse = {
  result?: {
    addressMatches?: Array<{
      matchedAddress?: string;
      coordinates?: { x?: number; y?: number };
    }>;
  };
};

type TigerQueryResponse = {
  features?: Array<{ attributes?: Record<string, unknown> }>;
  error?: { message?: string };
};

export const Route = createFileRoute("/api/elections/district-lookup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        if (raw.length > 2_000) return json({ error: "Request body is too large." }, 413);

        let input: Record<string, unknown>;
        try {
          input = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return json({ error: "Request body must be valid JSON." }, 400);
        }

        const address = typeof input.address === "string" ? input.address.trim() : "";
        if (address.length < 8 || address.length > 250) {
          return json(
            { error: "Enter a full Texas street address, including city or ZIP code." },
            400,
          );
        }

        try {
          const geocoded = await geocode(address);
          if (!geocoded) {
            return json(
              {
                error:
                  "The U.S. Census Bureau could not match that address. Check the street, city, and ZIP code and try again.",
              },
              404,
            );
          }

          const [congressional, texasSenate, texasHouse] = await Promise.all([
            lookupDistrict(0, "CD119", geocoded.longitude, geocoded.latitude),
            lookupDistrict(1, "SLDU", geocoded.longitude, geocoded.latitude),
            lookupDistrict(2, "SLDL", geocoded.longitude, geocoded.latitude),
          ]);

          if (!congressional || !texasSenate || !texasHouse) {
            return json(
              {
                error:
                  "The address matched, but it did not resolve to all three current Texas legislative districts. Confirm the address is in Texas.",
              },
              422,
            );
          }

          const result: DistrictLookup = {
            matchedAddress: geocoded.matchedAddress,
            districts: { congressional, texasSenate, texasHouse },
          };
          return json(result, 200);
        } catch (error) {
          console.error(
            "District lookup failed:",
            error instanceof Error ? error.message : "unknown upstream error",
          );
          return json(
            {
              error:
                "The district lookup service is temporarily unavailable. Use the official Texas Legislature address lookup below.",
            },
            502,
          );
        }
      },
    },
  },
});

async function geocode(address: string) {
  const url = new URL(CENSUS_GEOCODER);
  url.search = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Census geocoder returned HTTP ${response.status}.`);

  const payload = (await response.json()) as CensusGeocoderResponse;
  const match = payload.result?.addressMatches?.[0];
  const longitude = Number(match?.coordinates?.x);
  const latitude = Number(match?.coordinates?.y);
  if (!match?.matchedAddress || !Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }
  return { matchedAddress: match.matchedAddress, longitude, latitude };
}

async function lookupDistrict(
  layer: 0 | 1 | 2,
  districtField: "CD119" | "SLDU" | "SLDL",
  longitude: number,
  latitude: number,
) {
  const params = new URLSearchParams({
    f: "json",
    where: "STATE='48'",
    geometry: JSON.stringify({
      x: longitude,
      y: latitude,
      spatialReference: { wkid: 4326 },
    }),
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: `${districtField},BASENAME,NAME,STATE`,
    returnGeometry: "false",
  });
  const response = await fetch(
    `${TIGERWEB_LEGISLATIVE}/${layer}/query?${params.toString()}`,
  );
  if (!response.ok) throw new Error(`TIGERweb layer ${layer} returned HTTP ${response.status}.`);

  const payload = (await response.json()) as TigerQueryResponse;
  if (payload.error) {
    throw new Error(
      `TIGERweb layer ${layer} error: ${payload.error.message ?? "unknown error"}.`,
    );
  }
  const raw =
    payload.features?.[0]?.attributes?.[districtField] ??
    payload.features?.[0]?.attributes?.BASENAME;
  return normalizeDistrictNumber(raw);
}

function normalizeDistrictNumber(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const numeric = Number(raw);
  return Number.isInteger(numeric) && numeric > 0 ? String(numeric) : raw;
}

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
