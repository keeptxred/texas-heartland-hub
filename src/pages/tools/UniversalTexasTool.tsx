import { useEffect, useMemo, useState } from "react";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import { getCalculatorSources, isSourceStale } from "@/data/calculatorSourceMetadata";
import { calculateRemainingTool, RemainingTexasTool, remainingTexasTools } from "@/data/remainingTexasTools";
import { trackCalculationCompleted, trackCalculatorOpened, trackResultsShared, trackValidationError } from "@/lib/analytics/calculatorAnalytics";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function readInput(name: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const raw = new URLSearchParams(window.location.search).get(name);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function disclaimerFor(tool: RemainingTexasTool) {
  if (tool.id.includes("flood")) return "This awareness score is not a flood-zone determination, engineering report, insurance decision, or substitute for FEMA and local floodplain records.";
  if (tool.id.includes("crime") || tool.id.includes("safety")) return "This comparison is not a prediction of personal safety. Verify current agency data and evaluate the specific neighborhood and address.";
  if (tool.category === "Taxes") return "This estimate is not tax advice or an official appraisal, exemption, assessment, or tax-bill determination.";
  if (tool.category === "Insurance") return "This estimate is not insurance advice, an underwriting decision, or a coverage quote.";
  if (tool.category === "Housing") return "This estimate is not lending, appraisal, inspection, builder, or real-estate advice and is not an approval or quote.";
  return "This planning estimate is not a quote, guarantee, legal opinion, or financial advice.";
}

export default function UniversalTexasTool({ tool }: { tool: RemainingTexasTool }) {
  const [a, setA] = useState(() => readInput("a", tool.defaults[0]));
  const [b, setB] = useState(() => readInput("b", tool.defaults[1]));
  const [c, setC] = useState(() => readInput("c", tool.defaults[2]));
  const [shareStatus, setShareStatus] = useState("");
  const result = useMemo(() => calculateRemainingTool(tool, a, b, c), [tool, a, b, c]);
  const formatted = tool.unit === "currency" ? money.format(result) : tool.unit === "years" ? `${result.toFixed(1)} years` : `${result.toFixed(1)}${tool.unit === "score" ? "/100" : ""}`;
  const relatedTools = remainingTexasTools.filter((candidate) => candidate.category === tool.category && candidate.id !== tool.id).slice(0, 3);
  const sources = getCalculatorSources(tool.id);
  const hasStaleSource = sources.some((source) => isSourceStale(source));
  const disclaimer = disclaimerFor(tool);

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

  const downloadReport = () => {
    const report = [
      tool.title,
      "",
      `${tool.labels[0]}: ${a}`,
      `${tool.labels[1]}: ${b}`,
      `${tool.labels[2]}: ${c}`,
      `Estimated result: ${formatted}`,
      `Formula version: ${tool.formulaVersion}`,
      `Formula reviewed: ${tool.reviewedOn}`,
      `Source status: ${sources.length > 0 ? "official references with editable local inputs" : "editable planning assumptions"}`,
      ...sources.flatMap((source) => [
        `Source: ${source.agency} — ${source.title}`,
        `URL: ${source.url}`,
        `Reviewed: ${source.reviewedOn}; review after: ${source.reviewAfter}`,
      ]),
      "",
      disclaimer,
      "Verify current local figures before making a decision.",
    ].join("\n");
    const href = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${tool.id}-report.txt`;
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <CalculatorLayout
      title={tool.title}
      description={tool.description}
      canonicalUrl={`https://keeptxred.com${tool.slug}`}
      lastUpdated="July 2026"
      schema={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            name: tool.title,
            description: tool.description,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
            url: `https://keeptxred.com${tool.slug}`,
            isAccessibleForFree: true,
            citation: sources.map((source) => source.url),
          },
          {
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is this an official Texas government estimate?",
                acceptedAnswer: { "@type": "Answer", text: "No. Official sources may support the assumptions, but results remain planning estimates unless explicitly labeled as an official determination." },
              },
              {
                "@type": "Question",
                name: "Does this calculator use AI credits?",
                acceptedAnswer: { "@type": "Answer", text: "No. The calculation runs locally in the browser using deterministic formulas." },
              },
            ],
          },
        ],
      }}
    >
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2" aria-labelledby={`${tool.id}-inputs-heading`}>
          <div className="space-y-4">
            <h2 id={`${tool.id}-inputs-heading`} className="text-lg font-semibold text-gray-900">Calculator inputs</h2>
            {tool.labels.map((label, index) => {
              const values = [a, b, c];
              const setters = [setA, setB, setC];
              const setter = setters[index];
              const inputId = `${tool.id}-input-${index + 1}`;
              return (
                <div className="block" key={label}>
                  <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-800">{label}</label>
                  <input
                    id={inputId}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={values[index]}
                    onChange={(event) => setter(Number(event.target.value))}
                    className="w-full rounded-md border px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  />
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-gray-950 p-6 text-white" aria-live="polite" aria-atomic="true">
            <p className="text-sm uppercase tracking-wide text-gray-300">Estimated result</p>
            <p className="mt-3 break-words text-4xl font-bold">{formatted}</p>
            <p className="mt-5 text-sm leading-6 text-gray-300">{disclaimer}</p>
          </div>
        </section>

        <section className="rounded-xl border p-5 text-sm text-gray-600">
          <h2 className="font-semibold text-gray-900">Data and assumptions</h2>
          <p className="mt-2">Formula version {tool.formulaVersion}. Formula review: {tool.reviewedOn}. Result inputs remain editable planning assumptions unless an exact official local value is entered.</p>
          {hasStaleSource && (
            <p role="alert" className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 font-medium text-amber-900">
              One or more source reviews are overdue. Verify current agency data before relying on this estimate.
            </p>
          )}
          {sources.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {sources.map((source) => (
                <li key={source.url} className="rounded-md border p-3">
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-red-700 underline underline-offset-2">
                    {source.agency}: {source.title}
                  </a>
                  <p className="mt-1">{source.scopeNote}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {source.effectiveOn ? `Effective ${source.effectiveOn}. ` : ""}Reviewed {source.reviewedOn}; next review {source.reviewAfter}.
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">No official statewide dataset currently controls this result. Replace the defaults with current local figures before making a decision.</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => window.print()} className="rounded-md border px-4 py-2 font-medium text-gray-900">Print or save results</button>
            <button type="button" onClick={downloadReport} className="rounded-md border px-4 py-2 font-medium text-gray-900">Download report</button>
            <button type="button" onClick={shareResults} className="rounded-md border px-4 py-2 font-medium text-gray-900">Copy shareable link</button>
            {shareStatus && <span role="status" className="text-gray-700">{shareStatus}</span>}
          </div>
        </section>

        {relatedTools.length > 0 && (
          <nav aria-label="Related calculators" className="rounded-xl border p-5">
            <h2 className="font-semibold text-gray-900">Related Texas tools</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((related) => (
                <li key={related.id}>
                  <a href={related.slug} className="block rounded-md border p-3 font-medium text-red-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                    {related.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </CalculatorLayout>
  );
}
