import type { CandidateDetail } from "@/types/elections";
import { safeCandidateExternalUrl } from "./candidateUrls";

export function CandidateOfficeHistory({ candidate }: { candidate: CandidateDetail }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        Current and former office
      </h2>
      {candidate.officeHistory.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          No verified office history has been published.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-slate-200">
          {candidate.officeHistory.map((office, index) => {
            const sourceUrl = safeCandidateExternalUrl(office.sourceUrl);
            return (
              <li key={`${office.officeName}-${office.serviceStartDate ?? index}`} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{office.officeName}</h3>
                    {office.districtName ? (
                      <p className="mt-1 text-sm text-slate-600">{office.districtName}</p>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-600">
                    {office.current
                      ? "Current"
                      : formatServiceDates(office.serviceStartDate, office.serviceEndDate)}
                  </p>
                </div>
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-red-700 hover:underline"
                  >
                    Office-history source
                  </a>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function formatServiceDates(start: string | null, end: string | null) {
  if (!start && !end) return "Dates not reported";
  return `${start ? new Date(`${start}T00:00:00Z`).getUTCFullYear() : "Unknown"}–${
    end ? new Date(`${end}T00:00:00Z`).getUTCFullYear() : "present"
  }`;
}

export default CandidateOfficeHistory;
