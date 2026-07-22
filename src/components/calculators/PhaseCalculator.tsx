import React, { useMemo, useState } from "react";
import CalculatorInputField from "@/components/calculators/CalculatorInputField";
import CalculatorInputGrid from "@/components/calculators/CalculatorInputGrid";
import CalculatorPageTemplate from "@/components/calculators/CalculatorPageTemplate";
import CalculatorResultsGrid from "@/components/calculators/CalculatorResultsGrid";
import CalculatorSEOContent from "@/components/calculators/CalculatorSEOContent";
import { getPhaseCalculatorDefinition } from "@/lib/calculators/phaseCalculatorSuite";

export default function PhaseCalculator({ calculatorKey }: { calculatorKey: string }) {
  const definition = getPhaseCalculatorDefinition(calculatorKey);
  const [inputs, setInputs] = useState<Record<string, number>>(() => Object.fromEntries(definition.fields.map(field => [field.key, field.defaultValue])));
  const results = useMemo(() => definition.calculate(inputs), [definition, inputs]);
  return (
    <CalculatorPageTemplate title={definition.title} description={definition.description} category={definition.category} slug={definition.slug} lastUpdated="July 2026" shareText={`Estimate results with the ${definition.title}.`} faqs={definition.faq} relatedCategory={definition.category}>
      <CalculatorInputGrid title="Enter your information" columns={2}>
        {definition.fields.map(field => <CalculatorInputField key={field.key} id={`${calculatorKey}-${field.key}`} label={field.label} value={inputs[field.key]} prefix={field.prefix} suffix={field.suffix} helpText={field.helpText} onChange={value => setInputs(current => ({ ...current, [field.key]: Number(value) || 0 }))} />)}
      </CalculatorInputGrid>
      <CalculatorResultsGrid title="Estimated results" results={results} />
      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full text-sm"><tbody>{results.map(result => <tr key={result.label} className="border-b last:border-0"><th className="px-4 py-3 text-left font-medium">{result.label}</th><td className="px-4 py-3 text-right">{result.type === "percent" ? `${result.value.toFixed(2)}%` : result.value.toLocaleString("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 })}</td></tr>)}</tbody></table>
      </div>
      <CalculatorSEOContent sections={[{ heading:`How to use the ${definition.title}`, content:"Enter values that reflect your situation. Results update immediately and use the assumptions shown in the form. Review the estimate alongside official quotes, tax records, and program rules before making a financial decision." },{ heading:"Texas-specific estimate", content:"Texas housing costs vary widely by county, city, school district, insurance territory, utility provider, and property characteristics. Adjust every available input for the most useful estimate." }]} />
    </CalculatorPageTemplate>
  );
}
