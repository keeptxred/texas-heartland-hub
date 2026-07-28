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
          "Learn how KeepTXRed sources, verifies, updates, and labels public Texas election information.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/methodology" }],
  }),
  component: Page,
});
function Page() {
  return (
    <ElectionLayout
      title="Election Central Methodology"
      description="How KeepTXRed attributes, verifies, updates, and labels public election information."
      canonicalUrl="https://keeptxred.com/elections/methodology"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.methodology} />}
    >
      <div className="max-w-3xl space-y-6 text-base leading-7 text-slate-700">
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Source-backed records</h2>
          <p className="mt-2">
            Election Central displays public, read-only records with source attribution and update
            times. Polls, forecasts, and official results remain distinct data products.
          </p>
          <p className="mt-2">
            Candidate, race, poll, forecast, and result records are published only with source
            attribution and a verification date. Election Central never creates placeholder
            candidates, poll numbers, vote totals, or person-level voter records.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Polling averages</h2>
          <p className="mt-2">
            Polling averages are equal-weight means of the published candidate toplines that match
            the active race, date, population, sponsor, pollster, and internal-poll filters. Missing
            responses are not imputed, and races without qualifying polls display a no-poll notice.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Forecasts</h2>
          <p className="mt-2">
            Forecasts disclose estimated vote share, win probability, rating, polling average,
            change, confidence, and update time. When credible public polling is unavailable, the
            page is labeled a fundamentals-based forecast and discloses its previous-result,
            partisan-lean, incumbency, fundraising, and candidate-quality inputs.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Verification and corrections</h2>
          <p className="mt-2">
            Publication, verification, and freshness labels describe editorial review and data age.
            Election-night totals remain unofficial until certified by the responsible authority.
          </p>
          <p className="mt-2">
            Daily automation requests new model runs, but publication remains subject to source,
            range, and disclosure checks. See the{" "}
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
