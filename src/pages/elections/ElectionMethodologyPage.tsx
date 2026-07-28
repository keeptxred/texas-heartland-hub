import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export function ElectionMethodologyPage() {
  return (
    <ElectionLayout
      title="Election Central Methodology"
      description="How Keep TX Red validates election records, calculates weighted polling averages, produces forecasts, and labels results."
      canonicalUrl="https://keeptxred.com/elections/methodology"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.methodology} />}
    >
      <article className="mx-auto max-w-4xl space-y-10">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
            Transparency standards
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Election Central methodology
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Election Central publishes only source-backed records. Polling, forecasts, and election
            results are separate products, and missing information is never replaced with invented
            values.
          </p>
        </header>

        <MethodSection title="Public record requirements">
          <p>
            A race, candidate, poll, forecast, or result appears publicly only when its canonical
            record is both <strong>published</strong> and <strong>verified</strong>. Each record must
            include an HTTPS source, retrieval time, verification time, publication status, and
            freshness metadata. Automated validation rejects broken relationships, duplicate IDs or
            slugs, invalid percentages, unsupported enum values, and unpublished records in public
            output.
          </p>
        </MethodSection>

        <MethodSection title="Weighted polling averages">
          <p>Each qualifying poll receives this multiplicative weight:</p>
          <Formula>
            recency × sample size × population × pollster quality × independence × methodology
          </Formula>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <Factor
              term="Recency"
              definition="Exponential decay with a 21-day half-life, measured from the poll’s field-end date. The factor is bounded from 0.12 to 1.00, and future-dated polls receive no weight."
            />
            <Factor
              term="Sample size"
              definition="Square-root scaling relative to 600 respondents: √(sample size ÷ 600), bounded from 0.50 to 1.65."
            />
            <Factor
              term="Population"
              definition="Likely and primary voters receive 1.00; registered voters 0.88; adults 0.68; and other or unknown populations receive lower disclosed factors."
            />
            <Factor
              term="Pollster quality"
              definition="Published pollster grades range from 1.20 for A+ to 0.45 for F. Unrated pollsters receive 0.80."
            />
            <Factor
              term="Independence"
              definition="Independent public polls receive 1.00. Partisan polls receive 0.72 and internal polls receive 0.55."
            />
            <Factor
              term="Methodology"
              definition="The collection-mode factor is adjusted for whether the poll discloses a methodology URL, margin of error, and weighting description. The combined methodology factor is bounded from 0.55 to 1.18."
            />
          </dl>
          <p className="mt-5">
            A candidate’s average is the weighted mean of only that candidate’s published responses.
            Missing responses are not treated as zero and are never imputed. The displayed margin is
            the difference between the top two weighted averages. The uncertainty range combines each
            poll’s published margin of error—or a sample-size estimate when none is supplied—using the
            same poll weights.
          </p>
          <p className="mt-3">
            Every polling average reports its poll count, field-date range, recalculation timestamp,
            candidate averages, margin, uncertainty, and the individual factor values used for each
            poll.
          </p>
        </MethodSection>

        <MethodSection title="Forecast model">
          <p>
            Forecasts are deterministic snapshots, not reported poll results. The current model version
            is <code>ktr-2026.2</code>. A forecast requires published, verified Republican and Democratic
            candidates and at least one disclosed source. Other candidates remain visible in race and
            polling records, but the probability model is explicitly a two-major-party comparison.
          </p>
          <p className="mt-4">
            When both candidates have a sourced weighted polling average and no sourced fundamentals
            are configured, the model is labeled <strong>Polling</strong> and uses the weighted polling
            margin directly:
          </p>
          <Formula>Republican polling average − Democratic polling average</Formula>
          <p className="mt-4">
            When both polling and sourced fundamentals are available, the model is labeled
            <strong> Hybrid</strong>:
          </p>
          <Formula>
            polling margin × 0.65 + previous election margin × 0.12 + district partisan lean × 0.13 +
            election environment × 0.10 + candidate adjustments
          </Formula>
          <p className="mt-4">
            When no credible polling average is available, a forecast is generated only when sourced
            fundamentals have been explicitly enabled. That model is labeled <strong>Fundamentals</strong>:
          </p>
          <Formula>
            previous election margin × 0.35 + district partisan lean × 0.40 + election environment ×
            0.25 + candidate adjustments
          </Formula>
          <p className="mt-4">
            Candidate adjustments may include disclosed incumbency, fundraising, and candidate-quality
            values. No missing adjustment is invented; an omitted adjustment contributes zero. The
            expected margin is converted to two-party vote share and win probability with a logistic
            curve. Polling-only forecasts use a ±6-point interval with one distinct source and ±4.5
            points with multiple sources. Hybrid forecasts use ±4.5 points, and fundamentals-only
            forecasts use ±7.5 points.
          </p>
          <p className="mt-3">
            Polling-only confidence is Low with one distinct source and Medium with two or more. Hybrid
            confidence is Medium unless at least three distinct sources support the model, when it is
            High. Fundamentals confidence remains Low unless the model has sufficient disclosed history,
            partisan lean, and source coverage.
          </p>
          <p className="mt-3">
            Each forecast discloses its model type, version, timestamp, expected margin, expected vote
            share, win probability, confidence level, source list, fundamentals-based flag, and change
            from the previous published snapshot. At most one snapshot per race is retained for each
            calendar day.
          </p>
        </MethodSection>

        <MethodSection title="Race ratings">
          <p>
            Ratings are derived from the model’s expected Republican-minus-Democratic margin. Margins
            of 15 points or more are Safe; 8 to 14.9 are Likely; 3 to 7.9 are Lean; and margins inside
            3 points are Toss-up. The same thresholds apply in the Democratic direction.
          </p>
        </MethodSection>

        <MethodSection title="Campaign finance and candidate comparisons">
          <p>
            Federal summaries come from OpenFEC and state summaries from Texas Ethics Commission
            records or exports. The displayed fields are total raised, total spent, cash on hand, debt,
            reporting period, original source, and retrieval time. Finance registration alone is not
            treated as proof that a person qualified for the ballot.
          </p>
          <p className="mt-3">
            Candidate comparisons show only structured, sourced information. Issue positions, recent
            statements, endorsements, office history, voting records, polling, and finance data remain
            blank when no documented source is available. The comparison explicitly displays “No
            documented position found” instead of inferring a position.
          </p>
        </MethodSection>

        <MethodSection title="Geography and ballot browsing">
          <p>
            District-to-county associations use current U.S. Census Bureau TIGERweb congressional and
            state-legislative boundaries. County election links come from the Texas Secretary of State.
            ZIP codes are published only when an authoritative mapping is available, and ZIP coverage
            is never presented as an exact personal ballot. Address geocoding is not used in the launch
            version.
          </p>
        </MethodSection>

        <MethodSection title="Election results">
          <p>
            Results are labeled unofficial until the responsible election authority certifies them.
            Records preserve the original results URL, reporting timestamp, reporting status,
            certification status, vote totals, and source attribution. Missing precinct data,
            estimated vote remaining, or unreported vote methods are not estimated by Election Central.
          </p>
        </MethodSection>

        <MethodSection title="Corrections and freshness">
          <p>
            Source checks, relationship checks, route generation, sitemap generation, calculation
            fixtures, mobile browser tests, and freshness checks run in CI. Aging or stale records are
            flagged for review. Corrections preserve repository history through Git rather than silently
            replacing the prior public record.
          </p>
          <p className="mt-3">
            The Election Central homepage takeover remains disabled until all launch-scope races have
            sufficient verified candidate coverage, required geography is populated, validation and QA
            pass, and the generated readiness report states that the site is ready.
          </p>
        </MethodSection>
      </article>
    </ElectionLayout>
  );
}

function MethodSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm text-white">
      {children}
    </div>
  );
}

function Factor({ term, definition }: { term: string; definition: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <dt className="font-bold text-slate-950">{term}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700">{definition}</dd>
    </div>
  );
}

export default ElectionMethodologyPage;
