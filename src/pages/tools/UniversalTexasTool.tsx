import { useMemo, useState } from "react";
import { calculateRemainingTool, RemainingTexasTool } from "@/data/remainingTexasTools";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function UniversalTexasTool({ tool }: { tool: RemainingTexasTool }) {
  const [a, setA] = useState(tool.defaults[0]);
  const [b, setB] = useState(tool.defaults[1]);
  const [c, setC] = useState(tool.defaults[2]);
  const result = useMemo(() => calculateRemainingTool(tool, a, b, c), [tool, a, b, c]);
  const formatted = tool.unit === "currency" ? money.format(result) : `${result.toFixed(1)}${tool.unit === "score" ? "/100" : ""}`;

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
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={values[index]}
                  onChange={(event) => setters[index](Number(event.target.value))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>
            );
          })}
        </div>

        <div className="rounded-lg bg-gray-950 p-6 text-white">
          <p className="text-sm uppercase tracking-wide text-gray-300">Estimated result</p>
          <p className="mt-3 text-4xl font-bold">{formatted}</p>
          <p className="mt-5 text-sm leading-6 text-gray-300">
            This planning estimate uses the assumptions entered above. It is not a quote, appraisal, tax determination,
            insurance decision, flood determination, legal opinion, or financial advice.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border p-5 text-sm text-gray-600">
        <h2 className="font-semibold text-gray-900">Data and assumptions</h2>
        <p className="mt-2">
          Formula version 1.0. Inputs are editable so visitors can replace statewide planning assumptions with current local figures.
          Authoritative county, city, ISD, utility, toll, flood, and market datasets are tracked separately for scheduled updates.
        </p>
        <button type="button" onClick={() => window.print()} className="mt-4 rounded-md border px-4 py-2 font-medium text-gray-900">
          Print or save results
        </button>
      </section>
    </main>
  );
}
