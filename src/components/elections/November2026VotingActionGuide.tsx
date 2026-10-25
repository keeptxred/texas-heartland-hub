import { Link } from "@tanstack/react-router";

/**
 * Verified against the Texas Secretary of State's November 2026 calendar.
 * Dates intentionally remain explicit rather than implying a county-specific
 * voting location, assigned ballot, eligibility, or universal early-voting hours.
 */
const actions = [
  {
    date: "October 19–30, 2026",
    title: "Texas early voting",
    description: "Eligible registered voters may vote at any early-voting location in their county. Check that location's actual hours before leaving.",
    href: "https://www.votetexas.gov/voting/where",
    label: "Official locations and hours",
  },
  {
    date: "November 3, 2026",
    title: "General Election Day",
    description: "Polls are generally open from 7 a.m. to 7 p.m. Check your county's Election Day polling rules: not every county uses countywide vote centers.",
    href: "https://www.votetexas.gov/voting/where",
    label: "Find Election Day polling places",
  },
  {
    date: "Before you go",
    title: "Confirm your ballot and ID",
    description: "Use the state voter portal for your registration and local ballot, then review the official Texas photo-ID and supporting-ID guidance.",
    href: "https://www.votetexas.gov/voting/need-id",
    label: "Official Texas voter ID guide",
  },
] as const;

export function November2026VotingActionGuide({ compact = false }: { compact?: boolean }) {
  // Keep historical voter guidance available at its canonical URL, but do
  // not promote an expired election over fresh stories on the homepage.
  if (compact && Date.now() >= Date.parse("2026-11-04T00:00:00-06:00")) return null;
  return (
    <section aria-labelledby={compact ? "homepage-vote-2026" : "election-vote-2026"} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Officially sourced · November 2026</p>
      <h2 id={compact ? "homepage-vote-2026" : "election-vote-2026"} className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">
        Texas early voting, Election Day and where to vote
      </h2>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
        The statewide dates are confirmed. Voting hours, locations and your assigned ballot are local or voter-specific, so verify them with the Texas Secretary of State and your county elections office.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <article key={action.title} className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{action.date}</p>
            <h3 className="mt-2 text-lg font-bold text-foreground">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
            <a href={action.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {action.label} ↗
            </a>
          </article>
        ))}
      </div>
      <nav aria-label="Texas voting resources" className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
        <Link to="/elections/voting" className="text-primary underline-offset-4 hover:underline">Complete voting guide →</Link>
        <Link to="/elections/voting/polling-place" className="text-primary underline-offset-4 hover:underline">Polling-place explainer →</Link>
        <Link to="/elections/voting/voter-registration-card" className="text-primary underline-offset-4 hover:underline">Registration-card rules →</Link>
        <a href="https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">Texas Secretary of State dates ↗</a>
      </nav>
    </section>
  );
}
