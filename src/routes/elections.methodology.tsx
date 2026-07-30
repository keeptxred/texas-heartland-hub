import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export const Route = createFileRoute("/elections/methodology")({
  head: () => ({
    meta: [
      { title: "Election Central Methodology | KeepTXRed" },
      {
        name: "description",
        content:
          "Learn how KeepTXRed sources, verifies, weights, forecasts, updates, and labels public Texas election information.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Election Central Methodology | KeepTXRed" },
      { property: "og:url", content: "https://keeptxred.com/elections/methodology" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "2026 Texas Election Central" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/methodology" }],
  }),
  component: Page,
});

function Page() {
  return (
    <ElectionLayout
      title="Election Central Methodology"
      description="How KeepTXRed attributes, verifies, calculates, updates, and labels public election information."
      canonicalUrl="https://keeptxred.com/elections/methodology"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.methodology} />}
    >
      <div className="max-w-3xl space-y-8 text-base leading-7 text-slate-700">
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Source-backed public records</h2>
          <p className="mt-2">
            Election Central reads version-controlled JSON records from this site&apos;s public
            repository. A record enters public output only when it is marked both published and
            verified. Each record carries an original source, retrieval time, verification time,
            freshness status, and update time.
          </p>
          <p className="mt-2">
            Race scope and filing information prioritize the Texas Secretary of State and other
            responsible election authorities. Federal finance summaries use Federal Election
            Commission records. State finance summaries use Texas Ethics Commission exports. We do
            not publish placeholder candidates, invented poll numbers, estimated vote totals, or
            person-level voter records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Polling averages</h2>
          <p className="mt-2">
            A qualifying poll receives a multiplicative weight. The implemented formula is:
          </p>
          <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900">
            poll weight = recency × sample size × population × pollster quality × independence ×
            methodology
          </p>
          <p className="mt-3">
            Recency decays with a 21-day half-life. Sample-size weight grows with the square root of
            the sample and is capped so one very large poll cannot dominate the average. Likely-voter
            and primary-voter samples receive more weight than registered-voter or adult samples.
            Published pollster grades, internal or partisan sponsorship, survey mode, methodology
            disclosure, margin-of-error disclosure, and weighting disclosure also affect the final
            weight.
          </p>
          <p className="mt-2">
            Candidate averages divide the weighted sum of reported percentages by the total usable
            weight for that candidate. Missing candidate responses are never imputed. The output
            includes the poll count, field-date range, weighted averages, weighted margin, an
            uncertainty range, recalculation time, and a per-poll explanation. A race without
            qualifying public polls displays an honest no-poll state.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Forecast model</h2>
          <p className="mt-2">
            The deterministic model combines the weighted polling margin, previous election margin,
            district partisan lean, incumbency, fundraising, the statewide election environment, and
            a documented candidate-quality adjustment. When usable polling exists, the current model
            gives polling the largest share of the expected-margin calculation. When it does not,
            the forecast is explicitly labeled fundamentals-based and polling averages remain blank.
          </p>
          <p className="mt-2">
            Each output includes expected vote share, a rounded win probability, race rating,
            confidence level, change from the prior run, model version, sources, timestamp, and a
            fundamentals-based flag. Probabilities are derived from the expected margin with a fixed
            logistic conversion. They are model estimates, not facts or guarantees.
          </p>
          <p className="mt-2">
            The daily repository workflow appends one forecast snapshot per race per calendar day.
            It does not overwrite the historical series. A forecast is generated only when the race,
            candidates, and required input sources are published and verified.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Candidate comparison</h2>
          <p className="mt-2">
            Comparison tables use the same structured candidate, finance, polling, endorsement,
            statement, and voting-record data shown elsewhere on Election Central. Positions are
            displayed only when a source documents them. The table says “No documented position
            found” instead of inferring a candidate&apos;s view from party affiliation or outside
            commentary.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Ballot geography</h2>
          <p className="mt-2">
            County and district associations are included only from authoritative mappings. ZIP-code
            coverage is displayed only when the imported source identifies it as authoritative, and
            ZIP codes are never presented as a substitute for an exact official ballot. County
            election pages and official sample-ballot links are shown when available. Address
            geocoding is not part of the launch model.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Validation, freshness, and results</h2>
          <p className="mt-2">
            Every production build validates unique identifiers and slugs, candidate-race
            relationships, HTTPS source links, required metadata, dates, poll percentages, forecast
            probabilities, fundamentals sources, publication status, and the absence of person-level
            voter data. Automated QA also checks launch-scope race coverage, duplicate candidates,
            generated routes, source freshness, polling and forecast fixtures, sitemap output, and
            unofficial-results labeling.
          </p>
          <p className="mt-2">
            Election-night totals remain unofficial until certified by the responsible authority.
            The public homepage takeover remains disabled until the verified directory is populated,
            validation and QA pass, major routes contain real records, and polling and forecast pages
            show sourced information or accurate empty states.
          </p>
          <p className="mt-2">
            See the{" "}
            <a
              href={ELECTION_ROUTES.corrections}
              className="font-semibold text-red-700 hover:underline"
            >
              corrections policy
            </a>{" "}
            to report a factual issue.
          </p>
        </section>
      </div>
    </ElectionLayout>
  );
}
