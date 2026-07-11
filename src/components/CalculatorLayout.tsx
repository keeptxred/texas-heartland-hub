import React from "react";
import { Helmet } from "react-helmet-async";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  lastUpdated?: string;
  schema?: Record<string, unknown>;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function CalculatorLayout({
  title,
  description,
  canonicalUrl,
  lastUpdated,
  schema,
  children,
  sidebar,
}: CalculatorLayoutProps) {
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    url: canonicalUrl,
  };

  return (
    <>
      <Helmet>
        <title>{title} | KeepTXRed</title>

        <meta
          name="description"
          content={description}
        />

        {canonicalUrl && (
          <link
            rel="canonical"
            href={canonicalUrl}
          />
        )}

        <meta
          property="og:title"
          content={title}
        />

        <meta
          property="og:description"
          content={description}
        />

        <meta
          property="og:type"
          content="website"
        />

        {canonicalUrl && (
          <meta
            property="og:url"
            content={canonicalUrl}
          />
        )}

        <script type="application/ld+json">
          {JSON.stringify(schema ?? defaultSchema)}
        </script>
      </Helmet>

      <section className="mx-auto max-w-7xl px-4 py-8">

        <header className="mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {description}
          </p>

          {lastUpdated && (
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {lastUpdated}
            </p>
          )}

        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          <main className="lg:col-span-2">

            <div className="rounded-xl border bg-white p-6 shadow-sm">

              {children}

            </div>

          </main>

          {sidebar && (
            <aside className="space-y-6">

              {sidebar}

            </aside>
          )}

        </div>

      </section>
    </>
  );
}