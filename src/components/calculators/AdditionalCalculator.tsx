import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import CalculatorInputField from "@/components/calculators/CalculatorInputField";
import CalculatorInputGrid from "@/components/calculators/CalculatorInputGrid";
import CalculatorPageTemplate from "@/components/calculators/CalculatorPageTemplate";
import CalculatorResultsGrid from "@/components/calculators/CalculatorResultsGrid";
import CalculatorScenarioActions from "@/components/calculators/CalculatorScenarioActions";
import CalculatorSEOContent from "@/components/calculators/CalculatorSEOContent";
import { getAdditionalCalculatorDefinition } from "@/lib/calculators/additionalCalculatorSuite";
import type { AdditionalCalculatorField } from "@/types/calculators/additionalCalculator";

interface AdditionalCalculatorProps {
  calculatorKey: string;
  title?: string;
  description?: string;
  slug?: string;
}

const relatedTools: Record<string, Array<{ title: string; to: string; reason: string }>> = {
  homeInsurance: [
    {
      title: "Homeownership Cost",
      to: "/texas-homeownership-cost-calculator",
      reason: "Add insurance to the full monthly ownership estimate.",
    },
  ],
  utilityCost: [
    {
      title: "Homeownership Cost",
      to: "/texas-homeownership-cost-calculator",
      reason: "Carry estimated utilities into a complete housing budget.",
    },
  ],
  movingCost: [
    {
      title: "Cost of Living",
      to: "/texas-cost-of-living-calculator",
      reason: "Compare recurring costs after the one-time move.",
    },
  ],
  propertyTaxImpact: [
    {
      title: "Budget Planner",
      to: "/texas-budget-planner",
      reason: "See how the monthly tax change affects household cash flow.",
    },
  ],
  downPaymentAssistance: [
    {
      title: "Down Payment Calculator",
      to: "/texas-down-payment-calculator",
      reason: "Compare assistance with common down-payment targets.",
    },
  ],
  salaryComparison: [
    {
      title: "Home Affordability",
      to: "/texas-home-affordability-calculator",
      reason: "Use the equivalent Texas salary to test a housing range.",
    },
  ],
};

function formatPresetValue(value: number, field: AdditionalCalculatorField) {
  if (field.prefix === "$") {
    const formatted = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    });
    return field.suffix ? `${formatted}${field.suffix}` : formatted;
  }

  const formatted = value.toLocaleString("en-US", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });
  return `${field.prefix ?? ""}${formatted}${field.suffix ? ` ${field.suffix}` : ""}`;
}

