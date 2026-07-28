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
              definition="Exponential decay with a 30-day half-life, measured from the poll’s field-end date. Future-dated polls receive no weight."
            />
            <Factor
              term="Sample size"
              definition="Square-root scaling around 600 respondents, bounded from 0.70 to 1.35."
            />
            <Factor
              term="Population"
              definition="Likely voters receive the most weight, followed by primary voters, registered voters, adults, and less directly relevant populations."
            />
            <Factor
              term="Pollster quality"
              definition="Published pollster grades range from 1.20 for A+ to 0.65 for F; unrated pollsters receive 0.85."
            />
            <Factor
              term="Independence"
              definition="Independent public polls receive full weight. Partisan polls receive 0.80 and internal polls 0.65; an internal partisan poll receives both discounts."
            />
            <Factor
              term="Methodology"
              definition="Live phone and mixed-mode polls receive the highest method factors. Online panels, automated phone, text, mail, in-person, other, and unknown modes receive disclosed lower factors."
            />
          </dl>
          <p className="mt-5">
            A candidate’s average is the weighted mean of only that candidate’s published responses.
            Missing responses are not treated as zero and are never imputed. The displayed margin is
            the difference between the top two weighted averages. The uncertainty range combines
            weighted poll dispersion with published margins of error and decreases as qualifying poll
            count increases.
          </p>
          <p className="mt-3">
            Every polling average reports its poll count, field-date range, recalculation timestamp,
            candidate averages, margin, uncertainty, and the individual factor values used for each
            poll.
          </p>
        </MethodSection>

        <MethodSection title="Forecast model">
          <p>
            Forecasts are deterministic daily snapshots, not reported poll results. The current model
            version is <code>ktr-forecast-1.0.0</code>. It requires two published, verified candidates
            and at least one source-backed model input.
          </p>
          <p className="mt-4">
            When credible polling averages exist for both candidates, the model begins with the
            Republican-minus-Democratic polling margin. Without polling, it uses a fundamentals score:
          </p>
          <Formula>
            previous election margin × 0.45 + district partisan lean × 0.35 + election environment ×
            0.20
          </Formula>
          <p className="mt-4">
            Candidate-specific incumbency, fundraising, and candidate-quality adjustments are then
            added. The resulting margin is converted to a two-candidate expected vote share and a
            rounded win probability using a logistic curve. Polling-based forecasts use a ±4.5-point
            vote-share interval; fundamentals-only forecasts use ±7 points. Forecast confidence is
            based on whether polling exists and how many fundamental inputs are present.
          </p>
          <p className="mt-3">
            Each forecast discloses its model type, version, timestamp, expected margin, expected vote
            share, win probability, confidence level, source list, fundamentals-based flag, and change
            from the previous published snapshot. Daily snapshots are retained rather than overwritten.
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
