export interface ElectionCountdownLink {
  label: string;
  href: string;
}

export interface ElectionCountdownProps {
  days: number | null;
  electionName?: string;
  electionDate?: string;
  electionType?: string;
  links?: readonly ElectionCountdownLink[];
  className?: string;
}

export function ElectionCountdown({
  days,
  electionName = "Next Texas election",
  electionDate = "To be announced",
  electionType = "Pending",
  links = [],
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
      {links.length > 0 && (
        <nav aria-label="Election countdown resources" className="sm:col-span-3 lg:col-span-1">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a href={link.href} className="font-semibold text-red-300 underline-offset-4 hover:text-white hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
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