export default function AdditionalCalculator({
  calculatorKey,
  title,
  description,
  slug,
}: AdditionalCalculatorProps) {
  const definition = getAdditionalCalculatorDefinition(calculatorKey);
  const displayTitle = title ?? definition.title;
  const displayDescription = description ?? definition.description;
  const displaySlug = slug ?? definition.slug;
  const defaults = () =>
    Object.fromEntries(definition.fields.map((item) => [item.key, item.defaultValue]));
  const [inputs, setInputs] = useState<Record<string, number>>(defaults);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string | null>(null);
  const errors = useMemo(() => definition.validate?.(inputs) ?? {}, [definition, inputs]);
  const hasErrors = Object.keys(errors).length > 0;
  const results = useMemo(
    () => (hasErrors ? [] : definition.calculate(inputs)),
    [definition, hasErrors, inputs],
  );
  const selectedPreset = definition.presets?.find((preset) => preset.label === selectedPresetLabel);
  const selectedPresetInputs = selectedPreset ? { ...defaults(), ...selectedPreset.values } : null;

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
        <section className="mb-6 rounded-xl border bg-gray-50 p-4 print:hidden">
          <h2 className="font-semibold text-gray-900">Example scenarios</h2>
          <p className="mt-1 text-sm text-gray-600">
            Choose an example to fill every calculator field with a complete set of illustrative
            assumptions.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {definition.presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                aria-pressed={selectedPresetLabel === preset.label}
                aria-controls="selected-example-scenario"
                onClick={() => {
                  setInputs({ ...defaults(), ...preset.values });
                  setSelectedPresetLabel(preset.label);
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-700 ${
                  selectedPresetLabel === preset.label
                    ? "border-red-700 bg-red-700 text-white"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {selectedPreset && selectedPresetInputs ? (
            <div
              id="selected-example-scenario"
              className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
            >
              <h3 className="font-semibold text-gray-900">{selectedPreset.label}</h3>
              <p className="mt-1 text-sm text-gray-600">{selectedPreset.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Assumptions loaded
              </p>
              <dl className="mt-2 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                {definition.fields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-baseline justify-between gap-3 border-b border-gray-100 py-1"
                  >
                    <dt className="text-gray-600">{field.label}</dt>
                    <dd className="text-right font-medium text-gray-900">
                      {formatPresetValue(selectedPresetInputs[field.key] ?? 0, field)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      <CalculatorInputGrid
        title="Enter your information"
        description="All fields are required. An asterisk (*) marks each required field."
        columns={2}
      >
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
            onChange={(value) => {
              setInputs((current) => ({ ...current, [item.key]: Number(value) || 0 }));
              setSelectedPresetLabel(null);
            }}
          />
        ))}
      </CalculatorInputGrid>

      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          onClick={() => {
            setInputs(defaults());
            setSelectedPresetLabel(null);
          }}
          className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Reset to defaults
        </button>
        <button
          type="button"
          onClick={() => {
            setInputs(Object.fromEntries(definition.fields.map((item) => [item.key, 0])));
            setSelectedPresetLabel(null);
          }}
          className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Clear all
        </button>
      </div>

      {hasErrors ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          Correct the highlighted inputs to view an estimate.
        </div>
      ) : (
        <div aria-live="polite">
          <CalculatorResultsGrid title="Estimated results" results={results} />
        </div>
      )}

      <CalculatorScenarioActions
        calculatorKey={calculatorKey}
        title={displayTitle}
        inputs={inputs}
        results={results}
        onLoad={(saved) => {
          setInputs((current) => ({ ...current, ...saved }));
          setSelectedPresetLabel(null);
        }}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900">What this result means</h2>
          <p className="mt-2 text-sm text-gray-600">{definition.resultMeaning}</p>
        </div>
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900">Assumptions used</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {definition.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
      </section>

      <details className="mt-6 rounded-xl border p-5">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Calculation methodology and data status
        </summary>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <p>
            The calculator applies the displayed inputs to a deterministic educational model in your
            browser. It does not request a lender, insurer, taxing authority, employer, utility
            provider, or program decision.
          </p>
          <p>
            <strong>Data status:</strong> Values you enter are user assumptions. Preset and default
            values are illustrative Texas estimates unless the page explicitly identifies an
            official published source and year.
          </p>
          <p>
            <strong>Model version:</strong> {calculatorKey}-v1.1 · Last reviewed July 2026.
          </p>
        </div>
      </details>

      {relatedTools[calculatorKey]?.length ? (
        <section className="mt-6 rounded-xl border p-5 print:hidden">
          <h2 className="font-semibold text-gray-900">Continue your estimate</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {relatedTools[calculatorKey].map((tool) => (
              <Link key={tool.to} to={tool.to} className="rounded-lg border p-4 hover:bg-gray-50">
                <span className="font-semibold text-red-700">{tool.title} →</span>
                <p className="mt-1 text-sm text-gray-600">{tool.reason}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        {definition.disclaimer}
      </p>

      <CalculatorSEOContent
        sections={[
          {
            heading: `How to use the ${displayTitle}`,
            content:
              "Enter values that reflect your situation. Results appear after all fields pass validation. Use an example scenario to explore the tool, then replace every assumption with information that applies to you.",
          },
          {
            heading: "Privacy and educational use",
            content:
              "The estimate runs in your browser and does not require an account. Saved scenarios remain in local browser storage. Results are educational estimates, not tax, legal, insurance, lending, investment, or program-eligibility advice.",
          },
        ]}
      />
    </CalculatorPageTemplate>
  );
}
