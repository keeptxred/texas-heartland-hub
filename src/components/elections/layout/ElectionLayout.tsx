import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

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
}

export function ElectionLayout({
  title,
  description,
  children,
  canonicalUrl,
  eyebrow = "Texas Election Central",
  lastUpdated,
  navigation,
  sidebar,
  actions,
  schema,
  fullWidth = false,
}: ElectionLayoutProps) {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "KeepTXRed",
    },
    about: {
      "@type": "Thing",
      name: "Texas elections",
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${title} | KeepTXRed`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <script type="application/ld+json">{JSON.stringify(schema ?? defaultSchema)}</script>
      </Helmet>

      <section className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <header className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
                  {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  {description}
                </p>
                {lastUpdated && (
                  <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>
                )}
              </header>

              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </div>
        </div>

        {navigation && (
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{navigation}</div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {sidebar ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <main className={fullWidth ? "lg:col-span-9" : "lg:col-span-8"}>{children}</main>
              <aside className={fullWidth ? "lg:col-span-3" : "lg:col-span-4"}>
                <div className="space-y-6 lg:sticky lg:top-6">{sidebar}</div>
              </aside>
            </div>
          ) : (
            <main>{children}</main>
          )}
          <aside className="mt-10 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
            <strong className="text-slate-800">Election data notice:</strong> Election Central
            republishes source-backed public information. Polls are survey snapshots, forecasts are
            estimates available for selected races only, and election returns are unofficial until
            certified. Confirm voting and ballot information with the responsible election authority.{" "}
            <a
              href="/elections/corrections"
              className="font-semibold text-red-700 underline-offset-4 hover:underline"
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
