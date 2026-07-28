import type { CandidateDetail } from "@/types/elections";
import { safeCandidateExternalUrl } from "./candidateUrls";

export function CandidateExpandedProfile({ candidate }: { candidate: CandidateDetail }) {
  if (candidate.profileDepth !== "expanded") return null;

  return (
    <section
      aria-labelledby="candidate-expanded-profile-heading"
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
          Expanded profile
        </p>
        <h2
          id="candidate-expanded-profile-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Campaign overview
        </h2>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-950">Campaign finance</h3>
        {candidate.fundraising ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Total raised" value={formatMoney(candidate.fundraising.totalRaised)} />
            <Metric label="Total spent" value={formatMoney(candidate.fundraising.totalSpent)} />
            <Metric label="Cash on hand" value={formatMoney(candidate.fundraising.cashOnHand)} />
            <Metric label="Debts owed" value={formatMoney(candidate.fundraising.debtsOwed)} />
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            No verified campaign-finance summary has been published.
          </p>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-bold text-slate-950">Published endorsements</h3>
        {candidate.endorsements.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {candidate.endorsements.map((endorsement) => {
              const sourceUrl = safeCandidateExternalUrl(endorsement.sourceUrl);
              return (
                <li
                  key={`${endorsement.organizationName}-${endorsement.endorsementDate ?? ""}`}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-950">{endorsement.organizationName}</p>
                  {endorsement.endorsementDate ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(endorsement.endorsementDate)}
                    </p>
                  ) : null}
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-xs font-semibold text-red-700 hover:underline"
                    >
                      Endorsement source
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            No sourced endorsements have been published.
          </p>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd>
    </div>
  );
}

function formatMoney(value: number | null) {
  if (value == null) return "Not reported";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default CandidateExpandedProfile;
