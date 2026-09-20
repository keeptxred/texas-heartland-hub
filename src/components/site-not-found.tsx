import { Link } from "@tanstack/react-router";

const RECOVERY_LINKS = [
  {
    to: "/news",
    label: "Latest Texas News",
    description: "Breaking news, statewide reporting, politics, business, and public affairs.",
  },
  {
    to: "/elections/2026",
    label: "Election Central",
    description: "Texas races, candidates, polls, voting information, forecasts, and results.",
  },
  {
    to: "/texas-politics",
    label: "Politics & Government",
    description: "Texas government, campaigns, officials, legislation, and policy coverage.",
  },
  {
    to: "/laws",
    label: "Texas Laws",
    description: "Plain-language legal guides grounded in Texas statutes and official sources.",
  },
  {
    to: "/find-representative",
    label: "Find My Representative",
    description: "Connect your location with the Texas officials who represent you.",
  },
  {
    to: "/issues",
    label: "Issues & Guides",
    description: "Evergreen explainers, policy trackers, data, tools, and editorial positions.",
  },
] as const;

export function SiteNotFound() {
  return (
    <section data-adsense-ineligible="true" className="bg-muted/20 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="not-found-title">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">404 · Page not found</p>
          <h1 id="not-found-title" className="mt-3 font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
            That page moved or no longer exists.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Use one of the main Keep TX Red sections below instead of hitting a dead end.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Go to homepage
            </Link>
            <Link to="/news" className="rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
              Browse latest news
            </Link>
          </div>
        </div>

        <nav className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Keep TX Red sections">
          {RECOVERY_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm"
            >
              <h2 className="font-semibold text-foreground group-hover:text-primary">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <span className="mt-4 block text-sm font-semibold text-primary">Open section →</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
