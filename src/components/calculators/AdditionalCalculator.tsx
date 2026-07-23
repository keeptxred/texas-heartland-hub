import { useMemo, useState } from "react";
import CalculatorInputField from "@/components/calculators/CalculatorInputField";
import CalculatorInputGrid from "@/components/calculators/CalculatorInputGrid";
import CalculatorPageTemplate from "@/components/calculators/CalculatorPageTemplate";
import CalculatorResultsGrid from "@/components/calculators/CalculatorResultsGrid";
import CalculatorSEOContent from "@/components/calculators/CalculatorSEOContent";
import { getAdditionalCalculatorDefinition } from "@/lib/calculators/additionalCalculatorSuite";

export default function AdditionalCalculator({ calculatorKey }: { calculatorKey: string }) {
  const definition = getAdditionalCalculatorDefinition(calculatorKey);
  const [inputs, setInputs] = useState<Record<string, number>>(() =>
    Object.fromEntries(definition.fields.map((item) => [item.key, item.defaultValue])),
  );
  const results = useMemo(() => definition.calculate(inputs), [definition, inputs]);

  return (
    <CalculatorPageTemplate
      title={definition.title}
      description={definition.description}
      category={definition.category}
      slug={definition.slug}
      lastUpdated="July 2026"
      shareText={`Estimate results with the ${definition.title}.`}
      faqs={definition.faq}
      relatedCategory={definition.category}
    >
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
            onChange={(value) =>
              setInputs((current) => ({ ...current, [item.key]: Number(value) || 0 }))
            }
          />
        ))}
      </CalculatorInputGrid>
      <CalculatorResultsGrid title="Estimated results" results={results} />
      <CalculatorSEOContent
        sections={[
          {
            heading: `How to use the ${definition.title}`,
            content:
              "Enter values that reflect your situation. Results update immediately and use the assumptions shown in the form. Review the estimate alongside official quotes, tax records, program rules, and provider information before making a financial decision.",
          },
          {
            heading: "Texas-specific estimate",
            content:
              "Texas costs vary by county, city, school district, insurance territory, utility provider, housing characteristics, and household circumstances. Adjust every available input for the most useful estimate.",
          },
        ]}
      />
    </CalculatorPageTemplate>
  );
}
