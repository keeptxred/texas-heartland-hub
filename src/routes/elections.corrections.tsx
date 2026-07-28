import { createFileRoute } from "@tanstack/react-router";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export const Route = createFileRoute("/elections/corrections")({
  head: () => ({
    meta: [
      { title: "Election Central Corrections | KeepTXRed" },
      {
        name: "description",
        content:
          "Report a factual issue and review the KeepTXRed Election Central correction process.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/elections/corrections" }],
  }),
  component: ElectionCorrectionsPage,
});

function ElectionCorrectionsPage() {
  return (
    <ElectionLayout
      title="Election Central Corrections"
      description="How to report a factual issue in a candidate, race, poll, forecast, or results record."
      canonicalUrl="https://keeptxred.com/elections/corrections"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.corrections} />}
    >
      <div className="max-w-3xl space-y-6 text-base leading-7 text-slate-700">
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Report an issue</h2>
          <p className="mt-2">
            Send the page URL, the field you believe is incorrect, the proposed correction, and a
            link to an authoritative public source. Do not send a voter&apos;s address, registration
            record, ballot choices, or ballot-tracking information.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-600"
          >
            Contact KeepTXRed
          </a>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Review process</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>Editors compare the report with the cited source and the current record source.</li>
            <li>Incorrect public data is corrected, reverified, and given a new update time.</li>
            <li>Disputed model assumptions are reviewed against the published methodology.</li>
            <li>Certified results replace unofficial returns when the authority publishes them.</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-950">What labels mean</h2>
          <p className="mt-2">
            “Unofficial” means an election authority has not certified the result. “Forecast” means
            a model estimate, not a reported vote. “Last verified” records the most recent source
            review and does not guarantee that an external source has not changed since.
          </p>
        </section>
      </div>
    </ElectionLayout>
  );
}
