import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { useElectionRaces } from "@/hooks/elections";
import { ELECTION_ROUTES } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";

export const Route = createFileRoute("/elections/voting")({
  head: () => ({
    meta: [
      { title: "Texas Ballot Research | KeepTXRed Election Central" },
      {
        name: "description",
        content:
          "Browse published Texas election races by ZIP, county, or district and continue to official Texas ballot resources.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Texas Ballot Research | KeepTXRed Election Central" },
      { property: "og:url", content: "https://keeptxred.com/elections/voting" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/voting" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ElectionRepositoryProvider>
      <VotingResearch />
    </ElectionRepositoryProvider>
  );
}

function VotingResearch() {
  const [zip, setZip] = useState("");
  const [county, setCounty] = useState("");
  const [district, setDistrict] = useState("");
  const races = useElectionRaces({
    filters: { stateCodes: ["TX"], publicationStatuses: ["published"] },
    pagination: { page: 1, pageSize: 500 },
    sort: [{ field: "name", direction: "asc" }],
  });
  const items = races.data?.items ?? [];
  const counties = useMemo(
    () =>
      Array.from(new Set(items.flatMap((race) => race.counties.map((item) => item.name)))).sort(),
    [items],
  );
  const districts = useMemo(
    () =>
      Array.from(
        new Set(
          items.flatMap((race) =>
            race.districtName &&
            (race.jurisdictionType === "congressional_district" ||
              race.jurisdictionType === "state_house_district" ||
              race.jurisdictionType === "state_senate_district")
              ? [race.districtName]
              : [],
          ),
        ),
      ).sort(),
    [items],
  );
  const normalizedZip = /^\d{5}$/.test(zip) ? zip : "";
  const matches = items.filter((race) => {
    if (normalizedZip && !race.zipCodes.includes(normalizedZip)) return false;
    if (county && !race.counties.some((item) => item.name === county)) return false;
    if (district && race.districtName !== district) return false;
    return Boolean(normalizedZip || county || district);
  });

  return (
    <ElectionLayout
      title="Texas Ballot Research"
      description="Browse public race information by ZIP, county, or district, then confirm your ballot with an official election authority."
      canonicalUrl="https://keeptxred.com/elections/voting"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.voting} />}
    >
      <div className="space-y-8">
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Election Central does not collect an address or determine an individual voter&apos;s
          ballot. ZIP results can overlap multiple districts. Always confirm with the official Texas
          voter portal or your county election office.
        </aside>

        <section
          aria-labelledby="ballot-browse-heading"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 id="ballot-browse-heading" className="text-xl font-bold text-slate-950">
            Browse published races
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="text-sm font-semibold text-slate-900">
              Texas ZIP code
              <input
                inputMode="numeric"
                maxLength={5}
                pattern="[0-9]{5}"
                value={zip}
                onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="5-digit ZIP"
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <Selection label="County" value={county} options={counties} onChange={setCounty} />
            <Selection
              label="Congressional or legislative district"
              value={district}
              options={districts}
              onChange={setDistrict}
            />
          </div>
          {zip && !normalizedZip ? (
            <p className="mt-3 text-sm font-semibold text-red-700">Enter a five-digit ZIP code.</p>
          ) : null}

          {normalizedZip || county || district ? (
            matches.length > 0 ? (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {matches.map((race) => (
                  <li key={race.id}>
                    <a
                      href={ELECTION_ROUTES.race(race.slug)}
                      className="block rounded-lg border border-slate-200 p-4 font-semibold text-red-700 hover:underline"
                    >
                      {race.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                No published Election Central races match this selection. Use the official links
                below to confirm your ballot.
              </p>
            )
          ) : null}
        </section>

        <section aria-labelledby="official-ballot-links">
          <h2 id="official-ballot-links" className="text-xl font-bold text-slate-950">
            Official find-my-ballot resources
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OfficialLink
              href="https://goelect.txelections.civixapps.com/ivis-mvp-ui/"
              label="Texas My Voter Portal"
            />
            <OfficialLink
              href="https://www.sos.state.tx.us/elections/voter/county.shtml"
              label="Texas county election offices"
            />
            <OfficialLink href="https://wrm.capitol.texas.gov/home" label="Who Represents Me?" />
          </div>
        </section>
      </div>
    </ElectionLayout>
  );
}

function Selection({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-900">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OfficialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="rounded-xl border border-slate-200 bg-white p-6 font-semibold text-red-700 shadow-sm hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}
