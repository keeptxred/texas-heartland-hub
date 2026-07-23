import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-property-tax-increase-calculator")({
  component: () => (
    <AdditionalCalculator
      calculatorKey="propertyTaxImpact"
      title="Texas Property Tax Increase Calculator"
      description="Estimate how appraisal and combined tax-rate changes could increase or decrease a Texas property-tax bill."
      slug="/texas-property-tax-increase-calculator"
    />
  ),
});
