import { useEffect, useMemo, useState } from "react";
import { calculateRemainingTool, RemainingTexasTool } from "@/data/remainingTexasTools";
import { trackCalculationCompleted, trackCalculatorOpened, trackResultsShared } from "@/lib/analytics/calculatorAnalytics";

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
    await navigator.clipboard.writeText(url.toString());
    trackResultsShared(tool.id);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">Texas Financial Tools</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">{tool.title}</h1>
        <p className="mt-3 max-w-3xl text-gray-600">{tool.description}</p>
      </header>

      <section className="grid gap-6 rounded-xl border bg-white p-5 shadow-sm md:grid-cols-2">
        <div className="space-y-4">
          {tool.labels.map((label, index) => {
            const values = [a, b, c];
            const setters = [setA, setB, setC];
            return (
              <label className="block" key={label}>
                <span className="mb-1 block text-sm font-medium text-gray-800">{label}</span>
                <input type="number" min="0" step="any" value={values[index]} onChange={(event) => setters[index](Number(event.target.value))} className="w-full rounded-md border px-3 py-2" />
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

      <section className="mt-8 rounded-xl border p-5 text-sm text-gray-600">
        <h2 className="font-semibold text-gray-900">Data and assumptions</h2>
        <p className="mt-2">Formula version {tool.formulaVersion}. Source status: {tool.sourceStatus === "official-data" ? "official data" : "editable planning assumptions"}. Last formula review: {tool.reviewedOn}.</p>
        <p className="mt-2">Replace statewide assumptions with current local figures before making a financial decision. Authoritative county, city, ISD, utility, toll, flood, and market datasets are maintained separately.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => window.print()} className="rounded-md border px-4 py-2 font-medium text-gray-900">Print or save results</button>
          <button type="button" onClick={shareResults} className="rounded-md border px-4 py-2 font-medium text-gray-900">Copy shareable link</button>
        </div>
      </section>
    </main>
  );
}
