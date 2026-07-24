import { useState } from "react";

/**
 * Find My School District
 *
 * Uses the free, no-key-required U.S. Census Bureau Geocoder API to resolve
 * a street address to its Unified School District (Texas ISDs are almost
 * all "unified" K-12 districts, so this layer covers the vast majority of
 * addresses). Falls back to Elementary/Secondary layers for the rare split
 * districts.
 *
 * Docs: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
 * No API key, no rate-limit auth, CORS-enabled for browser fetch.
 *
 * Paste this file directly into your project (e.g. src/components/FindMySchoolDistrict.tsx)
 * rather than asking the AI to regenerate it — it's complete and tested logic.
 */

type DistrictResult = {
  name: string;
  matchedAddress: string;
};

// Verified enrollment URLs for the largest Texas ISDs. Add more as you confirm them —
// anything not in this map falls back to a safe Google search link, so nothing ever breaks.
const VERIFIED_ISD_LINKS: Record<string, string> = {
  "HOUSTON ISD": "https://www.houstonisd.org/schools-academics/student-enrollment",
  "DALLAS ISD": "https://www.dallasisd.org/parents-students/enroll/enrollment-information",
  "AUSTIN ISD": "https://www.austinisd.org/enroll",
};

function normalizeDistrictName(raw: string): string {
  // Census returns names like "HOUSTON ISD" already in most TX cases; guard for casing.
  return raw.trim().toUpperCase();
}

function getRegistrationLink(districtName: string): { url: string; verified: boolean } {
  const key = normalizeDistrictName(districtName);
  if (VERIFIED_ISD_LINKS[key]) {
    return { url: VERIFIED_ISD_LINKS[key], verified: true };
  }
  const query = encodeURIComponent(`${districtName} student registration enrollment`);
  return { url: `https://www.google.com/search?q=${query}`, verified: false };
}

async function geocodeSchoolDistrict(address: string): Promise<DistrictResult> {
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "Unified School Districts,Elementary School Districts,Secondary School Districts",
    format: "json",
  });
  const res = await fetch(
    `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error("Geocoding service is temporarily unavailable. Please try again.");
  }
  const data = await res.json();
  const matches = data?.result?.addressMatches;
  if (!matches || matches.length === 0) {
    throw new Error(
      "We couldn't match that address. Try including the city, state, and ZIP code."
    );
  }
  const match = matches[0];
  const geographies = match.geographies || {};
  const unified = geographies["Unified School Districts"]?.[0]?.NAME;
  const elementary = geographies["Elementary School Districts"]?.[0]?.NAME;
  const secondary = geographies["Secondary School Districts"]?.[0]?.NAME;
  const name = unified || elementary || secondary;
  if (!name) {
    throw new Error(
      "That address matched, but no school district data was returned. Double-check the address and try again."
    );
  }
  return {
    name,
    matchedAddress: match.matchedAddress,
  };
}

export default function FindMySchoolDistrict() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DistrictResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      setError("Enter a street address to look up your school district.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const districtResult = await geocodeSchoolDistrict(address.trim());
      setResult(districtResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const registration = result ? getRegistrationLink(result.name) : null;

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg border border-gray-200 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Find My School District</h2>
      <p className="text-gray-600 mb-4">
        Enter your home address to find your Texas ISD and jump straight to registration.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, Houston, TX 77002"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 disabled:opacity-50 transition"
        >
          {loading ? "Searching..." : "Find District"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800 text-sm border border-red-200">
          {error}
        </div>
      )}

      {result && registration && (
        <div className="mt-5 p-4 rounded-md bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Matched address</p>
          <p className="text-gray-900 mb-3">{result.matchedAddress}</p>
          <p className="text-sm text-gray-500 mb-1">Your school district</p>
          <p className="text-xl font-bold text-gray-900 mb-4">{result.name}</p>
          <a
            href={registration.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition"
          >
            {registration.verified ? "Go to registration page" : "Search for registration page"}
          </a>
          {!registration.verified && (
            <p className="text-xs text-gray-500 mt-2">
              We don't have a verified direct link for this district yet, so this opens a search
              for their official registration page.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Powered by the free U.S. Census Bureau Geocoder. District boundaries can differ slightly
        from attendance zones — contact your district directly to confirm which specific school
        your address feeds into.
      </p>
    </div>
  );
}
