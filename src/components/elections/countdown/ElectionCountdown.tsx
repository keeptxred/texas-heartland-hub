export interface ElectionCountdownProps {
  days: number | null;
  electionName?: string;
  electionDate?: string;
  electionType?: string;
  className?: string;
}

export function ElectionCountdown({
  days,
  electionName = "Next Texas election",
  electionDate = "To be announced",
  electionType = "Pending",
  className = "",
}: ElectionCountdownProps) {
  const dayValue = days === null ? "—" : String(Math.max(0, days));
  const dayLabel = days === 1 ? "Day remaining" : "Days remaining";

  return (
    <section
      aria-label={`${electionName} countdown`}
      className={`grid gap-3 sm:grid-cols-3 lg:grid-cols-1 ${className}`.trim()}
    >
      <CountdownStat value={dayValue} label={dayLabel} emphasis />
      <CountdownStat value={electionDate} label="Election date" />
      <CountdownStat value={electionType} label="Election type" />
      <p className="sr-only">
        {days === null
          ? `The date for ${electionName} has not been announced.`
          : `${dayValue} ${dayLabel.toLowerCase()} until ${electionName}.`}
      </p>
    </section>
  );
}

function CountdownStat({
  value,
  label,
  emphasis = false,
}: {
  value: string;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-5">
      <div className={emphasis ? "text-4xl font-bold text-red-400" : "text-xl font-bold text-white"}>
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
        {label}
      </div>
    </div>
  );
}

export default ElectionCountdown;
