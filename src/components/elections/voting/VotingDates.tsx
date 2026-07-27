export interface VotingDateItem {
  id: string;
  label: string;
  date?: string | null;
  description?: string;
  status?: "upcoming" | "active" | "complete" | "pending";
}

export interface VotingDatesProps {
  dates: readonly VotingDateItem[];
  title?: string;
  description?: string;
  className?: string;
  emptyMessage?: string;
}

const STATUS_LABELS: Record<NonNullable<VotingDateItem["status"]>, string> = {
  upcoming: "Upcoming",
  active: "Happening now",
  complete: "Complete",
  pending: "Date pending",
};

export function VotingDates({
  dates,
  title = "Important voting dates",
  description = "Keep track of the deadlines and voting periods for the next Texas election.",
  className = "",
  emptyMessage = "Voting dates will be added when the election calendar is confirmed.",
}: VotingDatesProps) {
  return (
    <section
      aria-labelledby="voting-dates-title"
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`.trim()}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Voting calendar</p>
        <h2 id="voting-dates-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {dates.length > 0 ? (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dates.map((item) => {
            const status = item.status ?? (item.date ? "upcoming" : "pending");

            return (
              <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{item.label}</h3>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold text-red-700">{item.date || "To be announced"}</p>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}

export default VotingDates;
