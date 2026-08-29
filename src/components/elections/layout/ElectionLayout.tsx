import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useRouterState } from "@tanstack/react-router";

export interface ElectionLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  canonicalUrl?: string;
  eyebrow?: string;
  lastUpdated?: string;
  navigation?: ReactNode;
  sidebar?: ReactNode;
  actions?: ReactNode;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  fullWidth?: boolean;
  indexable?: boolean;
}

const ELECTION_DISCOVERY_LINKS = [
  ["2026 Election Central", "/elections/2026"],
  ["Races", "/elections/races"],
  ["Statewide", "/elections/statewide"],
  ["Legislative", "/elections/legislative"],
  ["Districts", "/elections/districts"],
  ["Candidates", "/elections/candidates"],
  ["Polls", "/elections/polls"],
  ["Forecast", "/elections/forecast"],
  ["Results", "/elections/results"],
  ["Voting", "/elections/voting"],
] as const;

const ELECTION_CENTRAL_TITLE = "2026 Texas Election Central: Races, Candidates, Polls & Results";

export function ElectionLayout({
  title,
  description,
  children,
  canonicalUrl,
  eyebrow = "Election coverage",
  lastUpdated,
  navigation,
  sidebar,
  actions,
  schema,
  fullWidth = false,
  indexable = true,
}: ElectionLayoutProps) {
  // This layout is also embedded on non-election pages (e.g. the homepage
  // election takeover). Only emit canonical/og:url when the visitor is
  // actually on the canonical URL, otherwise the host page gets a second,
  // conflicting canonical.
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const canonicalPath = canonicalUrl ? canonicalUrl.replace(/^https?:\/\/[^/]+/, "") || "/" : "";
  const normalized = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const isCanonicalPage = Boolean(canonicalPath) && canonicalPath === normalized;
  const isElectionPage = normalized === "/elections" || normalized.startsWith("/elections/");
  const isElectionCentralPage = isCanonicalPage && normalized === "/elections/2026";
  // ElectionHomePage is also embedded by the seasonal homepage takeover. Its
  // public heading must not depend on router/canonical state, because SSR and
  // embedded rendering can observe different host paths. Canonical/og:url
  // emission remains path-gated above; only the content identity is stable.
  const usesElectionCentralTitle = isElectionCentralPage || title === "Texas Election Central";
  const pageTitle = usesElectionCentralTitle ? ELECTION_CENTRAL_TITLE : title;
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description,
    url: canonicalUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://keeptxred.com/#website",
      url: "https://keeptxred.com",
      name: "Keep TX Red",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://keeptxred.com/#organization",
      name: "Keep TX Red",
      url: "https://keeptxred.com",
    },
    about: {
      "@type": "Thing",
      name: "Texas elections",
    },
  };
  const resolvedSchema = schema
    ? usesElectionCentralTitle
      ? Array.isArray(schema)
        ? schema.map((entry) => ({ ...entry, name: pageTitle }))
        : { ...schema, name: pageTitle }
      : schema
    : defaultSchema;

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | KeepTXRed`}</title>
        <meta name="description" content={description} />
        <meta
          name="robots"
          content={indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Keep TX Red" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {indexable && isCanonicalPage && <link rel="canonical" href={canonicalUrl} />}
        {indexable && isCanonicalPage && <meta property="og:url" content={canonicalUrl} />}
        <script type="application/ld+json">{JSON.stringify(resolvedSchema)}</script>
      </Helmet>

      <section className="min-h-screen bg-muted/20 text-foreground">
        <div className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <header className="max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {eyebrow}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {pageTitle}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {description}
                </p>
                {lastUpdated && (
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Last updated: {lastUpdated}
                  </p>
                )}
              </header>

              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </div>
        </div>

        <aside className="border-b border-border bg-muted/40" aria-label="Election Central editorial trust">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm leading-6 text-muted-foreground sm:px-6 lg:px-8">
            <strong className="text-foreground">Coverage &amp; sourcing:</strong> Election Central is maintained by the{" "}
            <a href="/authors/elections-desk" className="font-semibold text-primary underline-offset-4 hover:underline">
              Elections Desk
            </a>
            , an organizational editorial byline. Race, voting, poll, forecast, and result information is source-backed and governed by Keep TX Red&apos;s{" "}
            <a href="/editorial-standards" className="font-semibold text-primary underline-offset-4 hover:underline">
              Editorial Standards
            </a>
            .
          </div>
        </aside>

        {isElectionPage && (
          <nav className="border-b border-border bg-background" aria-label="Election Central sections">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 px-4 py-4 text-sm sm:px-6 lg:px-8">
              {ELECTION_DISCOVERY_LINKS.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}

        {navigation && (
          <div className="border-b border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{navigation}</div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {sidebar ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <main className={fullWidth ? "lg:col-span-9" : "lg:col-span-8"}>{children}</main>
              <aside className={fullWidth ? "lg:col-span-3" : "lg:col-span-4"}>
                <div className="space-y-6 lg:sticky lg:top-32">{sidebar}</div>
              </aside>
            </div>
          ) : (
            <main>{children}</main>
          )}
          <aside className="mt-10 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">Election data notice:</strong> Election Central
            republishes source-backed public information. Polls are survey snapshots, forecasts are
            estimates available for selected races only, and election returns are unofficial until
            certified. Before official reporting begins, a result count of 0 means no races are
            reporting yet; Keep TX Red does not fill gaps with placeholder vote totals. Confirm voting
            and ballot information with the responsible election authority.{" "}
            <a
              href="/elections/corrections"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Report a correction
            </a>
            .
          </aside>
        </div>
      </section>
    </>
  );
}

export default ElectionLayout;