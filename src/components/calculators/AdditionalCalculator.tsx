import { useMemo, useState } from "react";
import CalculatorInputField from "@/components/calculators/CalculatorInputField";
import CalculatorInputGrid from "@/components/calculators/CalculatorInputGrid";
import CalculatorPageTemplate from "@/components/calculators/CalculatorPageTemplate";
import CalculatorResultsGrid from "@/components/calculators/CalculatorResultsGrid";
import CalculatorSEOContent from "@/components/calculators/CalculatorSEOContent";
import { getAdditionalCalculatorDefinition } from "@/lib/calculators/additionalCalculatorSuite";

interface AdditionalCalculatorProps {
  calculatorKey: string;
  title?: string;
  description?: string;
  slug?: string;
}

export default function AdditionalCalculator({ calculatorKey, title, description, slug }: AdditionalCalculatorProps) {
  const definition = getAdditionalCalculatorDefinition(calculatorKey);
  const displayTitle = title ?? definition.title;
  const displayDescription = description ?? definition.description;
  const displaySlug = slug ?? definition.slug;
  const defaults = () => Object.fromEntries(definition.fields.map((item) => [item.key, item.defaultValue]));
  const [inputs, setInputs] = useState<Record<string, number>>(defaults);
  const errors = useMemo(() => definition.validate?.(inputs) ?? {}, [definition, inputs]);
  const hasErrors = Object.keys(errors).length > 0;
  const results = useMemo(() => hasErrors ? [] : definition.calculate(inputs), [definition, hasErrors, inputs]);

  return (
    <CalculatorPageTemplate
      title={displayTitle}
      description={displayDescription}
      category={definition.category}
      slug={displaySlug}
      lastUpdated="July 2026"
      shareText={`Estimate results with the ${displayTitle}.`}
      faqs={definition.faq}
      relatedCategory={definition.category}
    >
      {definition.presets?.length ? (
        <section className="mb-6 rounded-xl border bg-gray-50 p-4">
          <h2 className="font-semibold text-gray-900">Example scenarios</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {definition.presets.map((preset) => (
              <button key={preset.label} type="button" title={preset.description} onClick={() => setInputs((current) => ({ ...current, ...preset.values }))} className="rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-700">
                {preset.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <CalculatorInputGrid title="Enter your information" columns={2}>
        {definition.fields.map((item) => (
          <CalculatorInputField
            key={item.key}
            id={`${calculatorKey}-${item.key}`}
            label={item.label}
            value={inputs[item.key] ?? 0}
            prefix={item.prefix}
            suffix={item.suffix}
            helpText={item.helpText}
            min={item.min}
            max={item.max}
            step={item.step}
            required={item.required}
            error={errors[item.key]}
            onChange={(value) => setInputs((current) => ({ ...current, [item.key]: Number(value) || 0 }))}
          />
        ))}
      </CalculatorInputGrid>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setInputs(defaults())} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Reset to defaults</button>
        <button type="button" onClick={() => setInputs(Object.fromEntries(definition.fields.map((item) => [item.key, 0])))} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Clear all</button>
      </div>

      {hasErrors ? (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Correct the highlighted inputs to view an estimate.</div>
      ) : (
        <CalculatorResultsGrid title="Estimated results" results={results} />
      )}

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900">What this result means</h2>
          <p className="mt-2 text-sm text-gray-600">{definition.resultMeaning}</p>
        </div>
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900">Assumptions used</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {definition.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
          </ul>
        </div>
      </section>

      <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{definition.disclaimer}</p>

      <CalculatorSEOContent sections={[
        { heading: `How to use the ${displayTitle}`, content: "Enter values that reflect your situation. Results appear after all fields pass validation. Use an example scenario to explore the tool, then replace every assumption with information that applies to you." },
        { heading: "Privacy and educational use", content: "The estimate runs in your browser and does not require an account. Results are educational estimates, not tax, legal, insurance, lending, investment, or program-eligibility advice." },
      ]} />
    </CalculatorPageTemplate>
  );
}
