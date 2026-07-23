import { useEffect, useMemo, useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { calculateRemainingTool, RemainingTexasTool } from "@/data/remainingTexasTools";
import { trackCalculationCompleted, trackCalculatorOpened, trackResultsShared, trackValidationError } from "@/lib/analytics/calculatorAnalytics";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function readInput(name: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const value = Number(new URLSearchParams(window.location.search).get(name));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export default function UniversalTexasTool({ tool }: { tool: RemainingTexasTool }) {
  const [a, setA] = useState(() => readInput("a", tool.defaults[0]));
  const [b, setB] = useState(() => readInput("b", tool.defaults[1]));
  const [c, setC] = useState(() => readInput("c", tool.defaults[2]));
  const [shareStatus, setShareStatus] = useState("");
  const result = useMemo(() => calculateRemainingTool(tool, a, b, c), [tool, a, b, c]);
  const formatted = tool.unit === "currency" ? money.format(result) : tool.unit === "years" ? `${result.toFixed(1)} years` : `${result.toFixed(1)}${tool.unit === "score" ? "/100" : ""}`;

  useEffect(() => {
    trackCalculatorOpened(tool.id);
  }, [tool.id]);

  useEffect(() => {
    trackCalculationCompleted(tool.id, { result, formulaVersion: tool.formulaVersion });
  }, [tool.id, tool.formulaVersion, result]);

  const shareResults = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("a", String(a));
    url.searchParams.set("b", String(b));
    url.searchParams.set("c", String(c));
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("Link copied");
      trackResultsShared(tool.id);
    } catch {
      setShareStatus("Copy the URL from your browser address bar");
      trackValidationError(tool.id, ["clipboard_unavailable"]);
    }
  };

  return (
    <CalculatorLayout
      title={tool.title}
      description={tool.description}
      canonicalUrl={`https://keeptxred.com${tool.slug}`}
      lastUpdated="July 2026"
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.title,
        description: tool.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        url: `https://keeptxred.com${tool.slug}`,
        isAccessibleForFree: true,
      }}
    >
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {tool.labels.map((label, index) => {
              const values = [a, b, c];
              const setters = [setA, setB, setC];
              const setter = setters[index];
              return (
                <label className="block" key={label}>
                  <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={values[index]}
                    onChange={(event) => setter(Number(event.target.value))}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </label>
              );
            })}
          </div>

          <div className="rounded-lg bg-gray-950 p-6 text-white">
            <p className="text-sm uppercase tracking-wide text-gray-300">Estimated result</p>
            <p className="mt-3 text-4xl font-bold">{formatted}</p>
            <p className="mt-5 text-sm leading-6 text-gray-300">This planning estimate is not a quote, appraisal, tax determination, insurance decision, flood determination, legal opinion, or financial advice.</p>
          </div>
        </section>

        <section className="rounded-xl border p-5 text-sm text-gray-600">
          <h2 className="font-semibold text-gray-900">Data and assumptions</h2>
          <p className="mt-2">Formula version {tool.formulaVersion}. Source status: {tool.sourceStatus === "official-data" ? "official data" : "editable planning assumptions"}. Last formula review: {tool.reviewedOn}.</p>
          <p className="mt-2">Replace statewide assumptions with current local figures before making a financial decision. Authoritative county, city, ISD, utility, toll, flood, and market datasets are maintained separately.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => window.print()} className="rounded-md border px-4 py-2 font-medium text-gray-900">Print or save results</button>
            <button type="button" onClick={shareResults} className="rounded-md border px-4 py-2 font-medium text-gray-900">Copy shareable link</button>
            {shareStatus && <span role="status" className="text-gray-700">{shareStatus}</span>}
          </div>
        </section>
      </div>
    </CalculatorLayout>
  );
}
