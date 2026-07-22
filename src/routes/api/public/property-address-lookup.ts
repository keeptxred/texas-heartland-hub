import { createFileRoute } from "@tanstack/react-router";

const CENSUS_GEOCODER_URL =
  "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

export const Route = createFileRoute("/api/public/property-address-lookup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const address = requestUrl.searchParams.get("address")?.trim() ?? "";

        if (address.length < 8 || address.length > 300) {
          return Response.json(
            { error: "Enter a complete property address." },
            { status: 400 },
          );
        }

        const params = new URLSearchParams({
          address,
          benchmark: "Public_AR_Current",
          vintage: "Current_Current",
          format: "json",
        });

        try {
          const censusResponse = await fetch(
            `${CENSUS_GEOCODER_URL}?${params.toString()}`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "KeepTXRedPropertyTaxCalculator/1.0 (+https://www.keeptxred.com)",
              },
              signal: AbortSignal.timeout(15000),
            },
          );

          if (!censusResponse.ok) {
            console.error("[property-address-lookup] Census geocoder error", {
              status: censusResponse.status,
            });
            return Response.json(
              { error: "Address lookup service unavailable." },
              { status: 502 },
            );
          }

          const payload = await censusResponse.text();
          return new Response(payload, {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "private, max-age=300",
            },
          });
        } catch (error) {
          console.error("[property-address-lookup] request failed", error);
          return Response.json(
            { error: "Address lookup service unavailable." },
            { status: 502 },
          );
        }
      },
    },
  },
});
